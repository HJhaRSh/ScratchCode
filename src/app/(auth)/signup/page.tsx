'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

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
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl shadow-emerald-950/10">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
            Start Learning
          </h1>
          <p className="text-slate-400 text-sm">Create your free account and start coding</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg text-sm text-center animate-pulse">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-300">Username</label>
              {usernameChecking && (
                <span className="text-[10px] text-slate-500 flex items-center">
                  <span className="w-2.5 h-2.5 mr-1 border border-slate-500 border-t-transparent rounded-full animate-spin"></span>
                  Checking...
                </span>
              )}
              {!usernameChecking && usernameSuccess && (
                <span className="text-[10px] text-emerald-400 font-semibold">{usernameSuccess}</span>
              )}
              {!usernameChecking && usernameError && (
                <span className="text-[10px] text-rose-400 font-semibold">{usernameError}</span>
              )}
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="coder_fresher"
              disabled={loading}
              className={`w-full h-10 px-3 bg-slate-950 border rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none transition-colors disabled:opacity-50 ${
                usernameSuccess
                  ? 'border-emerald-500/50 focus:border-emerald-500'
                  : usernameError
                  ? 'border-rose-500/50 focus:border-rose-500'
                  : 'border-slate-800 focus:border-cyan-500'
              }`}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={loading}
              className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSignup();
              }}
            />
          </div>

          <button
            onClick={handleSignup}
            disabled={loading || !!usernameError || usernameChecking}
            className="w-full h-10 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 disabled:text-slate-400 text-slate-950 font-bold rounded-lg transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed transform active:scale-98 mt-2"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                <span>Creating Account...</span>
              </span>
            ) : (
              'Sign Up'
            )}
          </button>
        </div>

        <div className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
