'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, UserCheck, MessageSquare, Menu, X, Clock, Zap } from 'lucide-react';

interface HeaderProps {
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export const CATEGORIES = [
  'Home',
  'World',
  'Politics',
  'Business',
  'Tech',
  'Security',
  'Sports',
  'Entertainment',
];

export default function Header({ activeCategory = 'Home', onSelectCategory }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      );
    };
    updateClock();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Utility Bar */}
      <div className="bg-wbn-navy text-white text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="bg-wbn-red px-2 py-0.5 rounded font-extrabold uppercase tracking-wider text-[10px] flex items-center gap-1">
            <Zap className="w-3 h-3 fill-current animate-bounce" /> LIVE WBN NEWS DESK
          </span>
          <span className="hidden md:flex items-center gap-1 text-slate-300 text-[11px] font-medium">
            <Clock className="w-3.5 h-3.5 text-wbn-slate" /> {currentTime || 'Thursday, August 20, 2026'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-300">
          <Link href="/admin" className="hover:text-white flex items-center gap-1 transition-colors text-[11px]">
            <UserCheck className="w-3.5 h-3.5 text-wbn-cobalt" />
            <span>Admin Portal</span>
          </Link>
          <a
            href="https://whatsapp.com/channel/0029Va9WjfK4Y9Ifdqw4Mi32"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-0.5 rounded-full flex items-center gap-1 font-bold transition-colors text-[11px] shadow-sm"
          >
            <MessageSquare className="w-3 h-3 fill-current" />
            <span>Join WhatsApp Channel</span>
          </a>
        </div>
      </div>

      {/* Main Editorial Masthead */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between border-b border-slate-100">
        {/* WBN Emblem Logo & Editorial Masthead Title */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative w-11 h-11 sm:w-14 sm:h-14 flex-shrink-0 transition-transform group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="West Bridge Network Emblem"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-black font-serif-editorial text-wbn-navy leading-none tracking-tight">
              west bridge network
            </span>
            <span className="text-[10px] font-extrabold tracking-widest text-wbn-slate uppercase mt-1">
              Truth • Speed • Reach
            </span>
          </div>
        </Link>

        {/* Quick Search Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSearchModal(true)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-full text-xs font-bold transition-colors"
          >
            <Search className="w-4 h-4 text-wbn-navy" />
            <span className="hidden sm:inline">Search Headlines</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Editorial Category Navigation Bar */}
      <div className="bg-wbn-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory && onSelectCategory(cat)}
              className={`px-5 py-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 uppercase tracking-wider ${
                activeCategory === cat
                  ? 'border-wbn-red text-white bg-slate-800/80 font-black'
                  : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2">
          <div className="font-bold text-xs uppercase tracking-wider text-wbn-slate mb-2">Editorial Sections</div>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory && onSelectCategory(cat);
                  setIsMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg text-xs font-bold ${
                  activeCategory === cat ? 'bg-wbn-blue text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="bg-white w-full max-w-xl rounded-2xl p-4 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-wbn-navy">Search West Bridge Network</h3>
              <button onClick={() => setShowSearchModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search headlines, politics, business, tech news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wbn-blue text-sm"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
