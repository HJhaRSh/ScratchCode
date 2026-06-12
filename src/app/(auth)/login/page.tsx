'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowRight } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read potential errors passed from OAuth redirect failures
  useEffect(() => {
    const oauthError = searchParams.get('error');
    if (oauthError) {
      setError(oauthError);
    }
  }, [searchParams]);

  const handleLogin = async () => {
    setError(null);
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (data?.session) {
        // Redirection handled seamlessly by Next.js router
        const nextUrl = searchParams.get('next');
        router.push(nextUrl || '/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong during signing in.');
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-black bg-noise flex flex-col items-center justify-center p-4 overflow-x-hidden relative">
      <Link href="/" className="absolute top-8 left-8 flex items-center group">
        <span className="font-logo text-2xl font-bold text-white tracking-tighter hover:text-[#d9f95d] transition-colors">&lt;scratch.code&gt;</span>
      </Link>

      <div className="w-full max-w-md bg-[#111111] border border-white/[0.05] rounded-3xl p-8 md:p-10 space-y-8 shadow-2xl relative">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-sm">Sign in to continue your coding journey</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm text-center animate-pulse">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-display font-bold tracking-widest text-slate-500 uppercase">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={loading}
              className="w-full h-12 px-4 bg-black border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50 font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-display font-bold tracking-widest text-slate-500 uppercase">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              className="w-full h-12 px-4 bg-black border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50 font-mono text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleLogin();
              }}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full h-12 mt-2 bg-white hover:bg-slate-200 disabled:bg-white/10 disabled:text-slate-500 text-black font-display font-bold tracking-wide rounded-xl transition-all flex items-center justify-center cursor-pointer disabled:cursor-not-allowed transform active:scale-95"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                <span>Signing In...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">Sign In <ArrowRight className="w-4 h-4" /></span>
            )}
          </button>
        </div>



        <div className="text-center text-sm text-slate-500 pt-4 border-t border-white/[0.05]">
          Don't have an account?{' '}
          <Link href={`/signup${searchParams.get('next') ? `?next=${encodeURIComponent(searchParams.get('next')!)}` : ''}`} className="text-white hover:text-slate-300 font-bold hover:underline transition-colors">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black bg-noise flex flex-col items-center justify-center p-4 overflow-x-hidden relative">
        <div className="w-full max-w-md bg-[#111111] border border-white/[0.05] rounded-3xl p-8 space-y-6 shadow-2xl flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
