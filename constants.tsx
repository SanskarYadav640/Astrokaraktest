import { Member, MemberData, Product, BlogPost, Consultation, FAQ, Testimonial } from './types';

// Ebooks
export const EBOOKS: Product[] = [
  { id: 'eb-1', title: 'The Mechanics of Rahu & Ketu', price: '$24.00', description: 'Deep dive into the lunar nodes.', image: 'https://picsum.photos/seed/eb1/300/400', link: '#' },
  { id: 'eb-2', title: 'Navamsa: The Fruit of the Tree', price: '$29.00', description: 'Understanding the D9 chart.', image: 'https://picsum.photos/seed/eb2/300/400', link: '#' },
  { id: 'eb-3', title: 'Timing with Vimshottari', price: '$19.00', description: 'Predictive techniques.', image: 'https://picsum.photos/seed/eb3/300/400', link: '#' },
  { id: 'eb-4', title: 'Retrograde Planets', price: '$15.00', description: 'Karma and retrogression.', image: 'https://picsum.photos/seed/eb4/300/400', link: '#' },
  { id: 'eb-5', title: 'Nakshatras Vol 1', price: '$35.00', description: 'The 27 lunar mansions.', image: 'https://picsum.photos/seed/eb5/300/400', link: '#' }
];

// Packages
export const PACKAGES: Product[] = [
  { id: 'pk-1', title: 'Complete Foundations Bundle', price: '$99.00', description: 'All beginner ebooks and webinar recordings.', image: 'https://picsum.photos/seed/pk1/300/400', link: '#' },
  { id: 'pk-2', title: 'Advanced Prediction Suite', price: '$149.00', description: 'For professional astrologers.', image: 'https://picsum.photos/seed/pk2/300/400', link: '#' }
];

// Blogs
export const SAMPLE_BLOGS: BlogPost[] = [
  { id: 'b-1', slug: 'saturn-transit-aquarius', title: 'Saturn in Aquarius: The Collective Karma', excerpt: 'What the ringed planet brings to the table for the next 2.5 years.', content: 'Saturn is the planet of karma...', category: 'Transits', date: 'Oct 10, 2023', image: 'https://picsum.photos/seed/b1/800/450', author: 'Astrokarak' },
  { id: 'b-2', slug: 'understanding-rahu-mahadasha', title: 'Navigating Rahu Mahadasha', excerpt: 'The 18-year period of expansion and illusion.', content: 'Rahu represents...', category: 'Dasha and Timing', date: 'Sep 25, 2023', image: 'https://picsum.photos/seed/b2/800/450', author: 'Astrokarak' },
  { id: 'b-3', slug: 'navamsa-secrets', title: 'The Hidden Strength in D9', excerpt: 'Why your birth chart is incomplete without the Navamsa.', content: 'The D9 chart shows...', category: 'Varga Charts', date: 'Sep 15, 2023', image: 'https://picsum.photos/seed/b3/800/450', author: 'Astrokarak' }
];

// Category Map
export const CATEGORY_MAP: Record<string, string> = {
  'Transits': 'transits',
  'Dasha and Timing': 'dasha',
  'Varga Charts': 'varga-charts',
  'Foundations': 'foundations',
  'Planets': 'planets',
  'Houses': 'houses',
  'Signs': 'signs',
  'Nakshatra': 'nakshatra',
  'Yogas': 'yogas',
  'Relationships': 'relationships',
  'Career': 'career',
  'Wealth': 'wealth',
  'Health': 'health',
  'Remedies': 'remedies',
  'FAQ': 'faq'
};

// FAQs
export const HOME_FAQS: FAQ[] = [
  { question: 'What system do you use?', answer: 'We use Sidereal Zodiac with Lahiri Ayanamsa.' },
  { question: 'Is this for beginners?', answer: 'Yes, start with the "Foundations" category.' }
];

export const CONSULTATION_FAQS: FAQ[] = [
  { question: 'How do I book?', answer: 'Select a slot from the calendar after payment.' },
  { question: 'Do you offer recordings?', answer: 'Yes, all sessions are recorded and sent within 24 hours.' }
];

