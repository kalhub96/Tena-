import { useEffect, useRef } from "react";
import { Animated, Easing, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BadgeCheck, Heart, ShieldCheck } from "lucide-react-native";

const SPLASH_MS = 2800;

export default function SplashScreen() {
  const router = useRouter();
  const fade = useRef(new Animated.Value(0)).current;
  const dots = useRef([0, 1, 2].map(() => new Animated.Value(0.3))).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }).start();

    const loops = dots.map((d, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 200),
          Animated.timing(d, { toValue: 1, duration: 500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(d, { toValue: 0.3, duration: 500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
      ),
    );
    loops.forEach((l) => l.start());

    const timer = setTimeout(() => router.replace("/onboarding"), SPLASH_MS);
    return () => {
      clearTimeout(timer);
      loops.forEach((l) => l.stop());
    };
  }, [router, fade, dots]);

  return (
    <LinearGradient colors={["#0a3d37", "#0f4c45", "#1e7a6e"]} locations={[0, 0.4, 1]} style={{ flex: 1 }}>
      <Animated.View style={{ opacity: fade }} className="flex-1 items-center justify-center px-6">
        <View className="w-24 h-24 rounded-3xl bg-white items-center justify-center mb-6 shadow-2xl">
          <Heart size={44} color="#1e7a6e" fill="#1e7a6e" />
        </View>

        <Text className="text-teal-200 text-lg mb-1 tracking-widest">ጤና</Text>
        <Text className="text-white text-5xl font-extrabold tracking-tight mb-2">
          Tena<Text className="text-teal-300">+</Text>
        </Text>
        <Text className="text-teal-300 text-xs font-medium tracking-widest uppercase text-center mb-10">
          National Healthcare Integration System
        </Text>

        <View className="w-full rounded-2xl border border-white/10 bg-white/10 p-5 gap-3 mb-10">
          <View className="flex-row items-center gap-3 bg-white/5 rounded-xl px-3 py-2.5">
            <View className="w-8 h-8 rounded-lg bg-teal-600 items-center justify-center">
              <ShieldCheck size={16} color="#b3e8e3" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-xs font-semibold">Government-Grade Security</Text>
              <Text className="text-teal-300 text-xs">256-bit encrypted</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-3 bg-white/5 rounded-xl px-3 py-2.5">
            <View className="w-8 h-8 rounded-lg bg-teal-600 items-center justify-center">
              <BadgeCheck size={16} color="#b3e8e3" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-xs font-semibold">Powered by Fayda Digital ID</Text>
              <Text className="text-teal-300 text-xs">Ethiopian National ID Platform</Text>
            </View>
          </View>
        </View>

        <View className="flex-row gap-2 mb-2">
          {dots.map((d, i) => (
            <Animated.View key={i} style={{ opacity: d }} className="w-2 h-2 rounded-full bg-teal-400" />
          ))}
        </View>
        <Text className="text-teal-300 text-xs tracking-wide">Verifying secure connection...</Text>
      </Animated.View>

      <View className="pb-10 items-center">
        <Text className="text-teal-200/60 text-xs">Secured by Ethiopian National ID System</Text>
      </View>
    </LinearGradient>
  );
}
