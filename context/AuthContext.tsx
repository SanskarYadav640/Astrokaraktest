// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { hasSupabaseConfig, supabase } from '../src/lib/supabaseClient';

type Role = 'admin' | 'subscriber' | 'public';

type Profile = {
  id: string;
  role: 'admin' | 'subscriber';
  subscription_active: boolean;
};

type AppUser = {
  id: string;
  email: string | null;
  name: string;
  avatar: string;
  tier: 'Student' | 'Member';
  joinDate: string;
  bio?: string;
};

type AuthContextValue = {
  user: AppUser | null;
  profile: Profile | null;
  role: Role;
  loading: boolean;
  isLoggedIn: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (patch: Partial<Pick<AppUser, 'name' | 'bio'>>) => void;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  role: 'public',
  loading: true,
  isLoggedIn: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  loginWithGoogle: async () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  loginWithEmail: async () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  logout: async () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateProfile: () => {},
});

function mapSessionToUser(sessionUser: any, profile: Profile | null): AppUser {
  const email = sessionUser?.email ?? null;
  const fullName =
    sessionUser?.user_metadata?.full_name ??
    sessionUser?.user_metadata?.name ??
    email ??
    'Member';

  const avatarUrl =
    sessionUser?.user_metadata?.avatar_url ??
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(fullName)}`;

  const createdAt = sessionUser?.created_at ?? new Date().toISOString();
  const joinDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const isStudent = profile?.subscription_active === true || profile?.role === 'admin';

  return {
    id: sessionUser.id,
    email,
    name: fullName,
    avatar: avatarUrl,
    tier: isStudent ? 'Student' : 'Member',
    joinDate,
    bio: undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [rawUser, setRawUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfileAndUser = async (currentUser: any | null) => {
    try {
      setRawUser(currentUser);

      if (!currentUser || !supabase) {
        setProfile(null);
        setUser(null);
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('id, role, subscription_active')
        .eq('id', currentUser.id)
        .maybeSingle();

      const profileData = (data as Profile | null) ?? null;
      setProfile(profileData);
      setUser(mapSessionToUser(currentUser, profileData));
    } catch (err) {
      // Keep the app usable even if profile fetch fails.
      // eslint-disable-next-line no-console
      console.error('Failed to hydrate user profile:', err);
      setProfile(null);
      if (currentUser) {
        setUser(mapSessionToUser(currentUser, null));
      } else {
        setUser(null);
      }
    }
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const init = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const currentUser = session?.user ?? null;
        await refreshProfileAndUser(currentUser);
      } finally {
        setLoading(false);
      }
    };

    void init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      void refreshProfileAndUser(currentUser);
    });

    return () => subscription.unsubscribe();
  }, []);

  const role: Role =
    !rawUser ? 'public'
    : profile?.role === 'admin' ? 'admin'
    : 'subscriber';

  const isLoggedIn = !!rawUser;

  const loginWithGoogle = async () => {
    if (!supabase) {
      // eslint-disable-next-line no-alert
      alert('Supabase is not configured for this deployment.');
      return;
    }
    // For HashRouter apps, complete OAuth inside a dedicated hash callback route.
    const redirectTo = `${window.location.origin}${window.location.pathname}#/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    });
    if (error) {
      // eslint-disable-next-line no-alert
      alert(error.message);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    if (!supabase) {
      // eslint-disable-next-line no-alert
      alert('Supabase is not configured for this deployment.');
      return;
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      // eslint-disable-next-line no-alert
      alert(error.message);
      return;
    }
    await refreshProfileAndUser(data.user ?? null);
  };

  const logout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setRawUser(null);
    setProfile(null);
    setUser(null);
  };

  const updateProfile = (patch: Partial<Pick<AppUser, 'name' | 'bio'>>) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        loading,
        isLoggedIn,
        loginWithGoogle,
        loginWithEmail,
        logout,
        updateProfile,
      }}
    >
      {!hasSupabaseConfig ? (
        <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7] p-6">
          <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg px-8 py-10 border border-gray-100">
            <h1 className="text-2xl font-serif font-bold text-gray-900 mb-3">Configuration required</h1>
            <p className="text-sm text-gray-600 mb-4">
              Supabase is not configured for this deployment. Add these environment variables in Vercel, then redeploy.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 font-mono space-y-1">
              <div>VITE_SUPABASE_URL=...</div>
              <div>VITE_SUPABASE_ANON_KEY=...</div>
              <div>VITE_SUPABASE_PUBLISHABLE_KEY=... (optional alternative)</div>
            </div>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
