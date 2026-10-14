import { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const LENGTH = 6;
const RESEND_SECONDS = 59;

export default function OTPVerificationScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone?: string }>();
  const [code, setCode] = useState<string[]>(Array(LENGTH).fill(''));
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const complete = code.every((c) => c !== '');

  const onChange = (v: string, i: number) => {
    const digit = v.replace(/\D/g, '').slice(-1);
    setCode((prev) => {
      const next = [...prev];
      next[i] = digit;
      return next;
    });
    if (digit && i < LENGTH - 1) inputs.current[i + 1]?.focus();
  };

  const onKeyPress = (key: string, i: number) => {
    if (key === 'Backspace' && !code[i] && i > 0) {
      inputs.current[i - 1]?.focus();
      setCode((prev) => {
        const next = [...prev];
        next[i - 1] = '';
        return next;
      });
    }
  };

  const resend = () => {
    setCode(Array(LENGTH).fill(''));
    setSeconds(RESEND_SECONDS);
    inputs.current[0]?.focus();
  };

  return (
    <View className="flex-1 bg-white px-6 pt-16 pb-10">
      <TouchableOpacity
        onPress={() => router.back()}
        className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mb-8"
      >
        <Text className="text-gray-700 text-lg">←</Text>
      </TouchableOpacity>

      <View className="items-center mb-8">
        <View className="w-18 h-18 rounded-full bg-teal-50 items-center justify-center mb-5 p-5">
          <Text className="text-3xl">📱</Text>
        </View>
        <Text className="text-2xl font-extrabold text-gray-900 mb-2">Verify your number</Text>
        <Text className="text-gray-500 text-sm text-center">
          We sent a 6-digit code to{'\n'}
          <Text className="text-gray-900 font-semibold">{phone || '+251 91 234 5678'}</Text>
        </Text>
      </View>

      <View className="flex-row justify-center gap-2 mb-4">
        {code.map((c, i) => (
          <TextInput
            key={i}
            ref={(r) => {
              inputs.current[i] = r;
            }}
            value={c}
            onChangeText={(v) => onChange(v, i)}
            onKeyPress={({ nativeEvent }) => onKeyPress(nativeEvent.key, i)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
            className={`w-12 h-14 rounded-xl border text-xl font-bold ${
              c ? 'border-teal-600 text-teal-600 bg-teal-50' : 'border-gray-200 text-gray-900 bg-gray-50'
            }`}
          />
        ))}
      </View>

      <Text className="text-center text-xs text-gray-400 mb-8">
        {seconds > 0 ? (
          <>Resend code in <Text className="text-teal-600 font-semibold">0:{String(seconds).padStart(2, '0')}</Text></>
        ) : (
          'You can request a new code'
        )}
      </Text>

      <TouchableOpacity
        disabled={!complete}
        onPress={() => Alert.alert('Verified', 'Welcome to Tena+')}
        className={`rounded-xl py-4 items-center mb-4 ${complete ? 'bg-teal-600' : 'bg-teal-600/40'}`}
        activeOpacity={0.85}
      >
        <Text className="text-white font-bold text-base">Verify & continue</Text>
      </TouchableOpacity>

      <TouchableOpacity disabled={seconds > 0} onPress={resend} className="items-center">
        <Text className={`text-sm font-semibold ${seconds > 0 ? 'text-gray-300' : 'text-teal-600'}`}>
          Resend code
        </Text>
      </TouchableOpacity>
    </View>
  );
}
