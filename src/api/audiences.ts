import { Users, Activity, Building2, type LucideIcon } from 'lucide-react-native';

export type Audience = {
  title: string;
  amharic: string;
  tagline: string;
  Icon: LucideIcon;
  gradient: [string, string]; // header gradient, top-left to bottom-right
  items: string[];
};

export const AUDIENCES: Audience[] = [
  {
    title: 'Patients',
    amharic: 'ታካሚዎች',
    tagline: 'Take control of your health',
    Icon: Users,
    gradient: ['#0d9488', '#0f766e'],
    items: [
      'Book appointments at any facility in seconds',
      'Access your complete medical history anywhere',
      'Digital Health ID — works offline, everywhere',
      'Emergency SOS with one tap',
      'Prescription refills from your phone',
      'Telemedicine without leaving home',
    ],
  },
  {
    title: 'Healthcare Providers',
    amharic: 'የጤና አቅራቢዎች',
    tagline: 'Deliver better care, faster',
    Icon: Activity,
    gradient: ['#2563eb', '#4338ca'],
    items: [
      'Instant access to verified patient records',
      'Digital queue management — no paper logs',
      'e-Prescriptions synced to any pharmacy',
      'Video consultations with rural patients',
      'Outbreak and epidemic early-warning alerts',
      'Seamless referral network across facilities',
    ],
  },
  {
    title: 'Government',
    amharic: 'መንግሥት',
    tagline: 'Strengthen the national system',
    Icon: Building2,
    gradient: ['#33415c', '#1e293b'],
    items: [
      'Real-time population health dashboard',
      'Fayda-integrated, fraud-proof identity',
      'Disease surveillance and trend analytics',
      'Automated MOH reporting compliance',
      'Rural coverage metrics and gap analysis',
      'Open API for regional system integration',
    ],
  },
];