// Testimonials / Reviews
export const ALL_REVIEWS = [
  { id: 1, name: "Sarah Jenkins", role: "Tech Lead", content: "The reading was incredibly grounded. No fluff, just technical observations that matched my life perfectly. The D10 analysis for my career transition was scary accurate.", rating: 5, date: "2 weeks ago", verified: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
  { id: 2, name: "Michael Ross", role: "Angel Investor", content: "I was skeptical about the timing of my capital deployment, but the Dasha analysis was spot on. Saved me from a very bad quarter.", rating: 5, date: "1 month ago", verified: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael" },
  { id: 3, name: "Dr. Anjali Gupta", role: "Neurologist", content: "As a scientist, I appreciate the lack of superstition. Astrokarak treats Jyotish like the data science it is. Highly recommended.", rating: 5, date: "3 weeks ago", verified: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali" },
  { id: 4, name: "David Chen", role: "Architect", content: "The remedial measures suggested were practical—lifestyle changes, not expensive gemstones. It actually worked.", rating: 5, date: "2 months ago", verified: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David" },
  { id: 5, name: "Elena R.", role: "Student", content: "The text-based reading was thorough. I asked 5 questions and got 12 pages of analysis. Worth every penny.", rating: 5, date: "Dec 2023", verified: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena" },
  { id: 6, name: "Marcus T.", role: "Entrepreneur", content: "Birth time rectification was a game changer. Suddenly my charts made sense. The process was mathematical and transparent.", rating: 5, date: "Jan 2024", verified: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" },
  { id: 7, name: "Priya S.", role: "Consultant", content: "Finally, someone who explains 'why' something is happening instead of just predicting doom. Very empowering.", rating: 5, date: "Yesterday", verified: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" },
  { id: 8, name: "James L.", role: "Developer", content: "Technical precision. The course materials combined with the consultation clarified my understanding of the nodes completely.", rating: 4, date: "4 days ago", verified: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James" }
];

export const TESTIMONIALS: Testimonial[] = ALL_REVIEWS.slice(0, 3).map(r => ({ name: r.name, role: r.role, content: r.content }));

// Consultations
export const CONSULTATIONS: Consultation[] = [
  { id: 'c-1', duration: '40 Min', price: '$150', description: 'Focused session on 1-2 specific questions.', bookingLink: '#' },
  { id: 'c-2', duration: '75 Min', price: '$250', description: 'Comprehensive analysis of the entire chart.', bookingLink: '#' },
  { id: 'c-3', duration: '60 Min', price: '$200', description: 'Birth Time Rectification.', bookingLink: '#' }
];

// Courses
export const LIVE_COURSES: Product[] = [
  { id: 'lc-1', title: 'Predictive Astrology Cohort', price: '$499', description: '12-week live mentorship program.', image: 'https://picsum.photos/seed/lc1/300/400', link: '#', isUpcoming: true, courseType: 'Live' }
];

export const RECORDED_COURSES: Product[] = [
  { id: 'rc-1', title: 'The Art of Synthesis', price: '$199', description: 'Mastering the D1, D9, and D10.', image: 'https://picsum.photos/seed/rc1/300/400', link: '#', courseType: 'Recorded' },
  { id: 'rc-2', title: 'Nakshatra Mastery', price: '$149', description: 'Deep dive into the 27 stars.', image: 'https://picsum.photos/seed/rc2/300/400', link: '#', courseType: 'Recorded' }
];

export const RECORDED_WEBINARS: Product[] = [
  { id: 'rw-1', title: 'Saturn in Pisces', price: '$45', description: '2-hour deep dive.', image: 'https://picsum.photos/seed/rw1/300/400', link: '#' }
];

export const ALL_COURSES = [...LIVE_COURSES, ...RECORDED_COURSES, ...RECORDED_WEBINARS];

// Mock Bookings
export const MOCK_BOOKINGS = [
  { id: 'bk-1', name: 'Alice Johnson', email: 'alice@example.com', service: '75 Min Session', date: 'Oct 25, 2023', status: 'Upcoming' },
  { id: 'bk-2', name: 'Bob Williams', email: 'bob@example.com', service: '40 Min Session', date: 'Oct 20, 2023', status: 'Completed' }
];

// Priority Services
export const PRIORITY_SERVICES = [
  { id: 'ps-1', title: 'Priority DM', price: '$50', description: 'Get a text answer within 24h.' }
];

// Mock Member Data
export const MOCK_MEMBER: Member = {
  id: 'mem123',
  name: 'Arjun Sharma',
  email: 'arjun.s@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',
  joinDate: 'Jan 2024',
  tier: 'Student',
  bio: 'Dedicated student of Technical Jyotish. Focus on D9 and D10 analysis.'
};

export const MOCK_MEMBER_DATA: MemberData = {
  courses: [ALL_COURSES[0]],
  ebooks: [EBOOKS[0], EBOOKS[1]],
  consultations: [
    { id: 'c-101', service: '40 Min Session', date: 'Mar 15, 2024', status: 'Completed', recordingUrl: '#' },
    { id: 'c-102', service: 'Birth Time Rectification', date: 'Nov 20, 2024', status: 'Upcoming' }
  ],
  priorityDMs: [
    { id: 'dm-1', question: 'When is my Sade Sati peak?', status: 'Resolved', response: 'Your peak is during the Saturn transit of Aquarius...', date: 'Feb 12, 2024' }
  ],
  savedBlogs: [SAMPLE_BLOGS[0], SAMPLE_BLOGS[2]]
};
