'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import WhatsAppIcon from './WhatsAppIcon';
import { 
  Menu, 
  X, 
  Search, 
  ChevronRight,
  Compass,
  Newspaper,
  Film,
  Trophy,
  HeartPulse,
  Laptop,
  Rocket,
  GraduationCap,
  Briefcase,
  Globe,
  MessageSquareText
} from 'lucide-react';

export const CATEGORIES = [
  { name: 'Discover', icon: Compass },
  { name: 'Politics', icon: Newspaper },
  { name: 'Business', icon: Briefcase },
  { name: 'Tech', icon: Laptop },
  { name: 'Sports', icon: Trophy },
  { name: 'Entertainment', icon: Film },
  { name: 'Health', icon: HeartPulse },
  { name: 'Education', icon: GraduationCap },
  { name: 'Career', icon: Rocket },
  { name: 'World', icon: Globe },
  { name: 'Opinion', icon: MessageSquareText },
];

const OFFICIAL_WHATSAPP_LINK = "https://chat.whatsapp.com/FSqZA2tOXbv0luyOPa7iKD?s=cl&p=a&ilr=4";

interface HeaderProps {
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function Header({ 
  activeCategory = 'Discover', 
  onSelectCategory,
  searchQuery = '',
  onSearchChange
}: HeaderProps) {
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

          {/* Clean Official Logo */}
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
              className={`p-2.5 rounded-xl transition-colors ${
                searchOpen ? 'bg-wbn-blue text-white' : 'text-wbn-navy hover:bg-slate-100'
              }`}
              title="Search News Archives"
            >
              <Search className="w-5 h-5" />
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

        {/* Live Search Bar Dropdown */}
        {searchOpen && (
          <div className="py-3 px-4 magazine-rule bg-slate-50 border-t border-slate-200 animate-fade-in flex items-center gap-3">
            <Search className="w-4 h-4 text-wbn-blue flex-shrink-0" />
            <input
              type="text"
              placeholder="Search news by keyword (e.g. Tinubu, Forex, Tech, Health, Education, Sports)..."
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-wbn-navy focus:outline-none placeholder:text-slate-400"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange && onSearchChange('')}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Category Navigation Bar (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 py-2 magazine-rule overflow-x-auto no-scrollbar">
          {CATEGORIES.map((catObj) => {
            const cat = catObj.name;
            const Icon = catObj.icon;
            const isActive = activeCategory.toLowerCase() === cat.toLowerCase() || (activeCategory === 'Home' && cat === 'Discover');
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory && onSelectCategory(cat === 'Discover' ? 'Home' : cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-wbn-blue text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-wbn-navy'
                }`}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{cat}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Intel Region Style Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-6 space-y-4 animate-fade-in">
          <div className="space-y-1 divide-y divide-slate-100">
            {CATEGORIES.map((catObj) => {
              const cat = catObj.name;
              const Icon = catObj.icon;
              const isActive = activeCategory.toLowerCase() === cat.toLowerCase() || (activeCategory === 'Home' && cat === 'Discover');
              return (
                <button
                  key={cat}
                  onClick={() => {
                    if (onSelectCategory) onSelectCategory(cat === 'Discover' ? 'Home' : cat);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive ? 'bg-emerald-50 text-emerald-800 border-l-4 border-emerald-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-700' : 'text-slate-500'}`} />
                    <span>{cat}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>
              );
            })}
          </div>

          <a
            href={OFFICIAL_WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-md mt-4"
          >
            <WhatsAppIcon className="w-4 h-4 text-white fill-current" />
            <span>Join our WhatsApp group chat</span>
          </a>
        </div>
      )}
    </header>
  );
}
