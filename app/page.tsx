'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import AdBanner from '@/components/AdBanner';
import Footer from '@/components/Footer';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { fetchArticlesFromSupabase, getStoredArticles, Article } from '@/lib/newsData';
import { 
  Clock, 
  Eye, 
  TrendingUp, 
  Zap, 
  Calendar, 
  ChevronRight, 
  ArrowUpRight,
  RotateCcw,
  Sparkles,
  Radio,
  Search
} from 'lucide-react';

const OFFICIAL_WHATSAPP_LINK = "https://chat.whatsapp.com/FSqZA2tOXbv0luyOPa7iKD?s=cl&p=a&ilr=4";

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = getStoredArticles();
    if (stored && stored.length > 0) {
      setArticles(stored);
    }

    fetchArticlesFromSupabase().then((data) => {
      if (data && data.length > 0) {
        setArticles(data);
      }
    });
  }, []);

  const filteredArticles = articles.filter((a) => {
    const normCategory = activeCategory.trim().toLowerCase();
    const matchesCategory = normCategory === 'home' || normCategory === 'all' || normCategory === 'discover'
      ? true
      : a.category.trim().toLowerCase() === normCategory;

    const matchesSearch = !searchQuery.trim()
      ? true
      : a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const mainLeadStory = articles.find((a) => a.isTopStory === true);
  const sideLatestNews = articles.filter((a) => a.id !== mainLeadStory?.id).slice(0, 3);
  
  const isHomeView = activeCategory === 'Home' || activeCategory === 'Discover' || activeCategory === 'All';
  const regularNews = isHomeView && !searchQuery.trim() && mainLeadStory
    ? filteredArticles.filter((a) => a.id !== mainLeadStory.id)
    : filteredArticles;

  const displayedNews = regularNews.slice(0, visibleCount);
  const trendingReads = [...articles].sort((a, b) => b.views - a.views).slice(0, 5);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]" suppressHydrationWarning>
      <Header 
        activeCategory={activeCategory} 
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        articles={articles}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Active Search Results Bar */}
        {searchQuery.trim() !== '' && (
          <div className="bg-wbn-blue text-white p-4 rounded-2xl flex justify-between items-center text-xs sm:text-sm font-bold shadow-sm">
            <span>Showing search results for: &quot;{searchQuery}&quot; ({filteredArticles.length} found)</span>
            <button 
              onClick={() => setSearchQuery('')}
              className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Newspaper Hero Grid (Visible ONLY when an article has isTopStory === true) */}
        {isMounted && isHomeView && !searchQuery && mainLeadStory && (
          <section className="space-y-4">
            <div className="flex items-center justify-between magazine-rule-dark pb-2">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-wbn-navy flex items-center gap-2">
                <Radio className="w-4 h-4 text-wbn-blue animate-pulse" />
                Top Story of the Day
              </h2>
              <span className="text-xs font-semibold text-wbn-slate flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-wbn-blue" /> Updated live
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Lead Top Story Card (Col 8) */}
              <div className="lg:col-span-8 bg-wbn-navy text-white rounded-3xl overflow-hidden shadow-xl flex flex-col group border border-slate-800">
                <div className="relative w-full h-[280px] sm:h-[360px] md:h-[400px] bg-slate-900 overflow-hidden">
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

                <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-wbn-navy flex-1">
                  <div className="space-y-4">
                    <div className="space-y-2">
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

                    <Link href={`/news/${mainLeadStory.slug}`} className="block pt-1">
                      <h1 className="text-xl sm:text-3xl font-black font-editorial-heading text-white hover:text-slate-200 transition-colors leading-snug">
                        {mainLeadStory.title}
                      </h1>
                    </Link>

                    <p className="text-slate-300 text-xs sm:text-sm line-clamp-3 leading-relaxed pt-1">
                      {mainLeadStory.summary}
                    </p>
                  </div>

                  <div className="pt-5 border-t border-slate-800 flex flex-col items-start gap-4">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-8 h-8 flex-shrink-0">
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

              {/* Latest News Sub-Lead Widget (Col 4) */}
              <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-5 space-y-4 flex flex-col justify-between shadow-sm">
                <h3 className="font-extrabold text-xs text-wbn-slate uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-wbn-blue" />
                  Latest News
                </h3>

                <div className="space-y-4 flex-1">
                  {sideLatestNews.map((sub, idx) => {
                    if (idx === 0) {
                      return (
                        <div key={sub.id} className="pb-4 magazine-rule space-y-3 group">
                          {sub.imageUrl && (
                            <Link href={`/news/${sub.slug}`} className="block relative w-full h-44 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
                              <Image src={sub.imageUrl} alt={sub.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                              <span className="absolute top-2.5 left-2.5 bg-wbn-navy text-white text-[9px] font-extrabold px-2 py-0.5 rounded shadow uppercase">
                                Latest Report
                              </span>
                            </Link>
                          )}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[10px] font-extrabold text-wbn-cobalt uppercase">
                              <span>{sub.category}</span>
                              <span>•</span>
                              <span className="text-slate-400 font-normal">{sub.readTime}</span>
                            </div>
                            <Link href={`/news/${sub.slug}`}>
                              <h4 className="font-extrabold text-sm sm:text-base text-wbn-navy group-hover:text-wbn-cobalt transition-colors line-clamp-2 leading-snug">
                                {sub.title}
                              </h4>
                            </Link>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={sub.id} className={`pb-3 ${idx < sideLatestNews.length - 1 ? 'magazine-rule' : ''} group flex items-start justify-between gap-3`}>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2 text-[10px] font-extrabold text-wbn-cobalt uppercase mb-1">
                            <span className="whitespace-nowrap">{sub.category}</span>
                            <span>•</span>
                            <span className="text-slate-400 font-normal whitespace-nowrap">{sub.readTime}</span>
                          </div>
                          <Link href={`/news/${sub.slug}`}>
                            <h4 className="font-extrabold text-xs sm:text-sm text-wbn-navy group-hover:text-wbn-cobalt transition-colors line-clamp-2 leading-snug">
                              {sub.title}
                            </h4>
                          </Link>
                        </div>

                        {sub.imageUrl && (
                          <Link href={`/news/${sub.slug}`} className="relative w-16 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200">
                            <Image src={sub.imageUrl} alt={sub.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
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
                {searchQuery ? 'Filtered Search Results' : isHomeView ? 'Journalistic News Feed & History Archive' : `${activeCategory} Coverage`}
              </h2>
              <span className="text-xs font-semibold text-slate-500">
                Showing {displayedNews.length} of {regularNews.length} Reports
              </span>
            </div>

            {displayedNews.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
                <Search className="w-8 h-8 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-wbn-navy">
                  No articles published under &quot;{searchQuery || activeCategory}&quot; yet
                </h3>
                <p className="text-xs text-slate-500">
                  Use the Publisher Admin Studio to publish news reports under this category.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('Home');
                  }}
                  className="bg-wbn-blue text-white font-bold text-xs px-4 py-2 rounded-xl mt-2"
                >
                  Return to All Headlines
                </button>
              </div>
            ) : (
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
                        <Link href={`/news/${art.slug}`} className="font-extrabold text-wbn-blue hover:underline flex items-center gap-1 whitespace-nowrap">
                          <span>Read Story</span>
                          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

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
                href={OFFICIAL_WHATSAPP_LINK}
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

      {/* Reusable Interactive Footer */}
      <Footer onSelectCategory={setActiveCategory} />
    </div>
  );
}
