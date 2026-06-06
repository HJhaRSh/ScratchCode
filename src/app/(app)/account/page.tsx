'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useUser } from '@/hooks/useUser';
import { User, Mail, Key, LogOut, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AccountPage() {
  const { user, loading, signOut } = useUser();

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/login';
  };

  const handleResetPassword = () => {
    alert('Password reset functionality would be triggered here.');
  };

  return (
    <div className="min-h-screen bg-black bg-noise flex flex-col text-slate-100">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto space-y-8 max-w-4xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.05] pb-10 relative overflow-hidden sm:overflow-visible">
            <div className="absolute -top-20 left-0 w-full sm:w-[500px] h-[250px] bg-indigo-500/5 rounded-[100%] blur-[120px] pointer-events-none" />
            
            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/10 bg-indigo-500/5 px-4 py-1.5 text-[10px] font-mono font-bold tracking-[0.2em] text-indigo-400 uppercase">
                [03] Settings
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.05]">
                Your <span className="text-indigo-400 font-script font-normal italic pr-2">Account</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-md">Manage your profile, security preferences, and active session.</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          ) : !user ? (
            <div className="bg-[#0B1528] border border-white/[0.05] rounded-2xl p-12 text-center space-y-6 max-w-lg mx-auto shadow-2xl">
              <div className="text-4xl">🔒</div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Not Signed In</h3>
                <p className="text-slate-400">Please sign in to view your account details.</p>
              </div>
              <a
                href="/login"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white px-6 font-bold transition-all"
              >
                Sign In
              </a>
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* Account Overview */}
              <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 space-y-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <User className="h-6 w-6 text-indigo-400" />
                  <h2 className="text-xl font-bold text-white tracking-tight">Profile Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                      <Mail className="h-3 w-3" /> Email Address
                    </label>
                    <div className="bg-black bg-noise border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-slate-300">
                      {user.email}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                      <Shield className="h-3 w-3" /> Account ID
                    </label>
                    <div className="bg-black bg-noise border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-slate-500 truncate">
                      {user.id}
                    </div>
                  </div>
                </div>
              </div>

              {/* Security & Authentication */}
              <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 space-y-8 shadow-2xl relative overflow-hidden">
                <div className="absolute bottom-0 left-0 h-32 w-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <Key className="h-6 w-6 text-slate-400" />
                  <h2 className="text-xl font-bold text-white tracking-tight">Security</h2>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-black bg-noise border border-white/5 rounded-2xl p-6">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-200">Password Management</h3>
                    <p className="text-xs text-slate-500">Update your password to keep your account secure.</p>
                  </div>
                  <button
                    onClick={handleResetPassword}
                    className="inline-flex h-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white px-5 font-bold text-sm transition-all shadow-md active:scale-95"
                  >
                    Change Password
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-500/5 backdrop-blur-2xl border border-red-500/20 rounded-3xl p-8 space-y-6 shadow-2xl mt-12">
                <div className="flex items-center gap-3 border-b border-red-500/20 pb-4">
                  <LogOut className="h-6 w-6 text-red-500" />
                  <h2 className="text-xl font-bold text-red-500 tracking-tight">Session</h2>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-200">Log Out</h3>
                    <p className="text-xs text-slate-500">End your current session and sign out of your account.</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-500 hover:bg-red-600 text-white px-6 font-bold shadow-lg shadow-red-500/20 transition-all active:scale-95"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
}
