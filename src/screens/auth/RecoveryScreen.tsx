import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function RecoveryScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const submit = () => {
    if (!email.trim()) {
      Alert.alert('Please enter your email address');
      return;
    }
    // TODO: call password-recovery API
    setSent(true);
  };

  return (
    <View className="flex-1 bg-white px-6 pt-16 pb-10">
      <TouchableOpacity
        onPress={() => router.back()}
        className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mb-8"
      >
        <Text className="text-gray-700 text-lg">←</Text>
      </TouchableOpacity>

      <View className="w-16 h-16 rounded-full bg-teal-50 items-center justify-center mb-6">
        <Text className="text-3xl">🔒</Text>
      </View>

      <Text className="text-2xl font-extrabold text-gray-900 mb-2">Reset your password</Text>
      <Text className="text-gray-500 text-sm mb-6">
        Enter the email linked to your Tena+ account and we'll send a recovery link.
      </Text>

      <Text className="text-gray-600 text-xs font-semibold mb-1.5">Email address</Text>
      <View className="flex-row items-center border border-gray-200 rounded-xl px-4 mb-6 bg-gray-50">
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

      <TouchableOpacity onPress={submit} className="bg-teal-600 rounded-xl py-4 items-center mb-4" activeOpacity={0.85}>
        <Text className="text-white font-bold text-base">Send recovery link</Text>
      </TouchableOpacity>

      {sent && (
        <View className="flex-row items-center gap-3 bg-teal-50 border border-teal-100 rounded-xl p-4 mb-4">
          <Text className="text-teal-600 text-lg">✅</Text>
          <View className="flex-1">
            <Text className="text-teal-800 text-xs font-semibold">Recovery link sent</Text>
            <Text className="text-teal-600 text-xs">Check your email for reset instructions.</Text>
          </View>
        </View>
      )}

      <View className="flex-row justify-center gap-1 mt-auto">
        <Text className="text-gray-500 text-sm">Remembered it?</Text>
        <TouchableOpacity onPress={() => router.replace('/login')}>
          <Text className="text-teal-600 font-semibold text-sm">Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
