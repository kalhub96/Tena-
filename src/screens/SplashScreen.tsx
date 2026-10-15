import { useEffect, useRef } from "react";
import { Animated, Easing, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BadgeCheck, Heart, ShieldCheck } from "lucide-react-native";

const SPLASH_MS = 2800;

export default function SplashScreen() {
  const router = useRouter();
  const fade = useRef(new Animated.Value(0)).current;
  const dots = useRef([0, 1, 2].map(() => new Animated.Value(.3))).current;

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
    <main className="min-h-screen bg-background text-foreground">
      <div>
        <LinearGradient colors={["#0a3d37", "#0f4c45", "#1e7a6e"]} locations={[0, 0.4, 1]} style={{ flex: 1 }}>
        <Animated.View style={{ opacity: fade }} className="flex-1 items-center justify-center px-6">
        <div className="flex items-center justify-center py-10">
          <View className="w-20 h-20 rounded-2xl bg-cyan items-center justify-center mb-4 shadow-2xl">
            <Heart size={40} color="#ffff" fill="#ffff" />
          </View>
        </div>
          <div className="flex items-center justify-center py-3"> 
            <Text className="text-white text-3xl font-extrabold tracking-tight mb-2">
            Tena<Text className="text-teal-300">+</Text>
          </Text>
          </div>
          <Text className="text-teal-300 text-xs font-medium tracking-widest uppercase text-center mb-10">
            National Healthcare Integration System
          </Text>

          <div className="flex items-center justify-center">
            <View className="w-80 rounded-2xl border border-white/10 bg-white/10 p-5 gap-3 mb-10 ">
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
          </div>

          <View className="flex-row gap-2 mb-2">
            {dots.map((d, i) => (
              <Animated.View key={i} style={{ opacity: d }} className="w-2 h-2 rounded-full bg-teal-400" />
            ))}
          </View>
          <div className="flex items-center justify-center py-5">
            <Text className="text-teal-300 text-xs tracking-wide">Verifying secure connection...</Text>
          </div>
        </Animated.View>

        <View className="pb-10 items-center py-6">
          <Text className="text-teal-200/60 text-xs">Secured by Ethiopian National ID System</Text>
        </View>
        </LinearGradient>
      </div>
    </main>
  );
}
