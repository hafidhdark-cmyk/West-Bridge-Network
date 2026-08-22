'use client';

import React, { useEffect } from 'react';
import { Megaphone, ExternalLink } from 'lucide-react';

interface AdBannerProps {
  slotType?: 'header' | 'inline' | 'sidebar' | 'footer';
  adClient?: string;
  adSlot?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdBanner({ 
  slotType = 'inline',
  adClient = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID,
  adSlot
}: AdBannerProps) {

  useEffect(() => {
    if (adClient && adSlot && typeof window !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('Google AdSense load error:', err);
      }
    }
  }, [adClient, adSlot]);

  // Real Google AdSense Script Integration
  if (adClient && adSlot) {
    return (
      <div className="w-full overflow-hidden my-4 text-center">
        <span className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">
          Advertisement
        </span>
        <ins
          className="adsbygoogle block"
          data-ad-client={adClient}
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    );
  }

  // Professional Sponsor & Advertising Banner Placeholder
  return (
    <div className={`w-full rounded-2xl border border-slate-200 p-5 transition-all text-center bg-gradient-to-br from-slate-900 to-wbn-navy text-white shadow-sm flex flex-col items-center justify-between gap-3 ${
      slotType === 'sidebar' ? 'min-h-[250px]' : 'min-h-[120px]'
    }`}>
      <div className="flex items-center gap-2 text-wbn-cobalt text-[10px] font-extrabold uppercase tracking-widest bg-blue-950 px-3 py-1 rounded-full border border-blue-800">
        <Megaphone className="w-3.5 h-3.5 text-wbn-blue animate-pulse" />
        <span>WBN Monetization & Sponsor Network</span>
      </div>

      <div className="space-y-1">
        <h4 className="font-extrabold text-sm sm:text-base font-editorial-heading text-white">
          Reach 50,000+ Active Daily Readers Across West Africa
        </h4>
        <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
          Place your brand, business, or Google AdSense banners directly in front of decision makers and tech leaders.
        </p>
      </div>

      <a
        href="mailto:ads@westbridgenetwork.com?subject=Inquiry%20About%20Ad%20Placement%20on%20WBN"
        className="bg-wbn-blue hover:bg-blue-600 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow flex items-center gap-1.5"
      >
        <span>Advertise With Us</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}
