import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react-native";

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
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const strength = getStrength(form.password);

  const strengthColors = ['bg-gray-200', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  const handleSubmit = async () => {
    const { firstName, lastName, email, phone, password } = form;
    setError("")

    if (!firstName || !lastName || !email ||!phone || !password){
        setError("Please fill in all fields")
        return
    }

    if(!email.includes("@")){
        setError("Please enter a valid email")
        return
    }

    if (password.length < 6) {
        setError("Password must be at least 6 characters")
        return
    }

    setLoading(true)

    router.push({ pathname: '/otp', params: { phone } });
  };

  const Field = ({ label, icon, children, className = '' }: any) => (
  <View className={`${className}`}>
    <Text className="text-gray-600 text-xs font-semibold mb-1">{label}</Text>
    <View className="flex-row items-center border border-gray-200 rounded-xl px-3 bg-gray-50 gap-2">
      {icon}
      {children}
    </View>
  </View>
);

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

        {error && (
          <div className="bg-red-700 border border-red-500 text-red-100 px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {/* Step bar */}
        <View className="flex-row gap-1.5">
          <View className="flex-1 h-1 rounded-full bg-teal-600" />
          <View className="flex-1 h-1 rounded-full bg-gray-200" />
          <View className="flex-1 h-1 rounded-full bg-gray-200" />
        </View>

        <View>
          <Text className="text-2xl font-extrabold text-gray-900">Create your account</Text>
          <Text className="text-gray-500 text-sm">Join Ethiopia's national health platform.</Text>
        </View>

        {/* First + last name share one row */}
        <View className="flex-row gap-3">
          <Field label="First name" icon={<User size={16} color="#000" />} className="flex-1">
            <TextInput className="flex-1 py-3 text-gray-900 text-sm" placeholder="Abebe"
              placeholderTextColor="#9ca3af" autoCapitalize="words" value={form.firstName}
              onChangeText={v => setForm(f => ({ ...f, firstName: v }))} />
          </Field>
          <Field label="Last name" icon={<User size={16} color="#000" />} className="flex-1">
            <TextInput className="flex-1 py-3 text-gray-900 text-sm" placeholder="Bekele"
              placeholderTextColor="#9ca3af" autoCapitalize="words" value={form.lastName}
              onChangeText={v => setForm(f => ({ ...f, lastName: v }))} />
          </Field>
        </View>

        <Field label="Email" icon={<Mail size={16} color="#000" />}>
          <TextInput className="flex-1 py-3 text-gray-900 text-sm" placeholder="abebe@example.com"
            placeholderTextColor="#9ca3af" keyboardType="email-address" autoCapitalize="none"
            value={form.email} onChangeText={v => setForm(f => ({ ...f, email: v }))} />
        </Field>

        <Field label="Phone" icon={<Phone size={16} color="#000" />}>
          <TextInput className="flex-1 py-3 text-gray-900 text-sm" placeholder="+251 91 234 5678"
            placeholderTextColor="#9ca3af" keyboardType="phone-pad"
            value={form.phone} onChangeText={v => setForm(f => ({ ...f, phone: v }))} />
        </Field>

        <Field label="Password" icon={<Lock size={16} color="#000" />}>
          <TextInput className="flex-1 py-3 text-gray-900 text-sm" placeholder="••••••••"
            placeholderTextColor="#9ca3af" secureTextEntry={!showPw}
            value={form.password} onChangeText={v => setForm(f => ({ ...f, password: v }))} />
          <TouchableOpacity onPress={() => setShowPw(!showPw)}>
            {showPw ? <EyeOff size={16} color="#000" /> : <Eye size={16} color="#000" />}
          </TouchableOpacity>
        </Field>

        {/* Fixed height so the strength bar appearing doesn't shift the layout */}
        <View className="h-6">
          {form.password.length > 0 && (
            <>
              <View className="flex-row gap-1 mb-1">
                {[1, 2, 3, 4].map(i => (
                  <View key={i} className={`flex-1 h-1 rounded-full ${i <= strength ? strengthColors[strength] : 'bg-gray-200'}`} />
                ))}
              </View>
              <Text className="text-xs text-gray-400">{strengthLabels[strength]}</Text>
            </>
          )}
        </View>
      </View>

      {/* Bottom pinned */}
      <View className="gap-3">
        <TouchableOpacity onPress={handleSubmit} className="bg-teal-600 rounded-xl py-3.5 items-center" activeOpacity={0.85}>
          <Text className="text-white font-bold text-base">Create account</Text>
        </TouchableOpacity>
        <View className="flex-row justify-center gap-1">
          <Text className="text-gray-500 text-sm">Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text className="text-teal-600 font-semibold text-sm">Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
);
}