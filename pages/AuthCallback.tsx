import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../src/lib/supabaseClient';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const finish = async () => {
      // Ensure Supabase session is loaded, then send the user to their profile.
      await supabase.auth.getSession();
      navigate('/profile', { replace: true });
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

