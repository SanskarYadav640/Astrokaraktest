import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../src/lib/supabaseClient';

const POST_LOGIN_REDIRECT_KEY = 'astrokarak_post_login_redirect';

function readOAuthCodeFromUrl(): string | null {
  const searchParams = new URLSearchParams(window.location.search);
  const codeFromSearch = searchParams.get('code');
  if (codeFromSearch) return codeFromSearch;

  // HashRouter form can look like:
  // #/auth/callback?code=... or #access_token=...
  const hash = window.location.hash ?? '';
  const queryIndex = hash.indexOf('?');
  if (queryIndex >= 0) {
    const hashQuery = hash.slice(queryIndex + 1);
    const hashParams = new URLSearchParams(hashQuery);
    const codeFromHashQuery = hashParams.get('code');
    if (codeFromHashQuery) return codeFromHashQuery;
  }

  return null;
}

function readOAuthTokensFromHash(): { accessToken: string; refreshToken: string } | null {
  const hash = window.location.hash ?? '';

  // Handle both formats:
  // #access_token=...&refresh_token=...
  // #/auth/callback#access_token=...&refresh_token=...
  const marker = 'access_token=';
  const tokenIndex = hash.indexOf(marker);
  if (tokenIndex < 0) return null;

  const tokenPart = hash.slice(tokenIndex);
  const params = new URLSearchParams(tokenPart);
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');

  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
}

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const finish = async () => {
      if (!supabase) {
        navigate('/', { replace: true });
        return;
      }

      const code = readOAuthCodeFromUrl();
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          // eslint-disable-next-line no-console
          console.error('OAuth code exchange failed:', error.message);
        }
      } else {
        const tokens = readOAuthTokensFromHash();
        if (tokens) {
          const { error } = await supabase.auth.setSession({
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken,
          });
          if (error) {
            // eslint-disable-next-line no-console
            console.error('OAuth token session set failed:', error.message);
          }
        } else {
          await supabase.auth.getSession();
        }
      }

      const redirectTarget = window.sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY) || '/';
      window.sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
      navigate(redirectTarget, { replace: true });
    };

    void finish();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7]">
      <div className="bg-white rounded-2xl shadow-lg px-8 py-10 border border-gray-100 text-center">
        <p className="text-sm text-gray-500 mb-3">Completing sign-in with Google…</p>
        <p className="text-xs text-gray-400">You’ll be redirected to your member profile in a moment.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
