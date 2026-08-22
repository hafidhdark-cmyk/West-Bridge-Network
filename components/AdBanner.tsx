'use client';

import React, { useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';

const ADVERTISE_WHATSAPP_LINK = "https://wa.me/2348140097546?text=Hello%20West%20Bridge%20Network,%20I%20would%20like%20to%20inquire%20about%20advertising%20on%20WBN.";

interface AdBannerProps {
  slotType?: 'header' | 'inline' | 'sidebar' | 'footer' | 'article-inline';
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

  // Clean Native Sponsored Ad Placement Linking to WhatsApp 08140097546
  return (
    <div className={`w-full rounded-2xl border border-slate-200 p-5 transition-all text-center bg-white text-slate-800 shadow-xs flex flex-col items-center justify-between gap-3 ${
      slotType === 'sidebar' ? 'min-h-[240px]' : 'min-h-[100px]'
    }`}>
      <div className="flex items-center gap-2 text-slate-400 text-[9px] font-extrabold uppercase tracking-widest bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
        <span>SPONSORED</span>
      </div>

      <div className="space-y-1">
        <h4 className="font-extrabold text-xs sm:text-sm font-editorial-heading text-wbn-navy">
          Special Feature & Corporate Partnerships
        </h4>
        <p className="text-[11px] text-slate-500 max-w-md mx-auto leading-relaxed">
          Connect your organization with top executives, policymakers, and business leaders across West Africa.
        </p>
      </div>

      <a
        href={ADVERTISE_WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
      >
        <WhatsAppIcon className="w-3.5 h-3.5 text-white fill-current" />
        <span>Advertise With Us</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}
