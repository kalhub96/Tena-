import { View, Text } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

type Props = {
    title: string;
    amharic: string;
    desc: string;
    Icon: LucideIcon;
    bgClass: string;
    iconColor: string;
};

export default function FeatureCard({ title, amharic, desc, Icon, bgClass, iconColor }: Props) {
    return (
        <View className="rounded-2xl border border-gray-200 bg-white p-6">
            <View className={'w-10 h-10 rounded-xl items-center justify-center ${bgClass}'}>
                <Icon size={30} color={iconColor}/>
            </View>
            <Text className="text-base font-bold text-gray-900 mt-4">{title}</Text>
            <Text className="text-xl text-teal-600 mt-0.5">{amharic}</Text>
            <Text className="text-xs text-gray-500 leading-5 mt-3">{desc}</Text>
        </View>
    )
}