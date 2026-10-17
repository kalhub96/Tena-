import {
  QrCode,
  CalendarDays,
  Building2,
  FileText,
  Video,
  Pill,
  CircleAlert,
  Activity,
  type LucideIcon,
} from 'lucide-react-native';

export type Feature = {
  title: string;
  amharic: string;
  desc: string;
  Icon: LucideIcon;
  bgClass: string; // full Tailwind class, written out so Tailwind can find it
  iconColor: string;
};

export const FEATURES: Feature[] = [
  {
    title: 'Digital Health ID',
    amharic: 'ዲጂታል ጤና መታወቂያ',
    desc: 'QR-powered, Fayda-linked health identity that works offline at any facility.',
    Icon: QrCode,
    bgClass: 'bg-teal-100',
    iconColor: '#0d9488',
  },
  {
    title: 'Appointment Booking',
    amharic: 'ቀጠሮ ማስያዝ',
    desc: 'Book appointments at any registered facility with real-time queue visibility.',
    Icon: CalendarDays,
    bgClass: 'bg-blue-100',
    iconColor: '#2563eb',
  },
  {
    title: 'Hospital Reservations',
    amharic: 'ሆስፒታል ቦታ ማስያዝ',
    desc: 'Reserve hospital beds, theatres, and specialist consultations in advance.',
    Icon: Building2,
    bgClass: 'bg-indigo-100',
    iconColor: '#4f46e5',
  },
  {
    title: 'Medical Records',
    amharic: 'የሕክምና መዝገብ',
    desc: 'Lifetime health history — labs, diagnoses, prescriptions, immunisations.',
    Icon: FileText,
    bgClass: 'bg-purple-100',
    iconColor: '#9333ea',
  },
  {
    title: 'Telemedicine',
    amharic: 'ርቀት ሕክምና',
    desc: 'Consult doctors via video or chat, optimised for low-bandwidth connections.',
    Icon: Video,
    bgClass: 'bg-cyan-100',
    iconColor: '#0891b2',
  },
  {
    title: 'Pharmacy Integration',
    amharic: 'ፋርማሲ ውህደት',
    desc: 'Order refills, track prescriptions, and find the nearest in-stock pharmacy.',
    Icon: Pill,
    bgClass: 'bg-amber-100',
    iconColor: '#d97706',
  },
  {
    title: 'Emergency SOS',
    amharic: 'ድንገተኛ ረዳት',
    desc: 'One-tap SOS shares your location and medical summary with the nearest facility.',
    Icon: CircleAlert,
    bgClass: 'bg-red-100',
    iconColor: '#dc2626',
  },
  {
    title: 'Rural Healthcare Support',
    amharic: 'ገጠር የጤና ድጋፍ',
    desc: 'Offline-capable community health tracking for workers in remote kebeles.',
    Icon: Activity,
    bgClass: 'bg-green-100',
    iconColor: '#16a34a',
  },
];