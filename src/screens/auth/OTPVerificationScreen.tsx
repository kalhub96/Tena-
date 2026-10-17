
import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const LENGTH = 6;
const RESEND_SECONDS = 60;

// Use your computer's LAN IP for a physical phone.
// Example: http://192.168.1.100:8000
const API_BASE_URL = 'http://YOUR_COMPUTER_LAN_IP:8000';

export default function OTPVerificationScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone?: string }>();

  const phoneNumber = Array.isArray(phone) ? phone[0] : phone;

  const [code, setCode] = useState<string[]>(Array(LENGTH).fill(''));
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');

  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setTimeout(() => {
      setSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  const complete = code.every((digit) => digit !== '');
  const busy = verifying || resending;

  const updateCode = (value: string, index: number) => {
    // Supports both one digit and a pasted six-digit code.
    const digits = value.replace(/\D/g, '');

    if (digits.length > 1) {
      const pasted = digits.slice(0, LENGTH).split('');
      const next = Array(LENGTH).fill('');

      pasted.forEach((digit, i) => {
        next[i] = digit;
      });

      setCode(next);
      setError('');

      const focusIndex = Math.min(pasted.length, LENGTH - 1);
      inputs.current[focusIndex]?.focus();
      return;
    }

    const digit = digits.slice(-1);

    setCode((previous) => {
      const next = [...previous];
      next[index] = digit;
      return next;
    });

    setError('');

    if (digit && index < LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key !== 'Backspace' || index === 0) return;

    if (!code[index]) {
      inputs.current[index - 1]?.focus();

      setCode((previous) => {
        const next = [...previous];
        next[index - 1] = '';
        return next;
      });
    }
  };

  const getErrorMessage = (data: any, fallback: string) => {
    if (typeof data?.detail === 'string') return data.detail;
    if (typeof data?.message === 'string') return data.message;
    return fallback;
  };

  const verifyCode = async () => {
    if (!phoneNumber || !complete || busy) return;

    setVerifying(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: phoneNumber,
          code: code.join(''),
          channel: 'sms',
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, 'Invalid or expired verification code.')
        );
      }

      Alert.alert('Verified', 'Your phone number has been verified.');

      // Replace this with your actual next route when ready.
      // Example: router.replace('/(auth)/profile-setup');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not verify the code. Please try again.'
      );
    } finally {
      setVerifying(false);
    }
  };

  const resendCode = async () => {
    if (!phoneNumber || seconds > 0 || busy) return;

    setResending(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/otp/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'sms',
          phone: phoneNumber,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, 'Could not resend the code.')
        );
      }

      setCode(Array(LENGTH).fill(''));
      setSeconds(RESEND_SECONDS);
      inputs.current[0]?.focus();
      Alert.alert('Code sent', 'Check your phone for the new code.');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not resend the code. Please try again.'
      );
    } finally {
      setResending(false);
    }
  };

  if (!phoneNumber) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="mb-4 text-center text-gray-700">
          No phone number was provided. Return and enter your phone number.
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="font-semibold text-teal-600">Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-6 pt-16 pb-10">
      <TouchableOpacity
        onPress={() => router.push('/register')}
        className="mb-8 h-10 w-10 items-center justify-center rounded-full bg-gray-100"
      >
        <Text className="text-lg text-gray-700">←</Text>
      </TouchableOpacity>

      <View className="mb-8 items-center">
        <View className="mb-5 h-20 w-20 items-center justify-center rounded-full bg-teal-50">
          <Text className="text-3xl">📱</Text>
        </View>

        <Text className="mb-2 text-2xl font-extrabold text-gray-900">
          Verify your number
        </Text>

        <Text className="text-center text-sm text-gray-500">
          Enter the 6-digit code sent to{'\n'}
          <Text className="font-semibold text-gray-900">
            {phoneNumber}
          </Text>
        </Text>
      </View>

      <View className="mb-4 flex-row justify-center gap-2">
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputs.current[index] = ref;
            }}
            value={digit}
            onChangeText={(value) => updateCode(value, index)}
            onKeyPress={({ nativeEvent }) =>
              handleKeyPress(nativeEvent.key, index)
            }
            keyboardType="number-pad"
            maxLength={LENGTH}
            selectTextOnFocus
            editable={!busy}
            textAlign="center"
            accessibilityLabel={`Verification digit ${index + 1}`}
            className={`h-14 w-12 rounded-xl border text-xl font-bold ${
              digit
                ? 'border-teal-600 bg-teal-50 text-teal-600'
                : 'border-gray-200 bg-gray-50 text-gray-900'
            }`}
          />
        ))}
      </View>

      {error ? (
        <Text className="mb-4 text-center text-sm text-red-600">
          {error}
        </Text>
      ) : null}

      <Text className="mb-8 text-center text-xs text-gray-400">
        {seconds > 0 ? (
          <>
            Resend code in{' '}
            <Text className="font-semibold text-teal-600">
              0:{String(seconds).padStart(2, '0')}
            </Text>
          </>
        ) : (
          'You can request a new code'
        )}
      </Text>

      <TouchableOpacity
        disabled={!complete || busy}
        onPress={verifyCode}
        activeOpacity={0.85}
        className={`mb-4 flex-row items-center justify-center rounded-xl py-4 ${
          complete && !busy ? 'bg-teal-600' : 'bg-teal-600/40'
        }`}
      >
        {verifying ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text className="text-base font-bold text-white">
            Verify & continue
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        disabled={seconds > 0 || busy}
        onPress={resendCode}
        className="items-center"
      >
        {resending ? (
          <ActivityIndicator color="#0D9488" />
        ) : (
          <Text
            className={`text-sm font-semibold ${
              seconds > 0 || busy ? 'text-gray-300' : 'text-teal-600'
            }`}
          >
            Resend code
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
