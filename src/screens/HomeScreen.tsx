import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
    CalendarDays, 
    Users, 
    Video,
    CircleAlert,
    MapPin,
    Heart,
    Pill,
    Activity,
    FileText,
    TrendingUp,
    Clock,
    type LucideIcon, 
} from 'lucide-react-native';

//demo 
const USER = { name: 'አበበ ከበደ', healthId: 'ETH-2024-789456' };

const APPOINTMENT = {
    doctor: 'Dr. ፍቅረ ስላሴ',
    type: 'General Consultation',
    place: 'Black Lion Hospital, Addis Ababa',
    when: 'Tomorrow',
    time: '2:30 PM',
};

const ACTIONS: {label: string; Icon:LucideIcon; bg: string; color: string; href?: string }[] = [
    { label: 'Book', Icon:  CalendarDays, bg: '#dbeafe', color: '#2563eb', href: '/appointments'},
    { label: 'Queue', Icon: Users, bg: '#ccfbf1', color: '#0d9488' },
    { label: 'Video', Icon: Video, bg: '#f3e8ff', color: '#9333ea' },
    { label: 'SOS', Icon: CircleAlert, bg: '#fee2e2', color: '#dc2626' },
];

const ACTIVITY: { title: string; sub: string; time: string; Icon: LucideIcon; bg: string; color: string}[] = [
    {
        title: 'Lab Result Available',
        sub: 'Blood test - CBC completed',
        time: '2 hours ago',
        Icon: FileText,
        bg: '#dcfce7',
        color: '#16a34a'
    },
    {
        title: 'Appointment Confirmed',
        sub: `Tomorrow at 2:30 PM with ${APPOINTMENT.doctor}`,
        time: 'Yesterday',
        Icon: CalendarDays,
        bg: '#dbeafe',
        color: '#2563eb'
    },
];

function greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 18) return 'Good Afternoon';
    return 'Good Evening';
}

function Card({ children }: { children: React.ReactNode }) {
    return <View className="bg-white rounded-2xl p-4 mt-3">{children}</View>;
}

