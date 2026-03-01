// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Vite exposes env vars via import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // This will surface a clear error in the browser console during development
  // so misconfigured environments are easy to spot.
  // eslint-disable-next-line no-console
  console.error('Missing Supabase configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(
  supabaseUrl ?? '',
  supabaseAnonKey ?? '',
);