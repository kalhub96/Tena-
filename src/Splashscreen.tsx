import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useNavigation } from "@react-navigation/native";

const navigation = useNavigation<any>();

useEffect(() => {
  const t = setTimeout(() => navigation.replace("Home"), 2000);
  return () => clearTimeout(t);
}, []);

export default function SplashScreen() {
    const router = useRouter()

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace('/onboarding')
        }, 2000)

        return () => clearTimeout(timer)
    }, [router])

    return (
        <div className="relative min-h-screen flex flex-col item-center justify-center px-6 gradient-teal overflow-hidden">
            {/* Background decorative circles */}
            <div className="absolute top-[-80px] right-[-80px] w-64 h-64 rounded-full bg-teal-600/20 blur-3xl"/>
            <div className="absolute top-[-80px] right-[-80px] w-64 h-64 rounded-full bg-teal-600/20 blur-3xl"/>
            <div className="absolute bottom-[-60px] left-[-60px] w-56 h-56 rounded-full bg-teal-400/10 blur-3xl"/>
            {/* Main context */}
             <div className="relative flex flex-col items-center z-10">
        {/* App icon */}
        <div className="w-24 h-24 rounded-3xl bg-white shadow-2xl shadow-teal-900/60 flex items-center justify-center mb-6">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24 8C24 8 12 14 12 24C12 30.627 17.373 36 24 36C30.627 36 36 30.627 36 24C36 14 24 8 24 8Z"
              fill="#1e7a6e"
              opacity="0.2"
            />
            <path
              d="M34 20H28V14H20V20H14V28H20V34H28V28H34V20Z"
              fill="#1e7a6e"
            />
            <path
              d="M24 10C24 10 36 18 36 28C36 35.18 30.627 40 24 40C17.373 40 12 35.18 12 28C12 18 24 10 24 10Z"
              fill="#1e7a6e"
              opacity="0.1"
            />
            <path
              d="M22 22H26V30H22V22Z"
              fill="white"
            />
            <path
              d="M18 24H30V28H18V24Z"
              fill="white"
            />
          </svg>
        </div>
 
        {/* Amharic title */}
        <p className="font-ethiopic text-teal-200 text-lg mb-1 tracking-wide">ጤና</p>
 
        {/* Brand name */}
        <h1 className="text-5xl font-extrabold text-white mb-2 tracking-tight">
          Tena<span className="text-teal-300">+</span>
        </h1>
 
        {/* Subtitle */}
        <p className="text-teal-300/80 text-sm font-medium tracking-widest uppercase text-center mb-10">
          National Healthcare Integration System
        </p>
 
        {/* Trust card */}
        <div className="w-full rounded-2xl border border-white/10 gradient-teal-card backdrop-blur-sm p-5 flex flex-col gap-3 mb-10">
          {/* Badge row */}
          <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-white/5">
            <div className="w-8 h-8 rounded-lg bg-teal-600/60 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-teal-200">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <p className="text-white text-xs font-semibold">Government-Grade Security</p>
              <p className="text-teal-400/70 text-xs">256-bit encrypted · ISO 27001</p>
            </div>
          </div>
 
          <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-white/5">
            <div className="w-8 h-8 rounded-lg bg-teal-600/60 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-teal-200">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <div>
              <p className="text-white text-xs font-semibold">Powered by Fayda Digital ID</p>
              <p className="text-teal-400/70 text-xs">Ethiopian National ID Platform</p>
            </div>
          </div>
        </div>
 
        {/* Pulsing dots + status */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-2 items-center">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </div>
          <p className="text-teal-400/70 text-xs tracking-wide">Verifying secure connection...</p>
        </div>
      </div>
        </div>
    )
}

