'use client';

import React, { useState, useRef, useEffect } from 'react';
import CertificateCard from './CertificateCard';

export default function ClientCertView({ cert }: { cert: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      setScale(entries[0].contentRect.width / 1200);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#000000] p-2 sm:p-4" ref={containerRef}>
      <div className="relative w-full" style={{ paddingTop: '52.5%' }}>
        <div className="absolute top-0 left-0 origin-top-left" style={{ transform: `scale(${scale})` }}>
          <CertificateCard {...cert} />
        </div>
      </div>
    </div>
  );
}
