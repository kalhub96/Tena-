import { ReactNode } from 'react';
import { Platform, TouchableOpacity, ViewStyle } from 'react-native';

type Props = {
  onPress?: () => void;
  glowColor?: string;   // hex, e.g. '#5eead4'
  className?: string;   // NativeWind classes for the button itself
  radius?: number;      // must match the rounded-* in className
  children: ReactNode;  // put <Text>/icons here, not a nested button
};

const rgba = (hex: string, a: number) => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

export function UnderglowButton({ onPress, glowColor = '#5eead4', className = '', radius = 12, children }: Props) {
  const glow: ViewStyle = Platform.select({
    web: { boxShadow: `0 8px 24px ${rgba(glowColor, 0.55)}` } as ViewStyle,
    default: {
      shadowColor: glowColor,
      shadowOpacity: 0.7,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 12, // Android only tints with shadowColor on API 28+
    },
  })!;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className={className}
      style={[{ borderRadius: radius }, glow]}
    >
      {children}
    </TouchableOpacity>
  );
}