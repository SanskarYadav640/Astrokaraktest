
export interface Service {
  id: string;
  title: string;
  duration: number; // minutes
  price: number;
  currency: string;
  description: string;
  isActive: boolean;
  image?: string;
  bookingsCount: number;
}

export type BookingCategory = '1:1 Calls' | 'Webinars' | 'eBooks' | 'Infographics' | 'Digital Downloads' | 'Packages';

export interface AdminBooking {
  id: string;
  clientName: string;
  clientEmail: string;
  category: BookingCategory;
  title: string;
  date: string; // Display date e.g., "Sun, 18 Jan 2026"
  isoDate: string; // For sorting
  startTime?: string;
  endTime?: string;
  amount: number;
  currency: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  img?: string;
  meetingLink?: string; // For 1:1 Calls
  stats?: {
    sales: number;
    followers?: number;
  };
}

const SERVICES_KEY = 'astrokarak_admin_services';
const BOOKINGS_KEY = 'astrokarak_admin_bookings_v3';

const DEFAULT_SERVICES: Service[] = [
  {
    id: 'srv-1',
    title: 'Natal Chart Analysis',
    duration: 75,
    price: 250,
    currency: 'USD',
    description: 'Complete breakdown of D1, D9, and D10 charts with Dasha timing.',
    isActive: true,
    bookingsCount: 12,
    image: 'https://picsum.photos/seed/natal/400/400'
  },
  {
    id: 'srv-2',
    title: 'Specific Question (Prashna)',
    duration: 40,
    price: 150,
    currency: 'USD',
    description: 'Focused analysis on a single life event or burning question.',
    isActive: true,
    bookingsCount: 8,
    image: 'https://picsum.photos/seed/prashna/400/400'
  }
];

const MOCK_DIVERSE_BOOKINGS: AdminBooking[] = [
  {
    id: 'bk-1',
    clientName: 'Vaishnavi',
    clientEmail: 'vaish@example.com',
    category: '1:1 Calls',
    title: 'Natal Chart Analysis (D1 + D9)',
    date: 'Sun, 18 Jan 2026',
    isoDate: '2026-01-18',
    startTime: '07:30 PM',
    endTime: '07:50 PM',
    amount: 2400,
    currency: 'INR',
    status: 'Upcoming',
    paymentStatus: 'Paid',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vaishnavi'
  },
  {
    id: 'bk-2',
    clientName: 'Ishan Anand',
    clientEmail: 'ishan@example.com',
    category: '1:1 Calls',
    title: 'Career & D10 Consultation',
    date: 'Sat, 17 Jan 2026',
    isoDate: '2026-01-17',
    startTime: '04:40 PM',
    endTime: '05:20 PM',
    amount: 4500,
    currency: 'INR',
    status: 'Completed',
    paymentStatus: 'Paid',
    img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ishan'
  },
  {
    id: 'bk-3',
    clientName: 'Rohan Mehta',
    clientEmail: 'rohan@example.com',
    category: 'Webinars',
    title: 'Navamsa Secrets: Live Workshop',
    date: 'Sun, 11 Jan 2026',
    isoDate: '2026-01-11',
    startTime: '08:00 PM',
    endTime: '10:00 PM',
    amount: 1200,
    currency: 'INR',
    status: 'Upcoming',
    paymentStatus: 'Paid',
    img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan'
  },
  {
    id: 'bk-4',
    clientName: 'Sarah Jenkins',
    clientEmail: 'sarah@example.com',
    category: 'eBooks',
    title: 'The Mechanics of Rahu & Ketu',
    date: 'Thu, 25 Dec 2025',
    isoDate: '2025-12-25',
    amount: 24,
    currency: 'USD',
    status: 'Completed',
    paymentStatus: 'Paid',
    img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  },
  {
    id: 'bk-5',
    clientName: 'David Chen',
    clientEmail: 'david@example.com',
    category: 'Infographics',
    title: '27 Nakshatras: Visual Guide',
    date: 'Tue, 23 Dec 2025',
    isoDate: '2025-12-23',
    amount: 15,
    currency: 'USD',
    status: 'Completed',
    paymentStatus: 'Paid',
    img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David'
  },
  {
    id: 'bk-6',
    clientName: 'Lalith',
    clientEmail: 'lalith@example.com',
    category: 'Packages',
    title: 'Complete Foundation Bundle',
    date: 'Mon, 22 Dec 2025',
    isoDate: '2025-12-22',
    amount: 99,
    currency: 'USD',
    status: 'Completed',
    paymentStatus: 'Paid',
    img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lalith'
  }
];

export const getServices = (): Service[] => {
  if (typeof window === 'undefined') return DEFAULT_SERVICES;
  const stored = localStorage.getItem(SERVICES_KEY);
  if (!stored) {
    localStorage.setItem(SERVICES_KEY, JSON.stringify(DEFAULT_SERVICES));
    return DEFAULT_SERVICES;
  }
  return JSON.parse(stored);
};

export const saveService = (service: Service) => {
  const services = getServices();
  const index = services.findIndex(s => s.id === service.id);
  if (index >= 0) {
    services[index] = service;
  } else {
    services.push(service);
  }
  localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
};

export const deleteService = (id: string) => {
  const services = getServices();
  const filtered = services.filter(s => s.id !== id);
  localStorage.setItem(SERVICES_KEY, JSON.stringify(filtered));
};

export const getAdminBookings = (): AdminBooking[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(BOOKINGS_KEY);
  if (!stored) {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(MOCK_DIVERSE_BOOKINGS));
    return MOCK_DIVERSE_BOOKINGS;
  }
  return JSON.parse(stored);
};