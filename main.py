
import hashlib
import hmac
import logging
import os
import re
import secrets
import smtplib
import ssl
from contextlib import asynccontextmanager
from email.message import EmailMessage
from typing import Literal

import redis
import requests
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel, ConfigDict, Field, field_validator
from redis.exceptions import RedisError

load_dotenv()

# --------------------------------------------------
# Configuration
# --------------------------------------------------

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("tena.otp")

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
OTP_HMAC_SECRET = os.getenv("OTP_HMAC_SECRET", "")
APP_NAME = os.getenv("APP_NAME", "Tena+")

OTP_LENGTH = 6
OTP_TTL = 300                  # 5 minutes
MAX_ATTEMPTS = 5
RESEND_COOLDOWN = 60           # 1 minute
IP_WINDOW = 600                # 10 minutes
IP_MAX_REQUESTS = 10

if not OTP_HMAC_SECRET:
    raise RuntimeError(
        "OTP_HMAC_SECRET is missing. Configure it in your .env file."
    )

r = redis.Redis.from_url(
    REDIS_URL,
    decode_responses=True,
    socket_connect_timeout=3,
    socket_timeout=3,
    health_check_interval=30,
)

# --------------------------------------------------
# Atomic Redis operations
# --------------------------------------------------

INCREMENT_WITH_TTL = r.register_script("""
local count = redis.call('INCR', KEYS[1])
if count == 1 then
    redis.call('EXPIRE', KEYS[1], ARGV[1])
end
return count
""")

RELEASE_COOLDOWN = r.register_script("""
if redis.call('GET', KEYS[1]) == ARGV[1] then
    redis.call('DEL', KEYS[1])
    redis.call('DEL', KEYS[2])
    return 1
end
return 0
""")

VERIFY_OTP = r.register_script("""
local stored = redis.call('GET', KEYS[1])

if not stored then
    return -1
end

local attempts = redis.call('INCR', KEYS[2])

if attempts == 1 then
    redis.call('EXPIRE', KEYS[2], ARGV[1])
end

if attempts > tonumber(ARGV[2]) then
    return -2
end

if stored ~= ARGV[3] then
    return 0
end

redis.call('DEL', KEYS[1], KEYS[2])
return 1
""")

# --------------------------------------------------
# Application lifecycle
# --------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        r.ping()
        logger.info("Redis connection established")
    except RedisError as exc:
        logger.error("Redis connection failed")
        raise RuntimeError("Redis is unavailable") from exc

    yield
    r.close()


app = FastAPI(
    title=f"{APP_NAME} OTP API",
    version="1.0.0",
    lifespan=lifespan,
)

# --------------------------------------------------
# Request models
# --------------------------------------------------

class OtpRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    channel: Literal["sms", "email"]
    phone: str | None = Field(default=None, max_length=32)
    email: str | None = Field(default=None, max_length=254)


