import { View, Text, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WifiOff, CircleCheck, QrCode } from 'lucide-react-native';

const POINTS = [
  'Health ID QR code works fully offline',
  'Vaccination records cached locally',
  'Emergency contacts always accessible',
  'Auto-sync when connection returns',
  'Optimised for 2G and EDGE networks',
];

const PHONE_ROWS = ['Records', 'Emergency Info', 'Prescriptions'];

// small phone-style card shown on the right
function OfflinePhone() {
  return (
    <View
      className="w-full rounded-2xl border border-gray-200 bg-white p-4"
      style={{
        maxWidth: 200,
        shadowColor: '#0f766e',
        shadowOpacity: 0.12,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 12 },
      }}
    >
      {/* status row */}
      <View className="flex-row items-center mb-3" style={{ gap: 8 }}>
        <View className="w-6 h-6 rounded-md bg-amber-100 items-center justify-center">
          <WifiOff size={13} color="#d97706" />
        </View>
        <Text className="text-gray-800 text-xs font-semibold">No Connection</Text>
      </View>

      {/* Health ID box */}
      <View className="rounded-xl bg-teal-50 border border-teal-100 items-center py-3 mb-3">
        <Text className="text-teal-700 font-bold mb-2" style={{ fontSize: 10 }}>
          Health ID
        </Text>
        <View className="w-16 h-16 rounded-lg bg-white items-center justify-center border border-teal-100">
          <QrCode size={40} color="#0f766e" />
        </View>
      </View>

      {/* offline-available rows */}
      <View style={{ gap: 8 }}>
        {PHONE_ROWS.map((label) => (
          <View
            key={label}
            className="flex-row items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
          >
            <Text className="text-gray-600" style={{ fontSize: 10 }}>
              {label}
            </Text>
            <View className="h-1 w-8 rounded-full bg-teal-400" />
          </View>
        ))}
      </View>
    </View>
  );
}

export default function OfflineSection() {
  const { width } = useWindowDimensions();
  const wide = width >= 900;

  return (
    <View className="w-full bg-white py-16 px-6">
      <View className="w-full self-center" style={{ maxWidth: 1100 }}>
        <LinearGradient
          colors={['#ecfdf5', '#f0fdfa', '#ecfeff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 28,
            borderWidth: 1,
            borderColor: '#99f6e4',
            padding: wide ? 48 : 24,
            flexDirection: wide ? 'row' : 'column',
            alignItems: 'center',
            gap: 40,
          }}
        >
          {/* left: text */}
          <View style={{ flex: wide ? 1 : undefined, width: wide ? undefined : '100%' }}>
            <View
              className="self-start flex-row items-center rounded-full bg-teal-100 border border-teal-200 px-3 py-1 mb-5"
              style={{ gap: 6 }}
            >
              <WifiOff size={12} color="#0f766e" />
              <Text className="text-teal-800 text-xs font-semibold">Offline-First</Text>
            </View>

            <Text
              className="text-gray-900 font-bold"
              style={{ fontSize: wide ? 34 : 26, lineHeight: wide ? 40 : 32 }}
            >
              Designed for rural Ethiopia.{'\n'}Works without internet.
            </Text>

            <Text className="text-gray-500 text-sm leading-6 mt-4 mb-6" style={{ maxWidth: 440 }}>
              {
                "Most healthcare apps require internet. Tena+ doesn't. Your health ID, records, and emergency info are cached locally and sync automatically on reconnection."
              }
            </Text>

            <View style={{ gap: 12 }}>
              {POINTS.map((p) => (
                <View key={p} className="flex-row items-center" style={{ gap: 10 }}>
                  <CircleCheck size={16} color="#0d9488" />
                  <Text className="text-gray-600 text-sm flex-1">{p}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* right: phone */}
          <View className="items-center" style={{ width: wide ? 300 : '100%' }}>
            <OfflinePhone />
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}