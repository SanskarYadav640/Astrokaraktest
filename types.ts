export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt?: string;
  isPublished: boolean;
}

// --- PRODUCTS & COURSES TYPES (V1) ---

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  instructor: string;
  coverImage?: string;
  priceInr: number;
  durationHours: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  format: "Recorded" | "Live" | "Hybrid";
  modules: CourseModule[];
  isPublished: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  pdfUrl?: string;
  durationMins: number;
  isPreview: boolean;
}

// --- NEW SERVICES & BOOKINGS TYPES (V1) ---

export type ServiceType =
  | 'CALL_1_1'
  | 'WRITTEN_ANALYSIS'
  | 'REPORT'
  | 'DIGITAL_PRODUCT'
  | 'PACKAGE';

export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'phone'
  | 'number'
  | 'date'
  | 'time'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'file'
  | 'timezone'
  | 'country';

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormField {
  key: string;               // stable id, used in DB later (supabase)
  label: string;             // UI label
  type: FormFieldType;
  required?: boolean;
  placeholder?: string;
  helperText?: string;

  // for select/radio/multi
  options?: FormFieldOption[];

  // basic constraints (optional)
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;          // regex string (optional)
}

export interface FormSchema {
  version: number;           // bump if you change schema meaningfully
  fields: FormField[];
}

export interface Service {
  id: string;

  // NEW
  serviceType: ServiceType;
  slug: string;              // used later for SEO pages and stable URLs
  formSchema: FormSchema;    // intake / checkout form by service type

  title: string;
  durationMins: number;      // for digital products can be 0
  priceInr: number;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  // open bucket for UI-only flags (safe now, easy later)
  metadata?: Record<string, any>;
}

export interface Booking {
  id: string;
  serviceId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  scheduledAt: string; // ISO date time
  status: BookingStatus;
  paymentStatus: "paid" | "pending" | "failed";
  createdAt: string;
  notes?: string;
}

export type BookingStatus = "confirmed" | "completed" | "cancelled" | "rescheduled";

export interface DigitalProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  priceInr: number;
  fileUrl: string;
  fileType: "pdf" | "zip" | "video";
  isPublished: boolean;
  createdAt: string;
}
