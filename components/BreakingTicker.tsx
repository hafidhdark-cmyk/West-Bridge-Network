'use client';

import React from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';
import { Article } from '@/lib/newsData';

interface TickerProps {
  articles: Article[];
}

export default function BreakingTicker({ articles }: TickerProps) {
  const breakingNews = articles.filter((a) => a.isBreaking || a.category === 'Breaking');
  if (breakingNews.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-wbn-navy via-wbn-blue to-wbn-navy text-white text-xs py-2 px-4 flex items-center overflow-hidden border-b border-blue-900">
      <div className="flex items-center gap-2 bg-wbn-red px-3 py-1 rounded font-bold uppercase tracking-wider text-[11px] flex-shrink-0 shadow-sm">
        <Zap className="w-3.5 h-3.5 fill-current animate-bounce" />
        <span>BREAKING NEWS</span>
      </div>
      <div className="overflow-hidden relative ml-3 w-full">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 font-medium">
          {breakingNews.concat(breakingNews).map((item, idx) => (
            <Link
              key={idx}
              href={`/news/${item.slug}`}
              className="hover:underline hover:text-amber-300 transition-colors flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
