'use client';

import React from 'react';
import { Trophy, Flame, Award, GraduationCap, Code2 } from 'lucide-react';

export interface CertificateCardProps {
  title: string;
  subtitle: string;
  type: string;
  stat1: { label: string; value: string };
  stat2: { label: string; value: string };
  stat3: { label: string; value: string };
  username: string;
  avatarUrl?: string | null;
  date: string;
  shareToken: string;
  id?: string;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'QUEST_SOLVED': return <Code2 className="h-12 w-12 sm:h-16 sm:w-16" />;
    case 'STREAK_MILESTONE': return <Flame className="h-12 w-12 sm:h-16 sm:w-16" />;
    case 'TRACK_COMPLETE': return <GraduationCap className="h-12 w-12 sm:h-16 sm:w-16" />;
    case 'BADGE_EARNED': return <Award className="h-12 w-12 sm:h-16 sm:w-16" />;
    case 'CHALLENGE_WON': return <Trophy className="h-12 w-12 sm:h-16 sm:w-16" />;
    default: return <Trophy className="h-12 w-12 sm:h-16 sm:w-16" />;
  }
};

export default function CertificateCard({
  title, subtitle, type, stat1, stat2, stat3, username, avatarUrl, date, shareToken, id = "certificate-card-capture"
}: CertificateCardProps) {
  const accent = '#d9f95d'; // Platform lime green
  
  return (
    <div className="relative overflow-hidden w-[1200px] h-[630px] rounded-2xl shrink-0 bg-[#000000]"
         style={{ 
           border: `1px solid rgba(255,255,255,0.05)`,
         }}
         id={id}
    >
      {/* html2canvas lab/oklch parser fix for Tailwind v4 */}
      <style dangerouslySetInnerHTML={{ __html: `
        #${id} * {
          border-color: rgba(255,255,255,0.1);
          outline-color: rgba(255,255,255,0.1);
          text-decoration-color: rgba(255,255,255,0.1);
        }
      `}} />

      {/* Abstract Tech Background */}
      {/* 1. Base Grid */}
      <div className="absolute inset-0 opacity-[0.03]"
           style={{ 
             backgroundImage: 'linear-gradient(to right, #ffffff 1px, rgba(0,0,0,0) 1px), linear-gradient(to bottom, #ffffff 1px, rgba(0,0,0,0) 1px)', 
             backgroundSize: '60px 60px' 
           }} />
           
      {/* 2. Abstract Diagonal Cyber Beams */}
      <div className="absolute inset-0 pointer-events-none"
           style={{
             background: `repeating-linear-gradient(45deg, rgba(0,0,0,0), rgba(0,0,0,0) 120px, rgba(217, 249, 93, 0.03) 120px, rgba(217, 249, 93, 0.03) 122px)`
           }} />
      <div className="absolute inset-0 pointer-events-none"
           style={{
             background: `repeating-linear-gradient(-45deg, rgba(0,0,0,0), rgba(0,0,0,0) 80px, rgba(6, 182, 212, 0.02) 80px, rgba(6, 182, 212, 0.02) 81px)`
           }} />

      {/* 3. Glowing Atmospheric Orbs */}
      <div className="absolute top-[-30%] left-[-15%] w-[70%] h-[70%] rounded-full opacity-[0.15] blur-[120px] pointer-events-none" style={{ background: accent }} />
      <div className="absolute bottom-[-30%] right-[-10%] w-[60%] h-[70%] rounded-full opacity-[0.08] blur-[120px] pointer-events-none" style={{ background: '#06b6d4' }} />
      <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full opacity-[0.05] blur-[80px] pointer-events-none" style={{ background: '#f97316' }} />

      {/* 4. Vignette Shadow Overlay for depth */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, rgba(0,0,0,0) 30%, rgba(0,0,0,0.6) 100%)' }} />

      <div className="absolute inset-0 p-12 flex flex-col justify-between z-10 text-[#ffffff] w-[1200px] h-[630px]">
        
        {/* Top Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-[#111111] flex items-center justify-center border border-[rgba(255,255,255,0.05)] font-black text-2xl" style={{ color: accent }}>
              {'</>'}
            </div>
            <div>
              <div className="font-bold tracking-widest text-lg uppercase" style={{ color: accent }}>ScratchCode</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-[0.2em] text-[#94a3b8] uppercase">
              [01] Official Credential
            </div>
            <div className="text-[rgba(255,255,255,0.3)] text-xs font-mono mt-1">#{shareToken?.toUpperCase() || ''}</div>
          </div>
        </div>

        {/* Center Content */}
        <div className="flex flex-col items-center justify-center text-center space-y-6 mt-auto mb-auto pb-12">
          <div className="p-4 rounded-2xl bg-[#111111] border border-[rgba(255,255,255,0.05)]" style={{ color: accent }}>
            {getIcon(type)}
          </div>
          <div className="space-y-4">
            <h1 className="font-black tracking-tight text-[#ffffff] leading-snug max-w-4xl mx-auto" style={{ fontSize: '64px' }}>
              {title}
            </h1>
            <p className="text-2xl text-[#94a3b8] font-medium tracking-wide">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-6">
          {/* Stats Row */}
          <div className="flex justify-center gap-6 w-full max-w-4xl mx-auto">
            {[stat1, stat2, stat3].map((stat, i) => (
              <div key={i} className="flex-1 bg-[#111111] border border-[rgba(255,255,255,0.05)] rounded-xl p-6 relative overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 left-0 w-full h-1 opacity-80" style={{ background: i === 0 ? accent : i === 1 ? '#06b6d4' : '#f97316' }} />
                <div className="text-xs font-bold font-mono uppercase tracking-[0.1em] text-[#94a3b8] mb-3">{stat?.label}</div>
                <div className="text-3xl font-black text-[#ffffff]">{stat?.value}</div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end pt-6 border-t border-[rgba(255,255,255,0.08)]">
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                <img src={avatarUrl} alt={username} crossOrigin="anonymous" className="h-16 w-16 rounded-full border-2" style={{ borderColor: accent }} />
              ) : (
                <div className="h-16 w-16 rounded-full border-2 bg-[#1e293b] flex items-center justify-center font-black text-xl" style={{ borderColor: accent }}>
                  {username?.substring(0,2).toUpperCase()}
                </div>
              )}
              <div>
                <div className="text-2xl font-black text-[#ffffff] tracking-tight">@{username}</div>
                <div className="text-[#94a3b8] font-mono text-sm tracking-wide mt-1">Achieved on {date}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-full border border-[rgba(255,255,255,0.05)] flex items-center justify-center bg-[#111111]">
                 <Award className="h-5 w-5" style={{ color: accent }} />
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
