'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header, { CATEGORIES } from '@/components/Header';
import BreakingTicker from '@/components/BreakingTicker';
import AdBanner from '@/components/AdBanner';
import { getStoredArticles, Article } from '@/lib/newsData';
import { Clock, Eye, Heart, MessageSquare, TrendingUp, Share2, Shield, Flame } from 'lucide-react';

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    setArticles(getStoredArticles());
  }, []);

  const filteredArticles = activeCategory === 'All'
    ? articles
    : articles.filter((a) => a.category.toLowerCase() === activeCategory.toLowerCase());

  const featuredArticle = articles.find((a) => a.isBreaking) || articles[0];
  const regularArticles = filteredArticles.filter((a) => a.id !== featuredArticle?.id);
  const trendingArticles = [...articles].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col bg-wbn-bg">
      <Header activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
      <BreakingTicker articles={articles} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Category Pill Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          <span className="text-xs font-bold text-wbn-slate uppercase tracking-wider mr-2 flex items-center gap-1">
            <Flame className="w-4 h-4 text-wbn-red" /> Topics:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-wbn-blue text-white shadow'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Hero Featured Story Card */}
        {featuredArticle && activeCategory === 'All' && (
          <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-200 grid grid-cols-1 lg:grid-cols-12 group transition-all hover:shadow-xl">
            <div className="lg:col-span-7 relative min-h-[320px] sm:min-h-[420px] bg-slate-900 overflow-hidden">
              <Image
                src={featuredArticle.imageUrl}
                alt={featuredArticle.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div className="absolute top-4 left-4 bg-wbn-red text-white text-xs font-extrabold uppercase px-3 py-1 rounded-full shadow flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-current" /> FEATURED STORY
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-wbn-cobalt uppercase">
                  <span>{featuredArticle.category}</span>
                  <span>•</span>
                  <span className="text-slate-500">{featuredArticle.publishedAt}</span>
                </div>
                <Link href={`/news/${featuredArticle.slug}`}>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-wbn-navy hover:text-wbn-cobalt transition-colors leading-tight">
                    {featuredArticle.title}
                  </h1>
                </Link>
                <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                  {featuredArticle.summary}
                </p>
              </div>

              {/* Author & Actions Bar */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-wbn-blue">
                    <Image
                      src={featuredArticle.authorAvatar}
                      alt={featuredArticle.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-wbn-navy">{featuredArticle.author}</h4>
                    <p className="text-[11px] text-slate-500">{featuredArticle.authorRole}</p>
                  </div>
                </div>

                <Link
                  href={`/news/${featuredArticle.slug}`}
                  className="bg-wbn-blue hover:bg-wbn-cobalt text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow"
                >
                  Read Full News →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid: Latest News Feed + Right Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main News Feed Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h2 className="text-lg font-extrabold text-wbn-navy tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-6 bg-wbn-blue rounded-full"></span>
                {activeCategory === 'All' ? 'Latest Headlines' : `${activeCategory} News`}
              </h2>
              <span className="text-xs font-medium text-slate-500">
                {regularArticles.length} Stories Available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {regularArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
                >
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-wbn-navy text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow">
                      {article.category}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5 text-wbn-slate" />
                        <span>{article.publishedAt}</span>
                      </div>
                      <Link href={`/news/${article.slug}`}>
                        <h3 className="font-bold text-base text-wbn-navy hover:text-wbn-cobalt transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-slate-400" /> {article.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-rose-500" /> {article.likes}
                        </span>
                      </div>
                      <Link
                        href={`/news/${article.slug}`}
                        className="font-bold text-wbn-blue hover:underline"
                      >
                        Read →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar Column */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Join WhatsApp Channel Widget */}
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white rounded-2xl p-6 shadow-md space-y-4 relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">WBN WhatsApp Channel</h3>
                  <p className="text-xs text-emerald-100">Instant breaking news & videos on your phone</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-emerald-50">
                Join over 50,000+ subscribers receiving instant verified news reports directly in their WhatsApp app.
              </p>
              <a
                href="https://whatsapp.com/channel/0029Va9WjfK4Y9Ifdqw4Mi32"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs py-3 rounded-xl transition-all shadow"
              >
                ⚡ Follow WBN Channel Now
              </a>
            </div>

            {/* Ad Banner Widget */}
            <AdBanner slotType="sidebar" />

            {/* Trending Stories Widget */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
              <h3 className="font-extrabold text-base text-wbn-navy border-b border-slate-100 pb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-wbn-red" /> Trending Stories
              </h3>
              <div className="space-y-4">
                {trendingArticles.map((story, idx) => (
                  <div key={story.id} className="flex items-start gap-3 group">
                    <span className="text-xl font-extrabold text-slate-300 group-hover:text-wbn-blue transition-colors">
                      0{idx + 1}
                    </span>
                    <div className="space-y-1">
                      <Link href={`/news/${story.slug}`}>
                        <h4 className="text-xs font-bold text-wbn-navy group-hover:text-wbn-cobalt transition-colors line-clamp-2 leading-snug">
                          {story.title}
                        </h4>
                      </Link>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span>{story.category}</span>
                        <span>•</span>
                        <span>{story.views} reads</span>
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
      <footer className="bg-wbn-navy text-slate-300 text-xs py-10 mt-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <Image src="/logo.png" alt="WBN" fill className="object-contain" />
              </div>
              <span className="font-extrabold text-white text-lg">west bridge network</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              West Bridge Network (WBN) is a premier digital news platform committed to speed, accuracy, and investigative integrity across West Africa.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 uppercase tracking-wider">News Hubs</h4>
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
            <h4 className="font-bold text-white uppercase tracking-wider">WhatsApp Broadcast</h4>
            <p className="text-slate-400">Get breaking headlines directly on WhatsApp.</p>
            <a
              href="https://whatsapp.com/channel/0029Va9WjfK4Y9Ifdqw4Mi32"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl transition-all"
            >
              Join WhatsApp Channel
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-800 text-center text-slate-500">
          © 2026 West Bridge Network (WBN). All rights reserved.
        </div>
      </footer>
    </div>
  );
}
