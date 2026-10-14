import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  const handleLogin = () => {
    if (!email || !password) { Alert.alert('Please fill in all fields'); return; }
    // TODO: connect to API
    Alert.alert('Success', 'Signed in!');
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
      <View className="flex-1 px-6 pt-16 pb-10">

        {/* Back + brand */}
        <View className="flex-row items-center gap-3 mb-8">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
            <Text className="text-gray-700 text-lg">←</Text>
          </TouchableOpacity>
          <View className="flex-row items-center gap-2">
            <View className="w-8 h-8 rounded-xl bg-teal-600 items-center justify-center">
              <Text className="text-white text-xs font-bold">T+</Text>
            </View>
            <Text className="text-gray-900 font-extrabold text-base">Tena<Text className="text-teal-600">+</Text></Text>
          </View>
        </View>

        <Text className="text-2xl font-extrabold text-gray-900 mb-2">Welcome back</Text>
        <Text className="text-gray-500 text-sm mb-6">Sign in to access your health records and services.</Text>

        {/* Fayda trust notice */}
        <View className="flex-row items-center gap-3 bg-teal-50 border border-teal-100 rounded-xl p-4 mb-6">
          <Text className="text-teal-600 text-lg">🛡</Text>
          <View className="flex-1">
            <Text className="text-teal-800 text-xs font-semibold">Secured by Fayda Digital ID</Text>
            <Text className="text-teal-600 text-xs">Government-grade encryption</Text>
          </View>
        </View>

        {/* Email */}
        <Text className="text-gray-600 text-xs font-semibold mb-1.5">Email address</Text>
        <View className="flex-row items-center border border-gray-200 rounded-xl px-4 mb-4 bg-gray-50">
          <Text className="text-gray-400 mr-2">✉️</Text>
          <TextInput
            className="flex-1 py-3.5 text-gray-900 text-sm"
            placeholder="abebe@example.com"
            placeholderTextColor="#9ca3af"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password */}
        <Text className="text-gray-600 text-xs font-semibold mb-1.5">Password</Text>
        <View className="flex-row items-center border border-gray-200 rounded-xl px-4 mb-2 bg-gray-50">
          <Text className="text-gray-400 mr-2">🔒</Text>
          <TextInput
            className="flex-1 py-3.5 text-gray-900 text-sm"
            placeholder="••••••••"
            placeholderTextColor="#9ca3af"
            secureTextEntry={!showPw}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPw(!showPw)}>
            <Text className="text-gray-400 text-sm">{showPw ? '🙈' : '👁'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push('/recovery')} className="self-end mb-6">
          <Text className="text-teal-600 text-xs font-semibold">Forgot password?</Text>
        </TouchableOpacity>

        {/* Sign in button */}
        <TouchableOpacity onPress={handleLogin} className="bg-teal-600 rounded-xl py-4 items-center mb-4" activeOpacity={0.85}>
          <Text className="text-white font-bold text-base">Sign in</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center gap-3 mb-4">
          <View className="flex-1 h-px bg-gray-200" />
          <Text className="text-gray-400 text-xs">or</Text>
          <View className="flex-1 h-px bg-gray-200" />
        </View>

        {/* Fayda ID login */}
        <TouchableOpacity className="border border-gray-200 rounded-xl py-4 items-center flex-row justify-center gap-2 mb-8" activeOpacity={0.85}>
          <Text className="text-lg">🪪</Text>
          <Text className="text-gray-700 font-semibold text-sm">Continue with Fayda ID</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View className="flex-row justify-center gap-1">
          <Text className="text-gray-500 text-sm">New to Tena+?</Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text className="text-teal-600 font-semibold text-sm">Create account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