export default function HomeScreen(){
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const go = (href?: string) => {
        if (href) router.push(href as any);
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#f8fafc' }} contentContainerStyle={{ paddingBottom: 32 }}>
            {/*header*/}
            <LinearGradient
                colors={['#0f9488', '#0f766e', '#047857']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ 
                    paddingTop: insets.top + 16,
                    paddingBottom: 24, 
                    paddingHorizontal: 12,
                    borderBottomLeftRadius: 28,
                    borderBottomRightRadius: 28,
                }}
            >
                <View className="w-full self-center" style={{ maxWidth: 720}}>
                    <View className="flex-row item-start justify-between px-1">
                        <View>
                            <Text className="text-teal-100 text-xs">ሰላም . {greeting()}</Text>
                            <Text className="text-white text-xl font=bold mt-0.5">{USER.name}</Text>

                            <Text className="text-teal-100/80 mt-1" style={{ fontSize: 10}}>
                                ID: {USER.healthId}
                            </Text>
                        </View>

                        <View className="flex-row" style={{ gap: 8}}>
                            <TouchableOpacity
                            className="w-9 h-9 rounded-lg bg-white/20 items-center justify-center"
                            activeOpacity={0.8}
                            >
                                <Heart size={16} color="#fff"/>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* appointment */}
                    <View className="rounded-2xl bg-white/95 p-4 mt-4 flex-row justify-between">
                        <View className="flex-1" style={{ paddingRight: 12}}>
                            <Text className="text-gray-500" style={{ fontSize: 10 }}>
                                Next Appointment
                            </Text>
                            <Text className="text-gray-900 text-base font-bold mt-0.5">{APPOINTMENT.doctor}</Text>
                            <Text className="text-gray-500 text-xs mt-0.5">{APPOINTMENT.type}</Text>

                            <View className="flex-row item-center mt-3" style={{ gap: 6 }}>
                                <MapPin size={12} color="#64748b" />
                                <Text className="text-gray-500" style={{ fontSize: 10 }}>
                                    {APPOINTMENT.place}
                                </Text>
                            </View>
                        </View>
                        <View className="items-end">
                            <View className="rounded-full bg-teal-100 px-3 py-1">
                                <Text className="text-text-700 font-semibold" style={{ fontSize: 10 }}>
                                    {APPOINTMENT.when}
                                </Text>
                            </View>
                            <Text className="text-gray-900 text-xs font-bold mt-2">{APPOINTMENT.time}</Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>

            <View className="w-full self-center px-3" style={{ maxWidth: 720 }}>
                {/* quick actions */}
                <View className="flex-row mt-3" style={{ gap: 8 }}>
                    {ACTIONS.map(({ label, Icon, bg, color, href }) =>(
                        <TouchableOpacity
                        key={label}
                        onPress={() => go(href)}
                        activeOpacity={0.8}
                        className="flex-1 bg-white rounded-xl items-center py-3">
                            <View
                            className="w-9 h-9 rounded-lg items-center justify-center"
                            style={{ backgroundColor: bg }}>
                                <Icon size={16} color={color}/>
                            </View>
                            <Text className="text-gray-700 font-simebold mt-2" style={{ fontSize: 10 }}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                {/* prescription status */}
                <Card>
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-gray-900 text-sm font-bold">Perscription Status</Text>
                        <TouchableOpacity>
                            <Text className="text-teal-600 text-xs font-semibold">View All</Text>
                        </TouchableOpacity>
                    </View>
                    <View
                    className="flex-row items-center rounded-xl px-3 py-3"
                    style={{ backgroundColor: '#fffbeb', gap: 12 }}>
                        <View className="w-8 h-8 rounded-lg bg-amber-100 items-center justify-center">
                            <Pill size={15} color="#d97706"/>
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-900 text-xs font-semibold">Amoxicillin 500mg</Text>
                            <Text className="text-gray-500" style={{ fontSize: 10 }}>
                                Refill needed in 3 days
                            </Text>
                        </View>
                        <TouchableOpacity className="rounded-lg bg-slate-100 px-3 py-1.5" activeOpacity={0.8}>
                            <Text className="text-gray-700 text-xs font-semibold">Refill</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
                {/* health summary */}
                <Card>
                    <Text className="text-gray-900 text-sm font-bold mb-3"> Health Summary </Text>
                    <View className="flex-row" style={{ gap: 12 }}>
                        <View className="flex-1 rounded-xl bg-red-50 p-4">
                            <View className="flex-row item-center justify-between">
                                <Activity size={15} color="#dc2626" />
                                <TrendingUp size={15} color="#dc2626" />
                            </View>
                            <Text className="text-gray-900 text-2xl font-bold mt-3">72</Text>
                            <Text className="text-gray-500 text-xs mt-0.5">Heart Rate</Text>
                            <Text className="text-gray-400 mt-0.5" style={{ fontSize: 9 }}>
                                bpm . Normal
                            </Text>
                        </View>
                        <View className="flex-1 rounded-xl bg-sky-50 p-4">
                            <View className="flex-row items-center justify-between">
                                <Heart size={15} color="#2563eb" />
                                <TrendingUp size={15} color="#2563eb" />
                            </View>
                            <Text className="text-gray-900 text-2xl font-bold mt-3">118/76</Text>
                            <Text className="text-gray-500 text-xs mt-0.5">Blood Pressure</Text>
                            <Text className="text-gray-400 mt-0.5" style={{ fontSize: 9 }}>
                                mmHg . Optimal
                            </Text>
                        </View>
                    </View>
                </Card>
                {/* recent activity */}
                <Card>
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-gray-900 text-sm font-bold">Recent Activity</Text>
                        <Clock size={14} color="#94a3b8" />
                    </View>
                    <View style={{ gap: 14 }}>
                        {ACTIVITY.map(({ title, sub, time, Icon, bg, color }) => (
                            <View key={title} className="flex-row items-start" style={{ gap: 12 }}>
                                <View
                                className="w-9 h-9 rounded-full items-center justify-center"
                                style={{ backgroundColor: bg }}>
                                    <Icon size={13} color={color} />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-900 text-xs font-semibold">{title}</Text>
                                    <Text className="text-gray-500 mt-0.5" style={{ fontSize: 10 }}>
                                        {sub}
                                    </Text>
                                    <Text className="text-gray-400 mt-0.5" style={{ fontSize: 9 }}>
                                        {time}
                                    </Text>
                                </View>
                            </View> 
                        ))}
                    </View>
                </Card>
            </View>
        </ScrollView>
    );
}