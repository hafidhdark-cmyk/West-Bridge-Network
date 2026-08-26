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
  Zap, 
  ChevronRight, 
  ArrowUpRight,
  Sparkles
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
        onSearchChange={(q) => setSearchQuery(q)}
        articles={articles}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Active Category Filter / Search Header Banner */}
        {activeCategory !== 'Home' && activeCategory !== 'Discover' && (
          <div className="bg-wbn-navy text-white p-6 rounded-3xl shadow-sm border border-slate-800 flex items-center justify-between animate-fade-in">
            <div>
              <span className="text-xs text-wbn-cobalt uppercase font-extrabold tracking-widest">
                Category Archive
              </span>
              <h2 className="text-2xl font-black font-editorial-heading">{activeCategory} Coverage</h2>
              <p className="text-xs text-slate-300 mt-1">Showing all latest reports under {activeCategory}</p>
            </div>
            <button
              onClick={() => setActiveCategory('Home')}
              className="bg-slate-800 hover:bg-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition-colors text-white"
            >
              Reset to All News
            </button>
          </div>
        )}

        {searchQuery && (
          <div className="bg-blue-50 border border-blue-200 text-wbn-navy p-4 rounded-2xl flex items-center justify-between">
            <span className="text-xs font-bold">
              Showing search results for: &quot;<span className="text-wbn-blue">{searchQuery}</span>&quot; ({filteredArticles.length} found)
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-wbn-blue font-extrabold hover:underline"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* HERO SECTION: Top Story Lead + Side Latest News */}
        {isHomeView && !searchQuery && mainLeadStory && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Primary Main Lead Story (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-wbn-blue animate-ping" />
                <h3 className="font-extrabold text-xs uppercase tracking-widest text-wbn-navy font-editorial-heading">
                  Top Story of the Day
                </h3>
                <span className="text-slate-400 text-[10px] ml-auto font-medium">Updated live</span>
              </div>

              <Link 
                href={`/news/${mainLeadStory.slug}`}
                className="group relative flex-1 rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-wbn-navy flex flex-col justify-end min-h-[380px] sm:min-h-[480px]"
              >
                <Image
                  src={mainLeadStory.imageUrl}
                  alt={mainLeadStory.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-60"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                <div className="relative z-10 p-5 sm:p-8 space-y-2.5 sm:space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-wbn-blue text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider flex items-center gap-1 shadow-sm">
                      <Zap className="w-3 h-3 fill-current" />
                      Top Story
                    </span>
                    <span className="bg-slate-800/80 backdrop-blur-md text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-md border border-slate-700">
                      {mainLeadStory.category}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-4xl font-black text-white font-editorial-heading leading-tight group-hover:text-blue-200 transition-colors">
                    {mainLeadStory.title}
                  </h2>

                  <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed max-w-3xl">
                    {mainLeadStory.summary}
                  </p>

                  <div className="flex items-center justify-between gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <div className="hidden sm:flex items-center gap-1.5 font-semibold text-white">
                      <Image src="/logo.png" alt="WBN Logo" width={16} height={16} className="rounded-full" />
                      <span>West Bridge Network</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{mainLeadStory.publishedAt}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{mainLeadStory.views} reads</span>
                      </div>
                    </div>

                    <span className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-white/20 transition-all flex items-center gap-1">
                      Read Story
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Side Latest Reports Widget (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 flex-1">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-xs uppercase tracking-widest text-wbn-navy flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-wbn-blue" />
                    Latest News
                  </h3>
                </div>

                <div className="space-y-4">
                  {sideLatestNews.map((story, idx) => (
                    <Link
                      key={story.id}
                      href={`/news/${story.slug}`}
                      className="group flex gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0 items-start"
                    >
                      <div className="relative w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200">
                        <Image
                          src={story.imageUrl}
                          alt={story.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-wbn-navy text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded">
                            LATEST REPORT
                          </span>
                        )}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-wbn-cobalt uppercase">
                          <span>{story.category}</span>
                          <span>•</span>
                          <span className="text-slate-400 font-normal">{story.readTime}</span>
                        </div>
                        <h4 className="font-bold text-xs text-wbn-navy group-hover:text-wbn-blue transition-colors line-clamp-2 leading-snug">
                          {story.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Native Ad Placement */}
              <AdBanner slotType="inline" />
            </div>
          </section>
        )}

        {/* MAIN BODY GRID + SIDEBAR */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Feed Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-black text-xl text-wbn-navy font-editorial-heading flex items-center gap-2">
                {activeCategory === 'Home' || activeCategory === 'Discover' ? (
                  <>
                    <Zap className="w-5 h-5 text-wbn-blue fill-wbn-blue" />
                    <span>Investigative Reports &amp; Headlines</span>
                  </>
                ) : (
                  <span>Latest in {activeCategory}</span>
                )}
              </h3>
              <span className="text-xs font-bold text-slate-400">
                {regularNews.length} Reports Available
              </span>
            </div>

            {displayedNews.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
                <p className="text-slate-500 font-medium text-sm">No stories found matching your criteria.</p>
                <button
                  onClick={() => {
                    setActiveCategory('Home');
                    setSearchQuery('');
                  }}
                  className="bg-wbn-navy text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Reset News Feed
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {displayedNews.map((article) => (
                  <article
                    key={article.id}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col group"
                  >
                    <Link href={`/news/${article.slug}`} className="relative h-48 w-full overflow-hidden block">
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-wbn-navy/90 backdrop-blur-md text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg">
                        {article.category}
                      </span>
                    </Link>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
                          <span>{article.readTime}</span>
                          <span>•</span>
                          <span>{article.publishedAt}</span>
                        </div>

                        <Link href={`/news/${article.slug}`}>
                          <h4 className="font-extrabold text-base text-wbn-navy group-hover:text-wbn-blue transition-colors line-clamp-2 leading-snug font-editorial-heading">
                            {article.title}
                          </h4>
                        </Link>

                        <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                          {article.summary}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{article.views} reads</span>
                        </div>

                        <Link
                          href={`/news/${article.slug}`}
                          className="text-wbn-blue font-extrabold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                        >
                          <span>Full Story</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {displayedNews.length < regularNews.length && (
              <div className="pt-4 text-center">
                <button
                  onClick={handleLoadMore}
                  className="bg-white hover:bg-slate-100 text-wbn-navy font-extrabold text-xs px-8 py-3.5 rounded-2xl border border-slate-300 shadow-sm transition-all inline-flex items-center gap-2"
                >
                  <span>Load More News Stories</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Sidebar Column (4 Cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Official WhatsApp Group Channel Widget */}
            <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-3xl p-6 shadow-md space-y-4">
              <div className="flex items-center gap-2">
                <WhatsAppIcon className="w-6 h-6 text-emerald-300 fill-current" />
                <h4 className="font-extrabold text-sm uppercase tracking-wider font-editorial-heading">
                  WBN WhatsApp Channel
                </h4>
              </div>

              <p className="text-xs text-emerald-100 leading-relaxed">
                Join our official WhatsApp group chat to receive instant breaking alerts and investigative sub-regional news.
              </p>

              <a
                href={OFFICIAL_WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-emerald-900 hover:bg-emerald-50 font-extrabold text-xs px-4 py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 w-full text-center"
              >
                <WhatsAppIcon className="w-4 h-4 text-emerald-700 fill-current" />
                <span>Join Official WhatsApp Group</span>
              </a>
            </div>

            {/* Sidebar Ad Placement */}
            <AdBanner slotType="sidebar" />
          </aside>
        </section>
      </main>

      <Footer onSelectCategory={(cat) => setActiveCategory(cat)} />
    </div>
  );
}
