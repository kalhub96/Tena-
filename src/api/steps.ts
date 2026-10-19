import { Fingerprint, User, CalendarDays, Heart, Globe, type LucideIcon } from 'lucide-react-native';

export type Step = {
  title: string;
  amharic: string;
  desc: string;
  Icon: LucideIcon;
  color: string; 
};

export const STEPS: Step[] = [
  {
    title: 'Verify with Fayda',
    amharic: 'ፋይዳ ያረጋግጡ',
    desc: 'Scan your Fayda National ID QR, tap NFC card, or enter your ID manually. Biometric check secures your session.',
    Icon: Fingerprint,
    color: '#0d9488',
  },
  {
    title: 'Create Health Profile',
    amharic: 'የጤና መገለጫ ይፍጠሩ',
    desc: 'Your government records auto-fill. Add blood type, allergies, emergency contacts, and insurance details.',
    Icon: User,
    color: '#2563eb',
  },
  {
    title: 'Book Appointment',
    amharic: 'ቀጠሮ ያስይዙ',
    desc: 'Choose a facility, specialist, and time slot. Join the digital queue from home — no waiting-room queues.',
    Icon: CalendarDays,
    color: '#4f46e5',
  },
  {
    title: 'Receive Care',
    amharic: 'ሕክምና ያግኙ',
    desc: 'Walk in, scan your Health ID QR — the doctor sees your complete history instantly. No paperwork needed.',
    Icon: Heart,
    color: '#9333ea',
  },
  {
    title: 'Access Records Anywhere',
    amharic: 'ከየትኛውም ቦታ መዝገብ ያግኙ',
    desc: 'Your encrypted records follow you to any linked facility, even offline. Download, share, or present your QR ID.',
    Icon: Globe,
    color: '#16a34a',
  },
];