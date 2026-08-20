'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header, { CATEGORIES } from '@/components/Header';
import BreakingTicker from '@/components/BreakingTicker';
import AdBanner from '@/components/AdBanner';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { getStoredArticles, Article } from '@/lib/newsData';
import { 
  Clock, 
  Eye, 
  Heart, 
  TrendingUp, 
  Zap, 
  Calendar, 
  ChevronRight, 
  ArrowUpRight,
  RotateCcw,
  Sparkles,
  Radio,
  Lock
} from 'lucide-react';

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Home');
  const [visibleCount, setVisibleCount] = useState<number>(6);

  useEffect(() => {
    setArticles(getStoredArticles());
  }, []);

  const filteredArticles = activeCategory === 'Home' || activeCategory === 'All'
    ? articles
    : articles.filter((a) => a.category.toLowerCase() === activeCategory.toLowerCase());

  // Dynamic Lead Top Story of the Day (Selected by Admin)
  const mainLeadStory = articles.find((a) => a.isBreaking) || articles[0];
  const sideSubLeads = articles.filter((a) => a.id !== mainLeadStory?.id).slice(0, 3);
  const regularNews = filteredArticles.filter((a) => a.id !== mainLeadStory?.id);
  const displayedNews = regularNews.slice(0, visibleCount);
  const trendingReads = [...articles].sort((a, b) => b.views - a.views).slice(0, 5);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      <Header activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
      <BreakingTicker articles={articles} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Newspaper Hero Grid */}
        {activeCategory === 'Home' && mainLeadStory && (
          <section className="space-y-4">
            <div className="flex items-center justify-between magazine-rule-dark pb-2">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-wbn-navy flex items-center gap-2">
                <Radio className="w-4 h-4 text-wbn-blue animate-pulse" />
                Top Headlines
              </h2>
              <span className="text-xs font-semibold text-wbn-slate flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-wbn-blue" /> Updated live
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Lead Top Story Card (Col 8) */}
              <div className="lg:col-span-8 bg-wbn-navy text-white rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-12 group border border-slate-800">
                <div className="md:col-span-7 relative min-h-[280px] sm:min-h-[420px] bg-slate-900 overflow-hidden">
                  <Image
                    src={mainLeadStory.imageUrl}
                    alt={mainLeadStory.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-wbn-navy via-wbn-navy/40 to-transparent"></div>
                  <span className="absolute top-4 left-4 bg-wbn-blue text-white text-[11px] font-black uppercase px-3 py-1 rounded shadow flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-current" /> TOP STORY
                  </span>
                </div>

                <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-wbn-navy">
                  <div className="space-y-5">
                    {/* Category Pill & Date Timestamp */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3">
                        <span className="text-wbn-cobalt bg-blue-950 px-3 py-1 rounded text-[11px] font-extrabold uppercase tracking-wider border border-blue-800 whitespace-nowrap">
                          {mainLeadStory.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium whitespace-nowrap pt-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{mainLeadStory.publishedAt}</span>
                      </div>
                    </div>

                    {/* Headline Title */}
                    <Link href={`/news/${mainLeadStory.slug}`} className="block pt-1">
                      <h1 className="text-xl sm:text-2xl font-black font-editorial-heading text-white hover:text-slate-200 transition-colors leading-snug">
                        {mainLeadStory.title}
                      </h1>
                    </Link>

                    {/* Summary Paragraph */}
                    <p className="text-slate-300 text-xs sm:text-sm line-clamp-3 leading-relaxed pt-1">
                      {mainLeadStory.summary}
                    </p>
                  </div>

                  {/* Clean Column Stack Layout: Read Story sits UNDER West Bridge Network */}
                  <div className="pt-5 border-t border-slate-800 flex flex-col items-start gap-4">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-600 p-0.5 bg-white flex-shrink-0">
                        <Image src="/logo.png" alt="West Bridge Network" fill className="object-contain" />
                      </div>
                      <span className="text-xs font-extrabold text-slate-200 whitespace-nowrap">West Bridge Network</span>
                    </div>

                    <Link
                      href={`/news/${mainLeadStory.slug}`}
                      className="bg-wbn-blue hover:bg-blue-600 text-white font-extrabold text-xs md:text-sm px-6 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto"
                    >
                      <span>Read Story</span>
                      <ArrowUpRight className="w-4 h-4 flex-shrink-0" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Stacked Sub-Lead Stories (Col 4) */}
              <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-5 space-y-4 flex flex-col justify-between shadow-sm">
                <h3 className="font-extrabold text-xs text-wbn-slate uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-wbn-blue" />
                  Top Priority Reports
                </h3>
                {sideSubLeads.map((sub, idx) => (
                  <div key={sub.id} className={`pb-3 ${idx < sideSubLeads.length - 1 ? 'magazine-rule' : ''} group`}>
                    <div className="flex items-center gap-2 text-[10px] font-extrabold text-wbn-cobalt uppercase mb-1">
                      <span className="whitespace-nowrap">{sub.category}</span>
                      <span>•</span>
                      <span className="text-slate-400 font-normal whitespace-nowrap">{sub.readTime}</span>
                    </div>
                    <Link href={`/news/${sub.slug}`}>
                      <h4 className="font-extrabold text-sm text-wbn-navy group-hover:text-wbn-cobalt transition-colors line-clamp-2 leading-snug">
                        {sub.title}
                      </h4>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Magazine Grid Feed + Right Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Editorial Articles Feed (Col 8) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex justify-between items-center magazine-rule-dark pb-2">
              <h2 className="text-base font-extrabold text-wbn-navy uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-5 bg-wbn-blue rounded-full"></span>
                {activeCategory === 'Home' ? 'Journalistic News Feed & History Archive' : `${activeCategory} Coverage`}
              </h2>
              <span className="text-xs font-semibold text-slate-500">
                Showing {displayedNews.length} of {regularNews.length} Reports
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {displayedNews.map((art) => (
                <article
                  key={art.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group bbc-card-hover"
                >
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <Image
                      src={art.imageUrl}
                      alt={art.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-wbn-navy text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded shadow">
                      {art.category}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium whitespace-nowrap">
                        <Clock className="w-3.5 h-3.5 text-wbn-slate" />
                        <span>{art.publishedAt}</span>
                      </div>
                      <Link href={`/news/${art.slug}`}>
                        <h3 className="font-extrabold font-editorial-heading text-base text-wbn-navy hover:text-wbn-cobalt transition-colors line-clamp-2 leading-snug">
                          {art.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {art.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 font-semibold text-slate-600" title="Real-time reader count">
                          <Eye className="w-3.5 h-3.5 text-wbn-blue" /> {art.views} Reads
                        </span>
                      </div>
                      {/* Single-line "Read Story →" Text Link */}
                      <Link href={`/news/${art.slug}`} className="font-extrabold text-wbn-blue hover:underline flex items-center gap-1 whitespace-nowrap">
                        <span>Read Story</span>
                        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More News Reports */}
            {visibleCount < regularNews.length && (
              <div className="text-center pt-4">
                <button
                  onClick={handleLoadMore}
                  className="bg-wbn-navy hover:bg-wbn-blue text-white font-extrabold text-xs px-8 py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 mx-auto"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Load Previous News Reports & Past Archives</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar (Col 4) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* WBN WhatsApp Group Chat Box */}
            <div className="bg-emerald-700 text-white rounded-3xl p-6 shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <WhatsAppIcon className="w-6 h-6 text-white fill-current" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Join our WhatsApp group chat</h3>
                  <p className="text-xs text-emerald-100">Breaking news delivered directly to your phone</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-emerald-50">
                Get instant breaking news updates delivered directly to your WhatsApp.
              </p>
              <a
                href="https://chat.whatsapp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-white text-emerald-800 hover:bg-emerald-50 font-black text-xs py-3 rounded-xl transition-all shadow flex items-center justify-center gap-2"
              >
                <WhatsAppIcon className="w-4 h-4 text-emerald-800 fill-current" />
                <span>Join our WhatsApp group chat</span>
              </a>
            </div>

            {/* Ad Banner Widget */}
            <AdBanner slotType="sidebar" />

            {/* Top Read Stories Sidebar Widget */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <h3 className="font-extrabold text-sm text-wbn-navy magazine-rule-dark pb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-wbn-blue" /> Top 5 Trending Reports
              </h3>
              <div className="space-y-4">
                {trendingReads.map((t, idx) => (
                  <div key={t.id} className="flex items-start gap-3 group">
                    <span className="text-2xl font-black font-editorial-heading text-slate-300 group-hover:text-wbn-blue transition-colors">
                      0{idx + 1}
                    </span>
                    <div className="space-y-1">
                      <Link href={`/news/${t.slug}`}>
                        <h4 className="text-xs font-extrabold text-wbn-navy group-hover:text-wbn-cobalt transition-colors line-clamp-2 leading-snug">
                          {t.title}
                        </h4>
                      </Link>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                        <span>{t.category}</span>
                        <span>•</span>
                        <span>{t.views} views</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-wbn-navy text-slate-300 text-xs py-12 mt-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8">
                <Image src="/logo.png" alt="WBN" fill className="object-contain" />
              </div>
              <span className="font-black text-white text-lg font-editorial-heading">west bridge network</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              West Bridge Network (WBN) is a premier digital news platform committed to speed, accuracy, and investigative integrity across West Africa.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 uppercase tracking-wider">Editorial Hubs</h4>
            <ul className="space-y-2">
              {CATEGORIES.slice(1, 6).map((c) => (
                <li key={c}>
                  <button onClick={() => setActiveCategory(c)} className="hover:text-white transition-colors">
                    {c} News
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 uppercase tracking-wider">Legal & Contact</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-white">Editorial Guidelines</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Advertise With Us</a></li>
              <li><a href="#" className="hover:text-white">Contact News Bureau</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider">WhatsApp Group Chat</h4>
            <p className="text-slate-400">Get breaking headlines directly on WhatsApp.</p>
            <a
              href="https://chat.whatsapp.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl transition-all shadow flex items-center gap-2 justify-center"
            >
              <WhatsAppIcon className="w-4 h-4 text-white fill-current" />
              <span>Join our WhatsApp group chat</span>
            </a>
          </div>
        </div>

        {/* Bottom Footer Bar with Secret Publisher Admin Studio Link */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-800 flex flex-wrap justify-between items-center gap-4 text-slate-500">
          <div>© 2026 West Bridge Network (WBN). All rights reserved.</div>
          <Link href="/admin" className="text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1 text-[11px]">
            <Lock className="w-3 h-3" />
            <span>Publisher Admin Studio</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
