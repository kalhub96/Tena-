import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  Animated,
  Easing,
  Platform,
  TouchableOpacity,
  type StyleProp,
  type ViewStyle,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Heart, ChevronRight, ShieldCheck, Hospital, Stethoscope, Pill, Scale, TvMinimalPlay, Ambulance, QrCode } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import TrustBadges from '@/components/modals/TrustBadges';
import FeatureCard from '@/components/cards/queueCard';
import { FEATURES } from '@/api/features';
import HowItWorks from '@/components/modals/HowItWorks';

const NAV = ['Features', 'How It Works', 'Benefits', 'Security'];

const styles = StyleSheet.create({
  underglowWrap: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  underglowGlow: {
    position: 'absolute',
    left: 10,
    right: -6,
    top: 12,
    bottom: -10,
    borderRadius: 18,
  },
  underglowButton: {
    borderRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 18,
  },
});

const glowBlur: any = Platform.select({
  web: { filter: 'blur(16px)' },
  android: { filter: [{ blur: 16 }] }, // needs Android 12+
  ios: { shadowOffset: { width: 0, height: 0 }, shadowRadius: 20, shadowOpacity: 1 },
  default: {},
});

function UnderglowButton({
  children,
  onPress,
  glowColor = '#99f6e4',
  className = '',
}: {
  children: ReactNode;
  onPress?: () => void;
  glowColor?: string;
  className?: string;
}) {
  const glow = useRef(new Animated.Value(0)).current; // 0 = off, 1 = on
  const hovered = useRef(false);

  const animateTo = (to: number) =>
    Animated.timing(glow, { toValue: to, duration: 200, useNativeDriver: false }).start();

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => {
        hovered.current = true;
        animateTo(1);
      }}
      onHoverOut={() => {
        hovered.current = false;
        animateTo(0);
      }}
      onPressIn={() => animateTo(1)} // glow while tapping on phones
      onPressOut={() => animateTo(hovered.current ? 1 : 0)}
      style={({ pressed }) => [styles.underglowWrap, pressed && { opacity: 0.9 }]}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.underglowGlow,
          glowBlur,
          {
            backgroundColor: glowColor,
            shadowColor: glowColor,
            opacity: glow.interpolate({ inputRange: [0, 1], outputRange: [0, 0.6] }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.underglowButton,
          {
            shadowColor: glowColor,
            shadowOpacity: glow.interpolate({ inputRange: [0, 1], outputRange: [0, 0.2] }),
          },
        ]}
      >
        <View className={className} style={{ borderRadius: 16 }}>
          {children}
        </View>
      </Animated.View>
    </Pressable>
  );
}

