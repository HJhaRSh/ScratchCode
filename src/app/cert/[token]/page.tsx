import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import ClientCertView from '@/components/social/ClientCertView';
import Link from 'next/link';

interface CertPageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata(
  { params }: CertPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${baseUrl}/api/certificates/${resolvedParams.token}`, { cache: 'no-store' });
    if (!res.ok) return { title: 'Certificate Not Found' };
    const cert = await res.json();
    
    return {
      title: `${cert.username}'s Achievement on ScratchCode`,
      description: cert.title,
      openGraph: {
        title: `${cert.username}'s Achievement on ScratchCode`,
        description: cert.title,
        url: `${baseUrl}/cert/${resolvedParams.token}`,
        siteName: 'ScratchCode',
        images: [
          {
            url: `${baseUrl}/api/og/cert?token=${resolvedParams.token}`, // Note: We might not have this API yet, but it's standard
            width: 1200,
            height: 630,
            alt: cert.title,
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${cert.username}'s Achievement on ScratchCode`,
        description: cert.title,
      },
    };
  } catch (e) {
    return { title: 'Certificate' };
  }
}

export default async function CertificatePage({ params }: CertPageProps) {
  const resolvedParams = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  let cert = null;
  try {
    const res = await fetch(`${baseUrl}/api/certificates/${resolvedParams.token}`, { cache: 'no-store' });
    if (!res.ok) notFound();
    cert = await res.json();
  } catch (e) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-noise flex flex-col items-center justify-center p-4 sm:p-8 selection:bg-[#d9f95d] selection:text-black">
      <div className="w-full max-w-5xl space-y-8">
        
        {/* Certificate Display */}
        <ClientCertView cert={cert} />

        {/* CTA Section */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-8 sm:p-12 text-center space-y-6 max-w-3xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#d9f95d]/5 rounded-full blur-[100px] pointer-events-none" />
          
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Want to start your own coding journey?
          </h2>
          <p className="text-slate-400 text-lg">
            Join @{cert.username} and thousands of others mastering programming through interactive challenges on ScratchCode.
          </p>
          
          <div className="pt-4">
            <Link href="/" className="inline-flex h-14 items-center justify-center rounded-xl bg-[#d9f95d] px-8 text-lg font-black text-black shadow-[0_0_20px_rgba(217,249,93,0.3)] hover:bg-[#b8d945] hover:scale-105 transition-all">
              Start Learning for Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
