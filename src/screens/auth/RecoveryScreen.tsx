import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Lock, Mail, Phone } from 'lucide-react-native';
import { detectCarrier, isValidEthiopianMobile, normalizeEthiopianMobile } from '@/hooks/usephone';

type Panel = 'phone' | 'email';

const Tab = ({ active, label, icon, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.85}
    className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl py-3 border ${
      active ? 'bg-teal-600 border-teal-600' : 'bg-white border-gray-200'
    }`}
  >
    {icon(active ? '#fff' : '#374151')}
    <Text className={`font-semibold text-sm ${active ? 'text-white' : 'text-gray-700'}`}>{label}</Text>
  </TouchableOpacity>
);

export default function RecoveryScreen() {
  const router = useRouter();
  const [panel, setPanel] = useState<Panel>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const carrier = phone.length === 9 ? detectCarrier(phone) : null;

  const switchPanel = (p: Panel) => {
    setPanel(p);
    setError('');
    setSent(false);
  };

  const submit = () => {
    setError('');
    if (panel === 'phone') {
      if (!isValidEthiopianMobile(phone)) return setError('Enter a valid Ethiopian mobile number');
      // TODO: call API to send OTP, then:
      router.push({ pathname: '/otp', params: { phone: `+251${phone}` } });
    } else {
      if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email address');
      // TODO: call password-recovery API
      setSent(true);
    }
  };

  return (
    <View className="flex-1 bg-white items-center">
      <View className="flex-1 w-full max-w-md px-6 pt-8 pb-6 justify-between">
        <View className="gap-4">

          <View className="w-14 h-14 rounded-full bg-teal-50 items-center justify-center">
            <Lock size={26} color="#1e7a6e" />
          </View>

          <View>
            <Text className="text-2xl font-extrabold text-gray-900">Reset password</Text>
            <Text className="text-gray-500 text-sm">Choose how you want to receive your reset code.</Text>
          </View>

          <View className="flex-row gap-3">
            <Tab active={panel === 'phone'} label="Phone" icon={(c: string) => <Phone size={16} color={c} />} onPress={() => switchPanel('phone')} />
            <Tab active={panel === 'email'} label="Email" icon={(c: string) => <Mail size={16} color={c} />} onPress={() => switchPanel('email')} />
          </View>

          {panel === 'phone' ? (
            <View>
              <Text className="text-gray-600 text-xs font-semibold mb-1">Phone number</Text>
              <View className="flex-row items-center border border-gray-200 rounded-xl px-3 bg-gray-50 gap-2">
                <Phone size={16} color="#000" />
                <Text className="text-gray-700 text-sm">+251</Text>
                <TextInput
                  className="flex-1 py-3 text-gray-900 text-sm"
                  placeholder="912 345 678"
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={(v) => { setPhone(normalizeEthiopianMobile(v)); setError(''); }}
                />
              </View>
              {!!carrier && <Text className="text-xs text-gray-500 mt-1">{carrier}</Text>}
            </View>
          ) : (
            <View>
              <Text className="text-gray-600 text-xs font-semibold mb-1">Email address</Text>
              <View className="flex-row items-center border border-gray-200 rounded-xl px-3 bg-gray-50 gap-2">
                <Mail size={16} color="#000" />
                <TextInput
                  className="flex-1 py-3 text-gray-900 text-sm"
                  placeholder="abebe@example.com"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(v) => { setEmail(v); setError(''); }}
                />
              </View>
            </View>
          )}

          {!!error && <Text className="text-red-500 text-xs">{error}</Text>}

          {sent && (
            <View className="bg-teal-50 border border-teal-100 rounded-xl p-3">
              <Text className="text-teal-800 text-xs font-semibold">Recovery link sent</Text>
              <Text className="text-teal-600 text-xs">Check your email for reset instructions.</Text>
            </View>
          )}
        </View>

        <View className="gap-3">
          <TouchableOpacity onPress={submit} className="bg-teal-600 rounded-xl py-3.5 items-center" activeOpacity={0.85}>
            <Text className="text-white font-bold text-base">
              {panel === 'phone' ? 'Send code' : 'Send recovery link'}
            </Text>
          </TouchableOpacity>
          <View className="flex-row justify-center gap-1">
            <Text className="text-gray-500 text-sm">Remembered it?</Text>
            <TouchableOpacity onPress={() => router.replace('/login')}>
              <Text className="text-teal-600 font-semibold text-sm">Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}