import { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, Platform, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, Fingerprint, Lock, CircleCheck, type LucideIcon } from 'lucide-react-native';

const ITEMS: { title: string; desc: string; Icon: LucideIcon }[] = [
  {
    title: 'Fayda National ID Integration',
    desc: "Every account is tied to Ethiopia's government digital ID verified, fraud-proof identity.",
    Icon: Shield,
  },
  {
    title: 'Biometric Authentication',
    desc: 'Face ID and fingerprint ensure only you can access your records, even on shared devices.',
    Icon: Fingerprint,
  },
  {
    title: 'End-to-End Encryption',
    desc: 'All data is encrypted in transit and at rest. Medical records never leave your control.',
    Icon: Lock,
  },
  {
    title: 'Government-Certified',
    desc: "Compliant with Ethiopia's health data protection standards and international best practices.",
    Icon: CircleCheck,
  },
];

// the native driver is not available on web, so only use it on phones
const USE_NATIVE = Platform.OS !== 'web';

// expanding ring that fades out, like a radar ping
function PulseRing({ size, maxScale, delay }: { size: number; maxScale: number; delay: number }) {
  const p = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // grow + fade, then snap back to 0 and repeat forever
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(p, {
          toValue: 1,
          duration: 3000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: USE_NATIVE,
        }),
        Animated.timing(p, { toValue: 0, duration: 0, useNativeDriver: USE_NATIVE }),
      ])
    );
    const t = setTimeout(() => loop.start(), delay);
    return () => {
      clearTimeout(t);
      loop.stop();
    };
  }, [p, delay]);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1.5,
        borderColor: '#2dd4bf',
        opacity: p.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }),
        transform: [{ scale: p.interpolate({ inputRange: [0, 1], outputRange: [1, maxScale] }) }],
      }}
    />
  );
}

function Radar({ size }: { size: number }) {
  const disc = size * 0.53;
  const R = disc / 2 + 4; // pills sit on the edge of the disc
  const c = size / 2;
  const PW = 64;
  const PH = 22;

  const pills = [
    { label: '256-bit', x: c, y: c - R },
    { label: 'Encrypted', x: c - R, y: c },
    { label: 'Biometric', x: c + R, y: c },
    { label: 'Certified', x: c, y: c + R },
  ];

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* outer ring */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1,
          borderColor: 'rgba(45,212,191,0.18)',
        }}
      />

      {/* radar pings, started one second apart */}
      <PulseRing size={disc} maxScale={size / disc} delay={0} />
      <PulseRing size={disc} maxScale={size / disc} delay={1000} />
      <PulseRing size={disc} maxScale={size / disc} delay={2000} />

      {/* main disc */}
      <View
        style={{
          width: disc,
          height: disc,
          borderRadius: disc / 2,
          shadowColor: '#14b8a6',
          shadowOpacity: 0.5,
          shadowRadius: 30,
          shadowOffset: { width: 0, height: 0 },
        }}
      >
        <LinearGradient
          colors={['#14b8a6', '#0f766e', '#064e3b']}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={{ flex: 1, borderRadius: disc / 2, alignItems: 'center', justifyContent: 'center' }}
        >
          <Shield size={disc * 0.3} color="#fff" strokeWidth={1.5} />
          <Text className="text-white font-bold text-sm mt-2">Secured</Text>
          <Text className="text-teal-200" style={{ fontSize: 9 }}>
            by Fayda
          </Text>
        </LinearGradient>
      </View>

      {/* labels around the disc */}
      {pills.map((p) => (
        <View
          key={p.label}
          className="items-center justify-center rounded-md border border-white/10"
          style={{
            position: 'absolute',
            left: p.x - PW / 2,
            top: p.y - PH / 2,
            width: PW,
            height: PH,
            backgroundColor: 'rgba(15,23,42,0.92)',
          }}
        >
          <Text className="text-teal-200 font-bold" style={{ fontSize: 9 }}>
            {p.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

export default function SecuritySection() {
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const radarSize = wide ? 380 : Math.min(width - 48, 340);

  return (
    <LinearGradient
      colors={['#0b1120', '#052e29', '#0b1424']}
      locations={[0, 0.6, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ width: '100%', paddingVertical: 80 }}
    >
      <View
        className="w-full self-center px-6"
        style={{ maxWidth: 1100, flexDirection: wide ? 'row' : 'column', alignItems: 'center', gap: 48 }}
      >
        {/* left: text + checklist */}
        <View style={{ flex: wide ? 1 : undefined, width: wide ? undefined : '100%' }}>
          <Text className="text-teal-600 text-sm font-bold uppercase mb-3" style={{ letterSpacing: 2 }}>
            Security First
          </Text>
          <Text
            className="text-white font-bold"
            style={{ fontSize: wide ? 40 : 30, lineHeight: wide ? 46 : 36 }}
          >
            Government-grade{'\n'}security you can trust
          </Text>
          <Text className="text-gray-600 text-sm leading-6 mt-5 mb-8" style={{ maxWidth: 400 }}>
            Your health data is among the most sensitive there is. Tena+ uses defence-in-depth multiple
            overlapping security layers so no single failure can expose your records.
          </Text>

          <View style={{ gap: 18 }}>
            {ITEMS.map(({ title, desc, Icon }) => (
              <View key={title} className="flex-row" style={{ gap: 14 }}>
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center"
                  style={{ backgroundColor: 'rgba(20,184,166,0.15)' }}
                >
                  <Icon size={18} color="#2dd4bf" />
                </View>
                <View className="flex-1" style={{ maxWidth: 440 }}>
                  <Text className="text-white text-sm font-semibold">{title}</Text>
                  <Text className="text-gray-600 text-xs leading-4 mt-0.5">{desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* right: radar */}
        <Radar size={radarSize} />
      </View>
    </LinearGradient>
  );
}