import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicLogin: React.FC = () => {
  const {
    hasAccess,
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    continueAsGuest,
  } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (hasAccess) {
      navigate('/', { replace: true });
    }
  }, [hasAccess, navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (mode === 'signup') {
      await signupWithEmail(email, password, name);
      return;
    }

    await loginWithEmail(email, password);
  };

  const handleGuestAccess = () => {
    continueAsGuest();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Welcome to Astrokarak</h1>
          <p className="text-sm text-gray-500">Choose how you want to enter the website.</p>
        </div>

        <div className="mb-6 p-1 bg-gray-100 rounded-xl grid grid-cols-2 gap-1 text-xs font-bold uppercase tracking-widest">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`py-2 rounded-lg transition-all ${mode === 'signin' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`py-2 rounded-lg transition-all ${mode === 'signup' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4 mb-5">
          {mode === 'signup' && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={mode === 'signup'}
                placeholder="Your full name"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all text-sm"
              />
            </div>
          )}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all text-xs uppercase tracking-widest"
          >
            {mode === 'signup' ? 'Create Account' : 'Sign In with Email'}
          </button>
        </form>

        <button
          onClick={() => loginWithGoogle('/')}
          className="w-full py-3 bg-white text-gray-900 font-bold rounded-xl border border-gray-200 hover:border-amber-700 hover:text-amber-700 transition-all text-[11px] uppercase tracking-widest mb-3"
        >
          Continue with Google
        </button>

        <button
          onClick={handleGuestAccess}
          className="w-full py-3 bg-amber-50 text-amber-800 font-bold rounded-xl border border-amber-100 hover:bg-amber-100 transition-all text-[11px] uppercase tracking-widest"
        >
          Continue as Guest
        </button>

      </div>
    </div>
  );
};

export default PublicLogin;