function FloatingNode({
  children,
  style,
  delay = 0,
  amplitude = 8,
  duration = 1800,
}: {
  children: ReactNode;
  style: StyleProp<ViewStyle>;
  delay?: number;
  amplitude?: number;
  duration?: number;
}) {
  const y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 0 -> up -> down -> back to 0, so the loop restarts without a visible jump
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(y, {
          toValue: -amplitude,
          duration: duration / 2,
          easing: Easing.out(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(y, {
          toValue: amplitude,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(y, {
          toValue: 0,
          duration: duration / 2,
          easing: Easing.in(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    const t = setTimeout(() => loop.start(), delay);
    return () => {
      clearTimeout(t);
      loop.stop();
    };
  }, [y, amplitude, duration, delay]);

  return <Animated.View style={[style, { transform: [{ translateY: y }] }]}>{children}</Animated.View>;
}

// angle in degrees, 0 = right, -90 = top
const NODES = [
  { label: 'Hospital', Icon: Hospital, angle: -90 },
  { label: 'Doctors', Icon: Stethoscope, angle: -30 },
  { label: 'Pharmacy', Icon: Pill, angle: 30 },
  { label: 'Emergency', Icon: Ambulance, angle: 90 },
  { label: 'Rural', Icon: Scale, angle: 150 },
  { label: 'Telemedicine', Icon: TvMinimalPlay, angle: 210 },
];

function Orbit({ size }: { size: number }) {
  const c = size / 2;
  const r = size * 0.38;
  const node = size * 0.17;
  const hub = size * 0.2;

  return (
    <View style={{ width: size, height: size }}>
      {/* dashed connectors (drawn first so nodes sit on top) */}
      {NODES.map((n) => {
        const a = (n.angle * Math.PI) / 180;
        return (
          <View
            key={`l-${n.label}`}
            style={{
              position: 'absolute',
              width: r,
              height: 0,
              left: c + (r / 2) * Math.cos(a) - r / 2,
              top: c + (r / 2) * Math.sin(a),
              borderTopWidth: 1.5,
              borderStyle: 'dashed',
              borderColor: 'rgba(255,255,255,0.3)',
              transform: [{ rotate: `${n.angle}deg` }],
            }}
          />
        );
      })}

      {/* glow + Fayda hub */}
      <View
        style={{
          position: 'absolute',
          left: c - hub,
          top: c - hub,
          width: hub * 2,
          height: hub * 2,
          borderRadius: hub,
          backgroundColor: 'rgba(255,255,255,0.08)',
        }}
      />
      <View
        className="bg-white items-center justify-center rounded-2xl"
        style={{ position: 'absolute', left: c - hub / 2, top: c - hub / 2, width: hub, height: hub }}
      >
        <ShieldCheck size={hub * 0.4} color="#1e7a6e" />
        <Text className="text-teal-600 font-bold mt-1" style={{ fontSize: 10 }}>
          Fayda
        </Text>
      </View>

      {/* service nodes (floating), drawn last so they sit on top */}
      {NODES.map((n, i) => {
        const a = (n.angle * Math.PI) / 180;
        return (
          <FloatingNode
            key={n.label}
            delay={i * 300}
            duration={1500 + i * 150}
            style={{
              position: 'absolute',
              left: c + r * Math.cos(a) - node / 2,
              top: c + r * Math.sin(a) - node / 2,
              width: node,
              height: node,
            }}
          >
            <View className="flex-1 items-center justify-center rounded-2xl border border-white/25 bg-white/15">
              <n.Icon size={node * 0.38} color="#fff" />
              <Text className="text-white font-bold" style={{ fontSize: 9 }}>
                {n.label}
              </Text>
            </View>
          </FloatingNode>
        );
      })}
    </View>
  );
}

function StickyBar({ visible, wide }: { visible: boolean; wide: boolean }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const anim = useRef(new Animated.Value(0)).current; // 0 = hidden, 1 = shown

  useEffect(() => {
    Animated.timing(anim, {
      toValue: visible ? 1 : 0,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [visible, anim]);

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        opacity: anim,
        transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-72, 0] }) }],
        backgroundColor: 'rgba(10,61,55,0.92)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.12)',
        paddingTop: insets.top,
        ...(Platform.OS === 'web' ? ({ backdropFilter: 'blur(12px)' } as any) : {}),
      }}
    >
      <View
        className="w-full self-center flex-row items-center justify-between px-6 py-3"
        style={{ maxWidth: 1200 }}
      >
        <View className="flex-row items-center gap-3">
          <View className="w-8 h-8 rounded-full bg-white/15 items-center justify-center">
            <Heart size={16} color="#fff" fill="#fff" />
          </View>
          <Text className="text-white font-bold text-base">Tena+</Text>
        </View>

        {wide && (
          <View className="flex-row gap-8">
            {NAV.map((l) => (
              <TouchableOpacity key={l} /* TODO: scroll to section */>
                <Text className="text-white/80 text-sm font-medium">{l}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text className="text-teal-200 text-sm font-semibold">Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/register')}
            className="flex-row items-center gap-1 bg-teal-400 rounded-xl px-4 py-2"
            activeOpacity={0.85}
          >
            <Text className="text-white font-bold text-sm">Get Started</Text>
            <ChevronRight size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

export default function LandingScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const orbitSize = wide ? 460 : Math.min(width - 48, 360);
  const cols = wide ? 4 : width >= 640 ? 2 : 1;

  // show the sticky bar once the user scrolls past the top nav
  const [showBar, setShowBar] = useState(false);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const past = e.nativeEvent.contentOffset.y > 120;
    setShowBar((prev) => (prev === past ? prev : past));
  };

  return (
    <LinearGradient colors={['#0a3d37', '#0f4c45', '#1e7a6e']} locations={[0, 0.45, 1]} style={{ flex: 1 }}>
      {/* faint cross, top right */}
      <View pointerEvents="none" style={{ position: 'absolute', right: 40, top: 60, opacity: 0.07 }}>
        <View style={{ width: 70, height: 210, backgroundColor: '#fff', borderRadius: 14, left: 70 }} />
        <View style={{ width: 210, height: 70, backgroundColor: '#fff', borderRadius: 14, top: -140 }} />
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} onScroll={onScroll} scrollEventThrottle={16}>
        <View className="w-full self-center px-6 pb-16" style={{ maxWidth: 1200 }}>
          {/* Nav */}
          <View className="flex-row items-center justify-between py-5">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-white/15 items-center justify-center">
                <Heart size={20} color="#fff" fill="#fff" />
              </View>
              <Text className="text-white font-bold text-lg">Tena+</Text>
            </View>

            {wide && (
              <View className="flex-row gap-8">
                {NAV.map((l) => (
                  <TouchableOpacity key={l} /* TODO: scroll to section */>
                    <Text className="text-white/80 text-sm font-medium">{l}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View className="flex-row items-center gap-4">
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text className="text-teal-200 text-sm font-semibold">Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/register')}
                className="flex-row items-center gap-1 bg-teal-400 rounded-xl px-5 py-3"
                activeOpacity={0.85}
              >
                <Text className="text-white font-bold text-sm">Get Started</Text>
                <ChevronRight size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Hero */}
          <View className={`${wide ? 'flex-row items-center' : ''} pt-8 gap-10`}>
            <View style={{ flex: wide ? 1 : undefined }} className="gap-5">
              <View className="self-start flex-row items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2">
                <View className="w-2 h-2 rounded-full bg-teal-300" />
                <Text className="text-white text-xs">Powered by Fayda Digital ID · ፋይዳ ዲጂታል መታወቂያ</Text>
              </View>

              <Text
                className="text-white font-extrabold"
                style={{ fontSize: wide ? 64 : 42, lineHeight: wide ? 68 : 46 }}
              >
                Ethiopia's{'\n'}
                <Text className="text-teal-200">National</Text>
                {'\n'}Healthcare Platform
              </Text>

              <Text className="text-teal-100/90 text-lg" style={{ maxWidth: 480 }}>
                Seamless, secure healthcare for every Ethiopian from Addis Ababa to the most remote kebele.
              </Text>
              <Text className="text-teal-200/80 text-sm">ለሁሉም ኢትዮጵያውያን ሁሉን አቀፍ ዲጂታል የጤና አገልግሎት</Text>

              <View className="flex-row gap-3 mt-2 pb-6">
                <UnderglowButton
                  glowColor="#99f6e4"
                  onPress={() => router.push('/register')}
                  className="bg-white px-6 py-3.5"
                >
                  <Text className="text-teal-700 font-bold text-sm">Get Started</Text>
                </UnderglowButton>

                <UnderglowButton
                  glowColor="#22d3ee"
                  onPress={() => router.push('/login')}
                  className="bg-teal-900 border border-white/30 px-6 py-3.5"
                >
                  <Text className="text-white font-semibold text-sm">Sign In</Text>
                </UnderglowButton>
              </View>
            </View>

            <View className="items-center">
              <Orbit size={orbitSize} />
            </View>
          </View>
        </View>
        <View className="bg-gray-50 py-5 ">
          <View className="w-full self-center px-6 "
          style={{ maxWidth: 1200 }}>
            <TrustBadges />
          </View>
        </View>
        <View className="bg-white w-full flex items-center justify-center py-20">
          <Text className="text-teal-600  font-semibold text-xl mb-8">PLATFORM FEATURES</Text>
          <Text className="font-bold text-4xl mb-2">Everything in one app</Text>
          <Text className="text-teal-600 mb-8">ሁሉም በአንድ መተግበሪያ</Text>
          <Text className="text-gray-600 mb-10">Tena+ unifies the complete care journey from verification to prescription pickup.</Text>
          <View className="w-full self-center flex-row flex-wrap px-6" style={{ maxWidth: 1200 }}>
            {FEATURES.map((f) => (
              <View key={f.title} style={{ width: `${100 / cols}%`, padding: 8 }}>
                <FeatureCard {...f} />
               </View>
            ))}
          </View>
        </View>
        <View className="bg-gray-50 w-full flex items-center justify-center py-20">
          <Text className="text-teal-600 font-semibold text-lg mb-8">How It Works</Text>
          <Text className="text-black font-bold text-4xl mb-3">5 steps to complete care</Text>
          <Text className="text-teal-600 font-semibold text-sm mb-8">ሙሉ ሕክምና በ5 ደረጃዎች</Text>
          <Text className="text-gray-500 text-sm mb-8">From first tap to full health coverage in under 3 minutes if you have a Fayda National ID.</Text>
          <View className="mb-9">
          <HowItWorks/>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/fayda')}
            className="flex-row items-center gap-4 bg-teal-400 rounded-2xl px-4 py-4"
            activeOpacity={0.85}
          >
            <Text className="text-white font-bold text-lg">Start Your Journey</Text>
            <ChevronRight size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        <View className="bg-white w-full flex items-center justify-center py-20">
          <Text className="text-teal-600  font-semibold text-xl mb-8">Built for Everyone</Text>
          <Text className="font-bold text-4xl mb-2">Benefits for every stakeholder</Text>
          <Text className="text-teal-600 mb-8">ለሁሉም ባለድርሻ ጥቅም</Text>
          <Text className="text-gray-600 mb-10">Tena+ serves patients, providers, and government with a single integrated platform.</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}