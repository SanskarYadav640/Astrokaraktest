// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../src/lib/supabaseClient';

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

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const currentUser = session?.user ?? null;
      setRawUser(currentUser);

      if (currentUser) {
        const { data } = await supabase
          .from('profiles')
          .select('id, role, subscription_active')
          .eq('id', currentUser.id)
          .maybeSingle();

        const profileData = (data as Profile | null) ?? null;
        setProfile(profileData);
        setUser(mapSessionToUser(currentUser, profileData));
      } else {
        setProfile(null);
        setUser(null);
      }

      setLoading(false);
    };

    void init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setRawUser(currentUser);
      if (!currentUser) {
        setProfile(null);
        setUser(null);
      } else {
        // Profile will be refreshed shortly by explicit refetch below.
        void (async () => {
          const { data } = await supabase
            .from('profiles')
            .select('id, role, subscription_active')
            .eq('id', currentUser.id)
            .maybeSingle();

          const profileData = (data as Profile | null) ?? null;
          setProfile(profileData);
          setUser(mapSessionToUser(currentUser, profileData));
        })();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const role: Role =
    !rawUser ? 'public'
    : profile?.role === 'admin' ? 'admin'
    : 'subscriber';

  const isLoggedIn = !!rawUser;

  const loginWithGoogle = async () => {
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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      // eslint-disable-next-line no-alert
      alert(error.message);
    }
  };

  const logout = async () => {
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
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);