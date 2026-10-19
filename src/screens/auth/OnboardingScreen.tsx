import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Hospital, CalendarRange, Siren } from "lucide-react-native";

const { width } = Dimensions.get('window');

const slides = [
  {
    gradient: ['#0f4c45', '#1e7a6e'] as const,
    chip:'One Health Identity',
    title: 'Your health records, always with you',
    body: 'Tena+ creates a unified digital health identity linked to your Fayda ID \n accessible at every hospital, clinic, and pharmacy across Ethiopia.',
  },
  {
    gradient: ['#1a3a7a', '#2457c5'] as const,
    chip: 'Book & Queue',
    title: 'Appointments without the wait',
    body: 'Reserve your slot at any hospital, pick your doctor and department\nthen check in with a QR code. Real-time queue updates keep you informed.',
  },
  {
    gradient: ['#7a1a1a', '#c54224'] as const,
    chip: 'Emergency Ready',
    title: 'Help when every second counts',
    body: 'One-tap SOS shares your location and health ID with responders instantly. \nYour critical health info is always available —even offline.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const next = () => {
    if (idx < slides.length - 1) setIdx(idx + 1);
    else router.replace('/register');
  };

  const slide = slides[idx];

  return (
    
    <View className="flex-1 bg-white">
      {/* Visual panel */}
        <View className="flex items-center justify-center py-10">
          <Text className="text-8xl">
          {idx === 0 ? <Hospital size={80} color="#1e7a6e"/> : idx === 1 ? <CalendarRange size={80} color="#1e7a6e" /> : <Siren size={80} color="#1e7a6e" />}
        </Text>
        </View>

      {/* Content */}
      
      <View className="flex-1 items-center  px-6 pt-8">
        {/* Chip */}
        
          <View className=" items-centerself-start bg-teal-50 rounded-full px-3 py-1 mb-6">
          <Text className="text-teal-700 text-xs font-semibold">{slide.chip}</Text>
        </View>

        <Text className="text-gray-900 text-2xl font-extrabold leading-snug mb-3">
          {slide.title}
        </Text>
        <Text className="text-gray-500 text-sm leading-relaxed">{slide.body}</Text>
      </View>
      

      {/* Bottom */}
      <View className="px-6 pb-10 gap-4">
        {/* Pip indicators */}
        <View className="flex-row gap-1.5 justify-center mb-2">
          {slides.map((_, i) => (
            <View
              key={i}
              className={`h-1 rounded-full ${i === idx ? 'w-4 bg-teal-600' : 'w-2 bg-gray-200'}`}
            />
          ))}
        </View>

        <View className="flex items-center justify-center">
          <TouchableOpacity
          onPress={next}
          className="bg-teal-600 rounded-xl py-4 items-center w-80"
          activeOpacity={0.25}
        >
          <Text className="text-white font-bold text-base">
            {idx === slides.length - 1 ? 'Get started' : 'Continue'}
          </Text>
        </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.replace('/login')} activeOpacity={0.7}>
          <Text className="text-teal-600 font-semibold text-sm text-center">
            {idx === slides.length - 1 ? 'Already have an account' : 'Sign in instead'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
