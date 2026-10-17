import { View, Text } from 'react-native';
import { Shield, Lock, Wifi, Globe, Zap } from 'lucide-react-native';

const BADGES = [
  { label: 'Government-Grade Security', Icon: Shield },
  { label: 'Fayda ID Verified', Icon: Lock },
  { label: 'Offline-First Design', Icon: Wifi },
  { label: 'EN + አማርኛ Bilingual', Icon: Globe },
  { label: 'Optimised for 2G', Icon: Zap },
];

export default function TrustBadges() {
  return (
    // full-width light band, items centered and wrapping on small screens
    <View className="w-full">
      <View className="w-full self-center " style={{ maxWidth: 1200 }}>
        <View className="flex-row flex-wrap items-center justify-center" style={{ columnGap: 40, rowGap: 12 }}>
          {BADGES.map(({ label, Icon }) => (
            <View key={label} className="flex-row items-center" style={{ gap: 8 }}>
              <Icon size={16} color="#0d9488" />
              <Text className="text-gray-700 text-sm font-medium">{label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}