/// <reference types="vite/client" />

import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

// Vite exposes env vars via import.meta.env (injected at build time)
const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const envPublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const supabaseUrl = envUrl?.trim();
export const supabaseAnonKey = (envAnonKey ?? envPublishableKey)?.trim();

export const hasSupabaseConfig = !!(supabaseUrl && supabaseAnonKey);

if (!hasSupabaseConfig) {
  // eslint-disable-next-line no-console
  console.error(
    'Missing Supabase configuration. Please set VITE_SUPABASE_URL and either VITE_SUPABASE_ANON_KEY or VITE_SUPABASE_PUBLISHABLE_KEY.',
  );
}

export const supabase: SupabaseClient | null = hasSupabaseConfig
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
