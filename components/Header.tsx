'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShieldAlert, UserCheck, MessageSquare, ChevronDown, Menu, X } from 'lucide-react';

interface HeaderProps {
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export const CATEGORIES = [
  'All',
  'Breaking',
  'Politics',
  'Business',
  'Security',
  'Education',
  'Tech',
  'Sports',
  'Entertainment',
];

export default function Header({ activeCategory = 'All', onSelectCategory }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Utility Bar */}
      <div className="bg-wbn-navy text-white text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="bg-wbn-red px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px] animate-pulse">
            LIVE WBN NETWORK
          </span>
          <span className="hidden md:inline text-slate-300">
            West Africa's Premier Ecosystem of Information
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-300">
          <Link href="/admin" className="hover:text-white flex items-center gap-1 transition-colors">
            <UserCheck className="w-3.5 h-3.5 text-wbn-cobalt" />
            <span>Admin Portal</span>
          </Link>
          <a
            href="https://whatsapp.com/channel/0029Va9WjfK4Y9Ifdqw4Mi32"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-0.5 rounded-full flex items-center gap-1 font-medium transition-colors text-[11px]"
          >
            <MessageSquare className="w-3 h-3 fill-current" />
            <span>Join WhatsApp Channel</span>
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 transition-transform group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="West Bridge Network Emblem"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-wbn-navy leading-none">
              west bridge network
            </span>
            <span className="text-[10px] font-semibold tracking-widest text-wbn-slate uppercase mt-1">
              Truth • Speed • Reach
            </span>
          </div>
        </Link>

        {/* Desktop Category Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
          {CATEGORIES.slice(0, 7).map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory && onSelectCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-wbn-blue text-white shadow-sm'
                  : 'text-slate-700 hover:text-wbn-blue hover:bg-slate-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSearchModal(true)}
            className="p-2 rounded-full text-slate-600 hover:text-wbn-navy hover:bg-slate-100 transition-colors"
            title="Search News"
          >
            <Search className="w-5 h-5" />
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

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2">
          <div className="font-bold text-xs uppercase tracking-wider text-wbn-slate mb-2">Categories</div>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory && onSelectCategory(cat);
                  setIsMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg text-xs font-medium ${
                  activeCategory === cat ? 'bg-wbn-blue text-white' : 'bg-slate-50 text-slate-700'
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
