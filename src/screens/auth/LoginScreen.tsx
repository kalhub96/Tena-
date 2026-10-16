import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, Mail, Lock, Eye, EyeOff, IdCard } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';

const Field = ({ label, icon, children }: any) => (
  <View>
    <Text className="text-gray-600 text-xs font-semibold mb-1">{label}</Text>
    <View className="flex-row items-center border border-gray-200 rounded-xl px-3 bg-gray-50 gap-2">
      {icon}
      {children}
    </View>
  </View>
);

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!form.email || !form.password) return setError('Please fill in all fields');
    if (!form.email.includes('@')) return setError('Please enter a valid email');

    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);

    if (result.error || !result.user) return setError(result.error || 'Login failed');
    router.replace('/'); // TODO: change to the home route once it exists
  };

  return (
    <View className="flex-1 bg-white items-center">
      <View className="flex-1 w-full max-w-md px-6 pt-8 pb-6 justify-between">
        <View className="gap-3">
          {/* Brand */}
          <View className="flex-row items-center gap-2">
            <View className="w-8 h-8 rounded-xl bg-teal-600 items-center justify-center">
              <Heart size={18} color="#fff" fill="#fff" />
            </View>
            <Text className="text-gray-900 font-extrabold text-base">
              Tena<Text className="text-teal-600">+</Text>
            </Text>
          </View>

          <View>
            <Text className="text-2xl font-extrabold text-gray-900">Welcome back</Text>
            <Text className="text-gray-500 text-sm">
              Sign in to access your health records and services.
            </Text>
          </View>

          <Field label="Email" icon={<Mail size={16} color="#000" />}>
            <TextInput
              className="flex-1 py-3 text-gray-900 text-sm"
              placeholder="abebe@example.com"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(v) => setForm((f) => ({ ...f, email: v }))}
            />
          </Field>

          <Field label="Password" icon={<Lock size={16} color="#000" />}>
            <TextInput
              className="flex-1 py-3 text-gray-900 text-sm"
              placeholder="••••••••"
              placeholderTextColor="#9ca3af"
              secureTextEntry={!showPw}
              value={form.password}
              onChangeText={(v) => setForm((f) => ({ ...f, password: v }))}
            />
            <TouchableOpacity onPress={() => setShowPw(!showPw)}>
              {showPw ? <EyeOff size={16} color="#000" /> : <Eye size={16} color="#000" />}
            </TouchableOpacity>
          </Field>

          {!!error && <Text className="text-red-500 text-xs">{error}</Text>}

          <TouchableOpacity onPress={() => router.push('/recovery')} className="self-end">
            <Text className="text-teal-600 text-xs font-semibold">Forgot password?</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom pinned */}
        <View className="gap-3">
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className={`rounded-xl py-3.5 items-center ${loading ? 'bg-teal-600/50' : 'bg-teal-600'}`}
            activeOpacity={0.85}
          >
            <Text className="text-white font-bold text-base">
              {loading ? 'Signing in…' : 'Sign in'}
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center gap-3">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="text-gray-400 text-xs">or</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          <TouchableOpacity
            className="border border-gray-200 rounded-xl py-3.5 flex-row items-center justify-center gap-2"
            activeOpacity={0.85}
          >
            <IdCard size={18} color="#1e7a6e" />
            <Text className="text-gray-700 font-semibold text-sm">Continue with Fayda ID</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center gap-1">
            <Text className="text-gray-500 text-sm">New to Tena+?</Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text className="text-teal-600 font-semibold text-sm">Create account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}