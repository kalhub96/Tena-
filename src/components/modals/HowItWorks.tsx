import { View, Text } from 'react-native';
import { STEPS } from '@/api/steps';
import { LinearGradient } from 'expo-linear-gradient';

export default function HowItWorks() {
  return (
    // full-width light band, content aligned with the rest of the page
    <View className="w-full bg-slate-50 py-16">
      <View className="w-full self-center px-6" style={{ maxWidth: 1200 }}>
        {STEPS.map(({ title, amharic, desc, Icon, color }, i) => (
          <View 
            key={title} 
            className="flex-row" 
            style={{ gap: 20, paddingBottom: i < STEPS.length - 1 ? 32 : 0 }}>
            {/* icon square + step number */}
            <View className="items-center" style={{ width: 68 }}>
              <View
                className="w-14 h-14 rounded-xl items-center justify-center"
                style={{ backgroundColor: color }}
              >
                <Icon size={22} color="#fff" />
              </View>
              <Text className="text-gray-400 mt-1" style={{ fontSize: 10 }}>
                {String(i + 1).padStart(2, '0')}
              </Text>
              {i < STEPS.length - 1 && (
                    <LinearGradient
                        colors={['rgba(148,164,184,0)', 'rgba(148,163,184,0.7)', 'rgba(148,163,184,0)']}
                        style={{ flex: 1, width: 1, minHeight: 34, marginVertical: 6 }}
                    />
                )}
            </View>

            {/* text */}
            <View className="flex-1" style={{ maxWidth: 440 }}>
              <Text className="text-gray-900 text-sm font-bold">{title}</Text>
              <Text className="text-teal-600 text-xs mt-0.5">{amharic}</Text>
              <Text className="text-gray-500 text-sm leading-5 mt-2">{desc}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}