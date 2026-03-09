// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { hasSupabaseConfig, supabase } from '../src/lib/supabaseClient';

type Role = 'admin' | 'subscriber' | 'public';

type Profile = {
  id: string;
  role: 'admin' | 'subscriber';
  subscription_active: boolean;
  full_name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  created_at?: string | null;
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
  isGuest: boolean;
  hasAccess: boolean;
  loginWithGoogle: (nextPath?: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string, fullName?: string) => Promise<void>;
  continueAsGuest: () => void;
  logout: () => Promise<void>;
  updateProfile: (patch: Partial<Pick<AppUser, 'name' | 'bio'>>) => void;
};

const GUEST_ACCESS_KEY = 'astrokarak_guest_access';
const POST_LOGIN_REDIRECT_KEY = 'astrokarak_post_login_redirect';

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  role: 'public',
  loading: true,
  isLoggedIn: false,
  isGuest: false,
  hasAccess: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  loginWithGoogle: async () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  loginWithEmail: async () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  signupWithEmail: async () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  continueAsGuest: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  logout: async () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateProfile: () => {},
});

function mapSessionToUser(sessionUser: any, profile: Profile | null): AppUser {
  const email = sessionUser?.email ?? profile?.email ?? null;
  const fullName =
    sessionUser?.user_metadata?.full_name ??
    sessionUser?.user_metadata?.name ??
    profile?.full_name ??
    email ??
    'Member';

  const avatarUrl =
    sessionUser?.user_metadata?.avatar_url ??
    profile?.avatar_url ??
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(fullName)}`;

  const createdAt = sessionUser?.created_at ?? profile?.created_at ?? new Date().toISOString();
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
  const [isAdminFlag, setIsAdminFlag] = useState(false);
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(GUEST_ACCESS_KEY) === '1';
  });
  const [loading, setLoading] = useState(true);

  const clearGuestAccess = () => {
    setIsGuest(false);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(GUEST_ACCESS_KEY);
    }
  };

  const refreshProfileAndUser = async (currentUser: any | null) => {
    try {
      setRawUser(currentUser);

      if (!currentUser || !supabase) {
        setProfile(null);
        setUser(null);
        setIsAdminFlag(false);
        return;
      }

      clearGuestAccess();

      const { error: syncError } = await supabase.rpc('sync_my_profile_from_auth');
      if (syncError) {
        // eslint-disable-next-line no-console
        console.warn('Profile sync warning:', syncError.message);
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, role, subscription_active, full_name, email, avatar_url, created_at')
        .eq('id', currentUser.id)
        .maybeSingle();

      const profileData = (data as Profile | null) ?? null;
      setProfile(profileData);
      setUser(mapSessionToUser(currentUser, profileData));

      // Admin access is controlled by server-side allowlist only.
      const { data: adminData, error: adminError } = await supabase.rpc('is_admin');
      if (adminError) {
        // eslint-disable-next-line no-console
        console.warn('Admin role lookup warning:', adminError.message);
      }
      setIsAdminFlag(adminData === true);

      if (error) {
        // eslint-disable-next-line no-console
        console.warn('Profile query warning:', error.message);
      }
    } catch (err) {
      // Keep the app usable even if profile fetch fails.
      // eslint-disable-next-line no-console
      console.error('Failed to hydrate user profile:', err);
      setProfile(null);
      setIsAdminFlag(false);
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

  const role: Role = !rawUser ? 'public' : isAdminFlag ? 'admin' : 'subscriber';

  const isLoggedIn = !!rawUser;
  const hasAccess = isLoggedIn || isGuest;

  const loginWithGoogle = async (nextPath = '/') => {
    if (!supabase) {
      // eslint-disable-next-line no-alert
      alert('Supabase is not configured for this deployment.');
      return;
    }

    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, nextPath);
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

    const currentUser = data.user ?? null;
    if (currentUser) {
      try {
        const { data: adminData } = await supabase.rpc('is_admin');
        if (adminData === true) {
          await supabase.auth.signOut();
          // eslint-disable-next-line no-alert
          alert('Admin accounts must sign in with Google only.');
          return;
        }
      } catch {
        // ignore profile lookup errors and continue with normal sign-in
      }
    }
    await refreshProfileAndUser(currentUser);
  };

  const signupWithEmail = async (email: string, password: string, fullName?: string) => {
    if (!supabase) {
      // eslint-disable-next-line no-alert
      alert('Supabase is not configured for this deployment.');
      return;
    }

    const normalizedName = fullName?.trim();
    const metadata =
      normalizedName
        ? {
            full_name: normalizedName,
            name: normalizedName,
          }
        : undefined;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (error) {
      // eslint-disable-next-line no-alert
      alert(error.message);
      return;
    }

    const currentUser = data.session?.user ?? null;
    if (currentUser) {
      await refreshProfileAndUser(currentUser);
      return;
    }

    // eslint-disable-next-line no-alert
    alert('Signup successful. Check your email for the confirmation link, then sign in.');
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(GUEST_ACCESS_KEY, '1');
    }
  };

  const logout = async () => {
    clearGuestAccess();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setRawUser(null);
    setProfile(null);
    setUser(null);
    setIsAdminFlag(false);
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
        isGuest,
        hasAccess,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        continueAsGuest,
        logout,
        updateProfile,
      }}
    >
      {!hasSupabaseConfig ? (
        <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7] p-6">
          <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg px-8 py-10 border border-gray-100">
            <h1 className="text-2xl font-serif font-bold text-gray-900 mb-3">Configuration required</h1>
            <p className="text-sm text-gray-600 mb-4">
              Supabase is not configured for this deployment. Add these environment variables in your deployment environment (for this repo, GitHub Actions secrets), then redeploy.
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
