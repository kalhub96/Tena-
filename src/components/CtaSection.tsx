import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';

// the footer line was too small to read in the screenshot, so check and edit this text
const EMERGENCY_LINE = 'Emergency? Dial 907· ድንገተኛ? 907 ደውሉ';

export default function CtaSection() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const wide = width >= 900;

  return (
    <LinearGradient
      colors={['#0f8a7a', '#0f766e', '#0b5f56']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ width: '100%', paddingVertical: 72, paddingHorizontal: 24, alignItems: 'center' }}
    >
      {/* badge */}
      <View
        className="flex-row items-center rounded-full border border-white/20 bg-white/15 px-4 py-1.5 mb-6"
        style={{ gap: 8 }}
      >
        <View className="w-2 h-2 rounded-full bg-yellow-300" />
        <Text className="text-white text-xs font-medium">Free for all Ethiopians</Text>
      </View>

      {/* heading */}
      <Text
        className="text-white font-extrabold text-center"
        style={{ fontSize: wide ? 44 : 32, lineHeight: wide ? 52 : 40 }}
      >
        Your health, in your hands.
      </Text>

      <Text className="text-teal-100/90 text-sm text-center mt-4 mb-8 leading-6" style={{ maxWidth: 440 }}>
        Join over 2 million Ethiopians who have taken control of their healthcare with Tena+.
      </Text>

      {/* buttons */}
      <View className="flex-row flex-wrap justify-center" style={{ gap: 12 }}>
        <TouchableOpacity
          onPress={() => router.push('/fayda')}
          activeOpacity={0.85}
          className="flex-row items-center bg-white rounded-xl px-6 py-3"
          style={{ gap: 6 }}
        >
          <Text className="text-teal-700 font-bold text-sm">Verify with Fayda ID</Text>
          <ChevronRight size={16} color="#0f766e" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/login')}
          activeOpacity={0.85}
          className="rounded-xl border border-white/40 px-6 py-3"
        >
          <Text className="text-white font-semibold text-sm">Sign In</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-white] text-xs mt-8">{EMERGENCY_LINE}</Text>
    </LinearGradient>
  );
}