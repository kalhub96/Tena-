import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, Shield, BookOpen, Users, Code } from 'lucide-react-native';

type FooterLink = { label: string; href?: string };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Platform',
    links: [
      { label: 'Patient Portal' },
      { label: 'Doctor Dashboard' },
      { label: 'Rural Health Worker' },
    ],
  },
  {
    title: 'Features',
    links: [
      { label: 'Digital Health ID' },
      { label: 'Appointments' },
      { label: 'Telemedicine' },
      { label: 'Emergency SOS' },
    ],
  },
  {
    title: 'Security',
    links: [
      { label: 'Fayda Verification' },
      { label: 'Biometric Login' },
      { label: 'Privacy Policy' },
      { label: 'Terms of Service' },
    ],
  },
  {
    title: 'Developers',
    links: [
      { label: 'API Documentation' },
    ],
  },
];

const QUICK = [
  { label: 'About Tena+', Icon: BookOpen, href: undefined as string | undefined },
  { label: 'Security Centre', Icon: Shield, href: undefined as string | undefined },
  { label: 'Contact Us', Icon: Users, href: undefined as string | undefined },
  { label: 'API Docs', Icon: Code, href: undefined as string | undefined },
];

export default function Footer() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const year = new Date().getFullYear();

  const go = (href?: string) => {
    if (href) router.push(href as any);
  };

  return (
    <View className="w-full" style={{ backgroundColor: '#0d1322' }}>
      {/* top: brand + link columns */}
      <View
        className="w-full self-center px-6 pt-16 pb-12"
        style={{ maxWidth: 1200, flexDirection: wide ? 'row' : 'column', gap: wide ? 0 : 36 }}
      >
        {/* brand column */}
        <View style={{ flex: wide ? 1 : undefined, paddingRight: wide ? 24 : 0 }}>
          <View className="flex-row items-center" style={{ gap: 12 }}>
            <View className="w-10 h-10 rounded-xl bg-teal-600 items-center justify-center">
              <Heart size={20} color="#fff" fill="#fff" />
            </View>
            <View>
              <Text className="text-white font-bold text-base">Tena+</Text>
              <Text className="text-teal-400" style={{ fontSize: 10 }}>
                ጤና
              </Text>
            </View>
          </View>

          <Text className="text-slate-500 text-xs leading-5 mt-5" style={{ maxWidth: 220 }}>
            National Healthcare Integration System. Secured by Ethiopian National ID System.
          </Text>
        </View>

        {/* link columns */}
        <View
          style={{
            flex: wide ? 4 : undefined,
            flexDirection: 'row',
            flexWrap: 'wrap',
            rowGap: 32,
          }}
        >
          {COLUMNS.map((col) => (
            <View key={col.title} style={{ width: wide ? '25%' : '50%', paddingRight: 16 }}>
              <Text className="text-white text-sm font-semibold mb-5">{col.title}</Text>
              <View style={{ gap: 14 }}>
                {col.links.map((l) => (
                  <TouchableOpacity key={l.label} onPress={() => go(l.href)} activeOpacity={0.7}>
                    <Text className="text-slate-400 text-sm">{l.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* quick links */}
      <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)' }}>
        <View
          className="w-full self-center px-6 py-5 flex-row flex-wrap"
          style={{ maxWidth: 1200, columnGap: 28, rowGap: 12 }}
        >
          {QUICK.map(({ label, Icon, href }) => (
            <TouchableOpacity
              key={label}
              onPress={() => go(href)}
              activeOpacity={0.7}
              className="flex-row items-center"
              style={{ gap: 8 }}
            >
              <Icon size={14} color="#94a3b8" />
              <Text className="text-slate-400 text-sm">{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* bottom bar */}
      <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)' }}>
        <View
          className="w-full self-center px-6 py-5"
          style={{
            maxWidth: 1200,
            flexDirection: wide ? 'row' : 'column',
            alignItems: wide ? 'center' : 'flex-start',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <Text className="text-slate-500 text-xs">
            © {year} Tena+ · All rights reserved.
          </Text>
          <View className="flex-row items-center" style={{ gap: 8 }}>
            <Shield size={14} color="#14b8a6" />
            <Text className="text-teal-500 text-xs">Government-Grade Security · Powered by Fayda Digital ID</Text>
          </View>
        </View>
      </View>
    </View>
  );
}