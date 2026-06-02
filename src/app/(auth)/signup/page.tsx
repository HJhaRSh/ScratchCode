'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Username status states
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameSuccess, setUsernameSuccess] = useState<string | null>(null);

  // Debounced username availability checker
  useEffect(() => {
    if (!username) {
      setUsernameError(null);
      setUsernameSuccess(null);
      setUsernameChecking(false);
      return;
    }

    // Valid format validation
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      setUsernameError('3-20 characters, alphanumeric or underscores only');
      setUsernameSuccess(null);
      setUsernameChecking(false);
      return;
    }

    setUsernameError(null);
    setUsernameSuccess(null);
    setUsernameChecking(true);

    const debounceTimer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username)}`);
        const data = await res.json();
        
        if (data.available) {
          setUsernameSuccess('Username is available!');
          setUsernameError(null);
        } else {
          setUsernameError(data.error || 'Username is already taken.');
          setUsernameSuccess(null);
        }
      } catch (err) {
        setUsernameError('Could not verify username availability.');
        setUsernameSuccess(null);
      } finally {
        setUsernameChecking(false);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [username]);

  const handleSignup = async () => {
    setError(null);
    
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      setError('Username must be 3-20 characters long and contain only letters, numbers, or underscores.');
      return;
    }

    if (usernameError) {
      setError(`Username issue: ${usernameError}`);
      return;
    }

    setLoading(true);
    try {
      // 1. Create user inside Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (!signUpData?.user) {
        setError('Verification email was sent or signup failed. Please try again.');
        setLoading(false);
        return;
      }

      // 2. Synchronize profile creation in Prisma database
      const accessToken = signUpData.session?.access_token;
      const profileResponse = await fetch('/api/auth/create-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ username }),
      });

      const profileData = await profileResponse.json();

      if (!profileResponse.ok) {
        setError(profileData.error || 'Supabase account created, but profile synchronization failed.');
        setLoading(false);
        return;
      }

      // 3. Successful path -> navigate to dashboard
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during registration.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black bg-noise flex flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-8 left-8 flex items-center group">
        <span className="font-logo text-2xl font-bold text-white tracking-tighter hover:text-[#d9f95d] transition-colors">&lt;scratch.code&gt;</span>
      </Link>

      <div className="w-full max-w-md bg-[#111111] border border-white/[0.05] rounded-3xl p-8 md:p-10 space-y-8 shadow-2xl relative">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
            Start Learning
          </h1>
          <p className="text-slate-400 text-sm">Create your free account and start coding</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm text-center animate-pulse">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-display font-bold tracking-widest text-slate-500 uppercase">Username</label>
              {usernameChecking && (
                <span className="text-[10px] text-slate-500 flex items-center">
                  <span className="w-2.5 h-2.5 mr-1 border border-slate-500 border-t-transparent rounded-full animate-spin"></span>
                  Checking...
                </span>
              )}
              {!usernameChecking && usernameSuccess && (
                <span className="text-[10px] text-[#d9f95d] font-bold">{usernameSuccess}</span>
              )}
              {!usernameChecking && usernameError && (
                <span className="text-[10px] text-red-400 font-bold">{usernameError}</span>
              )}
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="coder_fresher"
              disabled={loading}
              className={`w-full h-12 px-4 bg-black border rounded-xl text-white placeholder-slate-600 focus:outline-none transition-colors disabled:opacity-50 font-mono text-sm ${
                usernameSuccess
                  ? 'border-[#d9f95d]/50 focus:border-[#d9f95d]'
                  : usernameError
                  ? 'border-red-500/50 focus:border-red-500'
                  : 'border-white/10 focus:border-white/30'
              }`}
            />
          </div>

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
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-display font-bold tracking-widest text-slate-500 uppercase">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              className="w-full h-12 px-4 bg-black border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50 font-mono text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSignup();
              }}
            />
          </div>

          <button
            onClick={handleSignup}
            disabled={loading || !!usernameError || usernameChecking}
            className="w-full h-12 mt-2 bg-white hover:bg-slate-200 disabled:bg-white/10 disabled:text-slate-500 text-black font-display font-bold tracking-wide rounded-xl transition-all flex items-center justify-center cursor-pointer disabled:cursor-not-allowed transform active:scale-95"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                <span>Creating Account...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">Sign Up <ArrowRight className="w-4 h-4" /></span>
            )}
          </button>
        </div>

        <div className="text-center text-sm text-slate-500 pt-6 border-t border-white/[0.05]">
          Already have an account?{' '}
          <Link href="/login" className="text-white hover:text-slate-300 font-bold hover:underline transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
