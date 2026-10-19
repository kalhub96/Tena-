import { View, Text, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CircleCheck } from 'lucide-react-native';
import { AUDIENCES } from '@/api/audiences';

export default function AudienceCards() {
  const { width } = useWindowDimensions();
  const wide = width >= 900;

  return (
    <View className="w-full bg-white py-16">
      <View
        className="w-full self-center px-6"
        style={{ maxWidth: 1200, flexDirection: wide ? 'row' : 'column', gap: 24 }}
      >
        {AUDIENCES.map(({ title, amharic, tagline, Icon, gradient, items }) => (
          <View
            key={title}
            className="rounded-2xl border border-gray-200 bg-white"
            style={{ flex: wide ? 1 : undefined, overflow: 'hidden' }}
          >
            {/* gradient header */}
            <LinearGradient
              colors={gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 24 }}
            >
              <View className="w-12 h-12 rounded-xl bg-white/20 items-center justify-center">
                <Icon size={22} color="#fff" />
              </View>
              <Text className="text-white text-xl font-bold mt-6">{title}</Text>
              <Text className="text-white/80 text-sm mt-1">{amharic}</Text>
              <Text className="text-white text-sm mt-4">{tagline}</Text>
            </LinearGradient>

            {/* checklist */}
            <View className="p-6" style={{ gap: 14 }}>
              {items.map((item) => (
                <View key={item} className="flex-row" style={{ gap: 12 }}>
                  <View style={{ marginTop: 1 }}>
                    <CircleCheck size={18} color="#0d9488" />
                  </View>
                  <Text className="flex-1 text-gray-600 text-sm leading-5">{item}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}