'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import WhatsAppIcon from './WhatsAppIcon';
import { Menu, X, Search, ChevronRight } from 'lucide-react';

export const CATEGORIES = [
  'Home',
  'Politics',
  'Business',
  'World',
  'Tech',
  'Sports',
  'Entertainment',
  'Opinion',
];

const OFFICIAL_WHATSAPP_LINK = "https://chat.whatsapp.com/FSqZA2tOXbv0luyOPa7iKD?s=cl&p=a&ilr=4";

interface HeaderProps {
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export default function Header({ activeCategory = 'Home', onSelectCategory }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Main Header Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Mobile Hamburger Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-wbn-navy hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Clean Official Logo (No Artificial Double Circle Border) */}
          <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="West Bridge Network"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-base sm:text-lg text-wbn-navy tracking-tight group-hover:text-wbn-blue transition-colors">
                  West Bridge Network
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-wbn-slate tracking-wider mt-0.5">
                  Journalistic Integrity & Speed
                </span>
              </div>
            </Link>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-xl text-wbn-navy hover:bg-slate-100 transition-colors"
              title="Search News Archives"
            >
              <Search className="w-5 h-5 text-wbn-blue" />
            </button>

            {/* Official WhatsApp Group Chat Button */}
            <a
              href={OFFICIAL_WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md"
            >
              <WhatsAppIcon className="w-4 h-4 text-white fill-current" />
              <span>Join our WhatsApp group chat</span>
            </a>
          </div>
        </div>

        {/* Category Navigation Bar (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 py-2 magazine-rule overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory && onSelectCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-wbn-blue text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-wbn-navy'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-6 space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => {
                    if (onSelectCategory) onSelectCategory(cat);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive ? 'bg-wbn-blue text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{cat}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              );
            })}
          </div>

          <a
            href={OFFICIAL_WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-md"
          >
            <WhatsAppIcon className="w-4 h-4 text-white fill-current" />
            <span>Join our WhatsApp group chat</span>
          </a>
        </div>
      )}
    </header>
  );
}
