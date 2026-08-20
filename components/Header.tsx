'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Menu, X, ChevronRight } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';

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

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      {/* Main Editorial Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
        {/* WBN Emblem Logo & Editorial Masthead Title */}
        <Link href="/" className="flex items-center gap-3 sm:gap-4 group">
          <div className="relative w-9 h-9 sm:w-12 sm:h-12 flex-shrink-0 transition-transform group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="West Bridge Network Emblem"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-2xl font-black font-serif-editorial text-wbn-navy leading-none tracking-tight">
              west bridge network
            </span>
            <span className="text-[9px] sm:text-[10px] font-extrabold tracking-widest text-wbn-slate uppercase mt-1">
              Truth • Speed • Reach
            </span>
          </div>
        </Link>

        {/* Quick Search & Mobile Drawer Trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowSearchModal(true)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 sm:px-4 py-2 rounded-full text-xs font-bold transition-colors"
          >
            <Search className="w-4 h-4 text-wbn-navy" />
            <span className="hidden sm:inline">Search Headlines</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X className="w-6 h-6 text-wbn-navy" /> : <Menu className="w-6 h-6 text-wbn-navy" />}
          </button>
        </div>
      </div>

      {/* Editorial Category Navigation Bar (Blue & Gray Theme) */}
      <div className="bg-wbn-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory && onSelectCategory(cat)}
              className={`px-4 sm:px-5 py-2.5 sm:py-3 text-[11px] sm:text-xs font-extrabold whitespace-nowrap transition-all border-b-2 uppercase tracking-wider ${
                activeCategory === cat
                  ? 'border-wbn-blue text-white bg-slate-800/90 font-black'
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
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-5 space-y-4 shadow-xl">
          <div className="font-extrabold text-xs uppercase tracking-wider text-wbn-slate border-b pb-2">
            Editorial Sections
          </div>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory && onSelectCategory(cat);
                  setIsMenuOpen(false);
                }}
                className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                  activeCategory === cat
                    ? 'bg-wbn-blue text-white shadow-sm'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{cat}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <a
              href="https://chat.whatsapp.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow"
            >
              <WhatsAppIcon className="w-4 h-4 text-white fill-current" />
              <span>Join our WhatsApp group chat</span>
            </a>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4">
          <div className="bg-white w-full max-w-xl rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-wbn-navy text-sm">Search West Bridge Network</h3>
              <button onClick={() => setShowSearchModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search headlines, politics, business, tech news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-wbn-blue text-sm"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
