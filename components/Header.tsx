'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import BreakingTicker from '@/components/BreakingTicker';
import { Article } from '@/lib/newsData';
import {
  Compass,
  Flag,
  Landmark,
  Briefcase,
  Cpu,
  Trophy,
  Film,
  HeartPulse,
  GraduationCap,
  Briefcase as CareerIcon,
  Globe,
  MessageSquareQuote,
  Search,
  Menu,
  X,
  Lock,
} from 'lucide-react';

export interface CategoryItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const CATEGORIES: CategoryItem[] = [
  { name: 'Discover', icon: Compass },
  { name: 'National', icon: Flag },
  { name: 'Politics', icon: Landmark },
  { name: 'Business', icon: Briefcase },
  { name: 'Tech', icon: Cpu },
  { name: 'Sports', icon: Trophy },
  { name: 'Entertainment', icon: Film },
  { name: 'Health', icon: HeartPulse },
  { name: 'Education', icon: GraduationCap },
  { name: 'Career', icon: CareerIcon },
  { name: 'World', icon: Globe },
  { name: 'Opinion', icon: MessageSquareQuote },
];

interface HeaderProps {
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  articles?: Article[];
}

export default function Header({
  activeCategory = 'Discover',
  onSelectCategory,
  searchQuery = '',
  onSearchChange,
  articles = [],
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const pathname = usePathname();

  const isMainHomepage = pathname === '/';

  const handleCategoryClick = (categoryName: string) => {
    if (onSelectCategory) {
      onSelectCategory(categoryName);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-wbn-navy text-white shadow-md border-b border-slate-800">
      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Brand Logo & Text */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 transition-transform group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="West Bridge Network Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base sm:text-xl text-white font-editorial-heading leading-tight tracking-tight">
              west bridge network
            </span>
            <span className="text-[10px] text-wbn-cobalt font-bold tracking-widest uppercase">
              West Africa Bureau
            </span>
          </div>
        </Link>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3">
          {/* Search Button (ONLY VISIBLE ON MAIN HOMEPAGE '/') */}
          {isMainHomepage && (
            <div className="relative">
              {showSearchInput ? (
                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs">
                  <Search className="w-3.5 h-3.5 text-slate-400 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search news stories..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                    className="bg-transparent text-white focus:outline-none w-36 sm:w-48 text-xs font-medium"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setShowSearchInput(false);
                      if (onSearchChange) onSearchChange('');
                    }}
                    className="text-slate-400 hover:text-white ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSearchInput(true)}
                  className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold"
                  title="Search news articles"
                >
                  <Search className="w-4 h-4 text-wbn-blue" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              )}
            </div>
          )}

          {/* Admin Studio Secret Shortcut */}
          <Link
            href="/admin"
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
            title="Publisher Admin Studio"
          >
            <Lock className="w-4 h-4" />
          </Link>

          {/* Mobile Navigation Drawer Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Desktop Categories Navigation Bar */}
      <nav className="hidden lg:block bg-slate-900 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map((cat) => {
              const IconComp = cat.icon;
              const isActive = activeCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <li key={cat.name}>
                  <button
                    onClick={() => handleCategoryClick(cat.name)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-wbn-blue text-white shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-wbn-cobalt'}`} />
                    <span>{cat.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Breaking News Ticker Rendered Directly Inside Header */}
      {articles && articles.length > 0 && <BreakingTicker articles={articles} />}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-4 py-4 space-y-3 animate-fade-in">
          {/* Mobile Search Input (ONLY ON HOMEPAGE) */}
          {isMainHomepage && (
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs">
              <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search headlines..."
                value={searchQuery}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                className="bg-transparent text-white focus:outline-none w-full text-xs font-medium"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-2">
            {CATEGORIES.map((cat) => {
              const IconComp = cat.icon;
              const isActive = activeCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-wbn-blue text-white'
                      : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <IconComp className="w-4 h-4 text-wbn-cobalt" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
