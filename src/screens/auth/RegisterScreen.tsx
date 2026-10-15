import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart } from "lucide-react-native";

function getStrength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export default function RegisterScreen() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const strength = getStrength(form.password);

  const strengthColors = ['bg-gray-200', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  const handleSubmit = () => {
    const { firstName, lastName, email, phone, password } = form;
    if (!firstName || !lastName || !email || !phone || !password) {
      Alert.alert('Please fill in all fields'); return;
    }
    router.push({ pathname: '/otp', params: { phone } });
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
      <View className="flex-1 px-6 pt-16 pb-10">

        {/* Back + brand */}
        <View className="flex-row items-center gap-3 mb-6">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
            <Text className="text-gray-700 text-lg">←</Text>
          </TouchableOpacity>
          <View className="flex-row items-center gap-2">
            <View className="w-8 h-8 rounded-xl bg-teal-600 items-center justify-center">
              <Text className="text-white text-xs font-bold"><Heart size={20} color="#ffff" fill="#ffff" /></Text>
            </View>
            <Text className="text-gray-900 font-extrabold text-base">Tena<Text className="text-teal-600">+</Text></Text>
          </View>
        </View>

        {/* Step bar */}
        <View className="flex-row gap-1.5 mb-6">
          <View className="flex-1 h-1 rounded-full bg-teal-600" />
          <View className="flex-1 h-1 rounded-full bg-gray-200" />
          <View className="flex-1 h-1 rounded-full bg-gray-200" />
        </View>

        <Text className="text-2xl font-extrabold text-gray-900 mb-2">Create your account</Text>
        <Text className="text-gray-500 text-sm mb-6">Join Ethiopia's national health platform.</Text>

        {/* Fields */}
        {[
          { key: 'firstName', label: 'First name', placeholder: 'Abebe', icon: '👤', type: 'default' },
          { key: 'lastName',  label: 'Last name',  placeholder: 'Bekele', icon: '👤', type: 'default' },
          { key: 'email',     label: 'Email',      placeholder: 'abebe@example.com', icon: '✉️', type: 'email-address' },
          { key: 'phone',     label: 'Phone',      placeholder: '+251 91 234 5678', icon: '📞', type: 'phone-pad' },
        ].map(({ key, label, placeholder, icon, type }) => (
          <View key={key} className="mb-4">
            <Text className="text-gray-600 text-xs font-semibold mb-1.5">{label}</Text>
            <View className="flex-row items-center border border-gray-200 rounded-xl px-4 bg-gray-50">
              <Text className="text-gray-400 mr-2">{icon}</Text>
              <TextInput
                className="flex-1 py-3.5 text-gray-900 text-sm"
                placeholder={placeholder}
                placeholderTextColor="#9ca3af"
                keyboardType={type as any}
                autoCapitalize={key === 'email' ? 'none' : 'words'}
                value={(form as any)[key]}
                onChangeText={v => setForm(f => ({ ...f, [key]: v }))}
              />
            </View>
          </View>
        ))}

        {/* Password */}
        <Text className="text-gray-600 text-xs font-semibold mb-1.5">Password</Text>
        <View className="flex-row items-center border border-gray-200 rounded-xl px-4 bg-gray-50 mb-2">
          <Text className="text-gray-400 mr-2">🔒</Text>
          <TextInput
            className="flex-1 py-3.5 text-gray-900 text-sm"
            placeholder="••••••••"
            placeholderTextColor="#9ca3af"
            secureTextEntry={!showPw}
            value={form.password}
            onChangeText={v => setForm(f => ({ ...f, password: v }))}
          />
          <TouchableOpacity onPress={() => setShowPw(!showPw)}>
            <Text className="text-gray-400">{showPw ? '🙈' : '👁'}</Text>
          </TouchableOpacity>
        </View>

        {/* Strength bar */}
        {form.password.length > 0 && (
          <View className="mb-5">
            <View className="flex-row gap-1 mb-1">
              {[1,2,3,4].map(i => (
                <View key={i} className={`flex-1 h-1 rounded-full ${i <= strength ? strengthColors[strength] : 'bg-gray-200'}`} />
              ))}
            </View>
            <Text className="text-xs text-gray-400">{strengthLabels[strength]}</Text>
          </View>
        )}

        <TouchableOpacity onPress={handleSubmit} className="bg-teal-600 rounded-xl py-4 items-center mb-6" activeOpacity={0.85}>
          <Text className="text-white font-bold text-base">Create account</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center gap-1">
          <Text className="text-gray-500 text-sm">Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text className="text-teal-600 font-semibold text-sm">Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