class OtpVerify(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    target: str = Field(min_length=1, max_length=254)
    code: str = Field(pattern=r"^\d{6}$")
    channel: Literal["sms", "email"] | None = None


# --------------------------------------------------
# Normalization and storage helpers
# --------------------------------------------------

def normalize_phone(phone: str) -> str:
    phone = phone.strip()

    # Permit common phone-number formatting, but reject letters.
    if not re.fullmatch(r"[+\d\s().-]+", phone):
        raise HTTPException(
            status_code=422,
            detail="Invalid Ethiopian mobile number",
        )

    digits = re.sub(r"\D", "", phone)

    if digits.startswith("0"):
        digits = "251" + digits[1:]
    elif len(digits) == 9 and digits[0] in "79":
        digits = "251" + digits

    if not re.fullmatch(r"251[79]\d{8}", digits):
        raise HTTPException(
            status_code=422,
            detail="Invalid Ethiopian mobile number",
        )

    return digits


def normalize_email(email: str) -> str:
    email = email.strip().lower()

    if len(email) > 254 or not re.fullmatch(
        r"[^@\s]+@[^@\s]+\.[^@\s]+", email
    ):
        raise HTTPException(
            status_code=422,
            detail="Invalid email address",
        )

    return email


def normalize_target(channel: str, target: str) -> str:
    if channel == "sms":
        return normalize_phone(target)
    return normalize_email(target)


def target_keys(channel: str, target: str) -> tuple[str, str, str]:
    # Avoid putting phone numbers and email addresses directly in Redis keys.
    fingerprint = hashlib.sha256(
        f"{channel}:{target}".encode("utf-8")
    ).hexdigest()

    prefix = f"otp:{fingerprint}"

    return (
        f"{prefix}:code",
        f"{prefix}:cooldown",
        f"{prefix}:attempts",
    )


def hash_code(channel: str, target: str, code: str) -> str:
    message = f"{channel}:{target}:{code}".encode("utf-8")

    return hmac.new(
        OTP_HMAC_SECRET.encode("utf-8"),
        message,
        hashlib.sha256,
    ).hexdigest()


def get_client_ip(request: Request) -> str:
    # Do not trust arbitrary X-Forwarded-For headers.
    return request.client.host if request.client else "unknown"


def enforce_ip_limit(ip: str) -> None:
    ip_hash = hashlib.sha256(ip.encode("utf-8")).hexdigest()
    key = f"otp:ip:{ip_hash}"

    try:
        count = int(INCREMENT_WITH_TTL(
            keys=[key],
            args=[IP_WINDOW],
        ))
    except RedisError as exc:
        logger.error("Redis rate-limit operation failed")
        raise HTTPException(
            status_code=503,
            detail="Verification service temporarily unavailable",
        ) from exc

    if count > IP_MAX_REQUESTS:
        raise HTTPException(
            status_code=429,
            detail="Too many requests. Please try again later.",
        )


# --------------------------------------------------
# Delivery
# --------------------------------------------------

def send_sms(phone: str, message: str) -> None:
    api_key = os.getenv("SMSETHIOPIA_KEY")

    if not api_key:
        raise RuntimeError("SMS provider is not configured")

    response = requests.post(
        "https://smsethiopia.com/api/sms/send",
        headers={"KEY": api_key},
        json={"msisdn": phone, "text": message},
        timeout=8,
    )

    response.raise_for_status()


def send_email(to_email: str, text: str) -> None:
    username = os.getenv("GMAIL_USER")
    password = os.getenv("GMAIL_APP_PASSWORD")

    if not username or not password:
        raise RuntimeError("Email provider is not configured")

    message = EmailMessage()
    message["Subject"] = f"{APP_NAME} verification code"
    message["From"] = username
    message["To"] = to_email
    message.set_content(text)

    # Google displays App Passwords with spaces; remove them if present.
    password = password.replace(" ", "")

    with smtplib.SMTP("smtp.gmail.com", 587, timeout=10) as smtp:
        smtp.ehlo()
        smtp.starttls(context=ssl.create_default_context())
        smtp.ehlo()
        smtp.login(username, password)
        smtp.send_message(message)


# --------------------------------------------------
# Health check
# --------------------------------------------------

@app.get("/health")
def health():
    try:
        r.ping()
    except RedisError as exc:
        raise HTTPException(
            status_code=503,
            detail="Redis is unavailable",
        ) from exc

    return {"status": "ok", "redis": "connected"}


# --------------------------------------------------
# Request OTP
# --------------------------------------------------

@app.post("/otp/request")
def request_otp(body: OtpRequest, request: Request):
    if body.channel == "sms":
        if not body.phone:
            raise HTTPException(422, "Phone number is required")
        target = normalize_phone(body.phone)

    else:
        if not body.email:
            raise HTTPException(422, "Email address is required")
        target = normalize_email(body.email)

    # Fail early if delivery credentials are missing.
    if body.channel == "sms" and not os.getenv("SMSETHIOPIA_KEY"):
        raise HTTPException(503, "SMS delivery is not configured")

    if body.channel == "email" and not all((
        os.getenv("GMAIL_USER"),
        os.getenv("GMAIL_APP_PASSWORD"),
    )):
        raise HTTPException(503, "Email delivery is not configured")

    enforce_ip_limit(get_client_ip(request))

    code_key, cooldown_key, attempts_key = target_keys(
        body.channel, target
    )

    # A unique lock token lets us release only our own cooldown.
    lock_token = secrets.token_urlsafe(24)

    try:
        acquired = r.set(
            cooldown_key,
            lock_token,
            ex=RESEND_COOLDOWN,
            nx=True,
        )
    except RedisError as exc:
        logger.error("Redis request operation failed")
        raise HTTPException(
            503, "Verification service temporarily unavailable"
        ) from exc

    if not acquired:
        raise HTTPException(
            429,
            "Please wait before requesting another code",
        )

    code = "".join(
        secrets.choice("0123456789")
        for _ in range(OTP_LENGTH)
    )

    try:
        r.set(
            code_key,
            hash_code(body.channel, target, code),
            ex=OTP_TTL,
        )
        r.delete(attempts_key)

        message = (
            f"Your {APP_NAME} verification code is {code}. "
            f"It expires in {OTP_TTL // 60} minutes. "
            "If you did not request this, ignore this message."
        )

        if body.channel == "sms":
            send_sms(target, message)
        else:
            send_email(target, message)

    except Exception as exc:
        # Do not log OTPs, passwords, API keys, or provider response bodies.
        logger.warning(
            "OTP delivery failed for channel=%s",
            body.channel,
        )

        try:
            RELEASE_COOLDOWN(
                keys=[cooldown_key, code_key],
                args=[lock_token],
            )
        except RedisError:
            logger.error("Could not release OTP cooldown after failure")

        raise HTTPException(
            status_code=502,
            detail="Could not deliver verification code",
        ) from exc

    return {
        "status": "sent",
        "channel": body.channel,
        "expires_in": OTP_TTL,
        "resend_after": RESEND_COOLDOWN,
    }


# --------------------------------------------------
# Verify OTP
# --------------------------------------------------

@app.post("/otp/verify")
def verify_otp(body: OtpVerify):
    # Explicit channel is recommended. The fallback preserves compatibility
    # with clients that submit only target and code.
    channel = body.channel or (
        "email" if "@" in body.target else "sms"
    )

    target = normalize_target(channel, body.target)

    code_key, _, attempts_key = target_keys(channel, target)

    candidate_hash = hash_code(channel, target, body.code)

    try:
        result = int(VERIFY_OTP(
            keys=[code_key, attempts_key],
            args=[OTP_TTL, MAX_ATTEMPTS, candidate_hash],
        ))
    except RedisError as exc:
        logger.error("Redis verification operation failed")
        raise HTTPException(
            503,
            "Verification service temporarily unavailable",
        ) from exc

    if result == -1:
        return {"valid": False, "message": "Code expired or not found"}

    if result == -2:
        raise HTTPException(
            429,
            "Too many attempts. Request a new code.",
        )

    if result == 0:
        return {"valid": False, "message": "Incorrect verification code"}

    return {"valid": True}
