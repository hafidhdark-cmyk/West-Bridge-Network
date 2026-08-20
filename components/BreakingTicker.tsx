'use client';

import React from 'react';
import Link from 'next/link';
import { Radio } from 'lucide-react';
import { Article } from '@/lib/newsData';

interface BreakingTickerProps {
  articles: Article[];
}

export default function BreakingTicker({ articles }: BreakingTickerProps) {
  // Filter all articles marked as breaking news by the Admin
  const breakingArticles = articles.filter((a) => a.isBreaking);
  const tickerList = breakingArticles.length > 0 ? breakingArticles : articles.slice(0, 3);

  return (
    <div className="bg-wbn-navy text-white border-y border-slate-800 py-2.5 px-4 sm:px-8 flex items-center gap-3 overflow-hidden shadow-inner">
      {/* Sleek Label (No Red Button) */}
      <div className="flex items-center gap-2 flex-shrink-0 text-xs font-black tracking-wider uppercase text-wbn-cobalt bg-blue-950 px-3 py-1 rounded-lg border border-blue-800">
        <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
        <span>BREAKING</span>
      </div>

      {/* Dynamic Moving Headlines Ticker */}
      <div className="overflow-hidden flex-1 relative">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-xs font-semibold text-slate-200">
          {tickerList.concat(tickerList).map((art, idx) => (
            <Link
              key={`${art.id}-${idx}`}
              href={`/news/${art.slug}`}
              className="hover:text-white hover:underline transition-colors flex items-center gap-2"
            >
              <span>{art.title}</span>
              <span className="text-wbn-blue font-bold">★</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
