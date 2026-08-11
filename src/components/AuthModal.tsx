import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  X,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Github,
  Globe
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const user: UserProfile = {
        id: `usr_${Math.random().toString(36).substring(2, 8)}`,
        name: name.trim() || email.split('@')[0] || 'Developer',
        email: email.trim(),
        plan: 'free',
        apiCallsUsed: 4,
        apiCallsLimit: 50,
        scriptsGeneratedCount: 3,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      };
      onLoginSuccess(user);
      onClose();
    }, 800);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const user: UserProfile = {
        id: `usr_google_${Math.random().toString(36).substring(2, 8)}`,
        name: 'Tejitha Chowdary',
        email: 'chowdarytejitha553@gmail.com',
        plan: 'pro',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        apiCallsUsed: 12,
        apiCallsLimit: 1000,
        scriptsGeneratedCount: 8,
        joinedDate: 'Aug 2026',
      };
      onLoginSuccess(user);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-400 p-0.5 mx-auto shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-indigo-400">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">
            {mode === 'login' ? 'Welcome Back to EasySetup' : 'Create Your EasySetup Account'}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'login'
              ? 'Access saved setup sessions, AI diagnostic logs, and CLI keys'
              : 'Start setting up laptops with 1-click scripts & AI session chat'}
          </p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-2 font-semibold rounded-lg transition-all ${
              mode === 'login' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`flex-1 py-2 font-semibold rounded-lg transition-all ${
              mode === 'signup' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Social Single Sign-On */}
        <div className="space-y-2">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <span className="relative px-3 bg-slate-900 text-[11px] font-mono text-slate-500 uppercase">
            Or with email
          </span>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Email Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                placeholder="dev@easysetup.dev"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/25 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In to Dashboard' : 'Create Free Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-[11px] text-slate-500">
          By continuing, you agree to EasySetup&apos;s Terms of Service & Privacy Policy.
        </div>
      </div>
    </div>
  );
};
