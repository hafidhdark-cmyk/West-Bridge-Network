'use client';

import React from 'react';
import Link from 'next/link';
import { Article } from '@/lib/newsData';
import { Radio } from 'lucide-react';

interface BreakingTickerProps {
  articles: Article[];
}

export default function BreakingTicker({ articles }: BreakingTickerProps) {
  if (!articles || articles.length === 0) {
    return null;
  }

  // Priority: Articles explicitly marked as Breaking -> Fallback: Latest 5 published articles
  const explicitBreaking = articles.filter((a) => a.isBreaking);
  const displayItems = explicitBreaking.length > 0 ? explicitBreaking : articles.slice(0, 5);

  // Duplicate list to create a seamless infinite marquee loop
  const tickerItems = [...displayItems, ...displayItems, ...displayItems];

  return (
    <div className="sticky top-[56px] lg:top-[92px] z-40 bg-wbn-navy text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center h-10 px-4 sm:px-6 lg:px-8">
        {/* Fixed Left Badge */}
        <div className="flex items-center gap-1.5 bg-wbn-blue text-white px-3 py-1 rounded-lg font-black text-[11px] uppercase tracking-wider flex-shrink-0 z-10 shadow-sm mr-3">
          <Radio className="w-3.5 h-3.5 animate-pulse text-white fill-current" />
          <span>BREAKING</span>
        </div>

        {/* Moving Marquee Ticker */}
        <div className="relative flex-1 overflow-hidden py-1">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-8">
            {tickerItems.map((art, idx) => (
              <Link
                key={`${art.id}-${idx}`}
                href={`/news/${art.slug}`}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-200 hover:text-wbn-cobalt transition-colors"
              >
                <span className="w-1.5 h-1.5 bg-wbn-blue rounded-full"></span>
                <span>{art.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
