'use client';

import React from 'react';
import { Tag } from 'lucide-react';

interface AdBannerProps {
  slotType?: 'header' | 'sidebar' | 'in-feed';
}

export default function AdBanner({ slotType = 'sidebar' }: AdBannerProps) {
  if (slotType === 'sidebar') {
    return (
      <div className="bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 rounded-2xl p-6 text-center space-y-3 relative overflow-hidden shadow-inner">
        <div className="absolute top-2 right-2 bg-slate-300/80 text-slate-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
          SPONSORED AD
        </div>
        <div className="w-12 h-12 bg-wbn-blue/10 text-wbn-blue rounded-full flex items-center justify-center mx-auto">
          <Tag className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-slate-800 text-sm">Ad Space / Google AdSense</h4>
        <p className="text-xs text-slate-600">
          Monetize WBN traffic with Google AdSense, Taboola, or direct sponsor banners.
        </p>
        <button className="bg-wbn-blue hover:bg-wbn-cobalt text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow">
          Advertise With WBN
        </button>
      </div>
    );
  }

  return (
    <div className="my-6 bg-slate-100 border border-slate-300 rounded-xl p-4 text-center text-xs text-slate-500 flex items-center justify-between">
      <span className="font-semibold text-slate-700">SPONSORED BANNER PLACEHOLDER</span>
      <span className="text-[10px] bg-slate-200 px-2 py-1 rounded uppercase">AdSense 728x90</span>
    </div>
  );
}
