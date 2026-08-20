'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import { getStoredArticles, saveArticleToSupabase, Article } from '@/lib/newsData';
import { PlusCircle, FileText, CheckCircle2, Lock, ArrowLeft, Radio, Star, Sparkles, Send } from 'lucide-react';

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Politics');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isTopStory, setIsTopStory] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    setArticles(getStoredArticles());
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsPublishing(true);

    const generatedSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newArticle: Article = {
      id: `wbn-${Date.now()}`,
      title: title.trim(),
      slug: generatedSlug,
      category,
      summary: summary.trim() || title.trim(),
      content: content.trim(),
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
      publishedAt: 'Just now',
      readTime: `${Math.max(2, Math.ceil(content.split(' ').length / 200))} min read`,
      author: 'West Bridge Network',
      authorAvatar: '/logo.png',
      isTopStory,
      isBreaking,
      views: 1,
      likes: 0,
      commentsCount: 0,
    };

    const saved = await saveArticleToSupabase(newArticle);
    setArticles([newArticle, ...articles]);
    setIsPublishing(false);
    setPublishSuccess(true);

    // Reset Form
    setTitle('');
    setSummary('');
    setContent('');
    setImageUrl('');
    setIsTopStory(false);
    setIsBreaking(false);

    setTimeout(() => {
      setPublishSuccess(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-wbn-bg">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-wbn-navy text-white p-6 rounded-3xl shadow-lg border border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-wbn-cobalt uppercase font-extrabold tracking-wider">
              <Lock className="w-4 h-4 text-blue-400" />
              <span>West Bridge Network Editorial Suite</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-editorial-heading">Publisher Admin Studio</h1>
            <p className="text-slate-300 text-xs">Publish reports directly into PostgreSQL live on Vercel</p>
          </div>

          <Link
            href="/"
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Live Site</span>
          </Link>
        </div>

        {/* Publish Success Alert Banner */}
        {publishSuccess && (
          <div className="bg-emerald-950 border border-emerald-800 text-emerald-200 p-4 rounded-2xl flex items-center gap-3 animate-fade-in shadow-md">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <h4 className="font-extrabold text-sm text-emerald-100">Article Published Successfully!</h4>
              <p className="text-xs text-emerald-300">Your report has been saved into PostgreSQL and is live for readers.</p>
            </div>
          </div>
        )}

        {/* Main Publishing Form */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-wbn-navy magazine-rule-dark pb-3 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-wbn-blue" />
            Publish New News Article
          </h2>

          <form onSubmit={handlePublish} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Headline Title */}
              <div className="md:col-span-8 space-y-2">
                <label className="block text-xs font-extrabold text-wbn-navy uppercase tracking-wider">
                  Article Headline Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., FG Releases Breakdown of Fuel Subsidy Savings Allocation"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-wbn-blue"
                  required
                />
              </div>

              {/* Category Dropdown */}
              <div className="md:col-span-4 space-y-2">
                <label className="block text-xs font-extrabold text-wbn-navy uppercase tracking-wider">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-wbn-blue"
                >
                  <option value="Politics">Politics</option>
                  <option value="Business">Business</option>
                  <option value="World">World</option>
                  <option value="Tech">Tech</option>
                  <option value="Sports">Sports</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Opinion">Opinion</option>
                </select>
              </div>
            </div>

            {/* Dynamic Placement Toggles (Top Story & Breaking Marquee) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <label className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-white transition-colors">
                <input
                  type="checkbox"
                  checked={isTopStory}
                  onChange={(e) => setIsTopStory(e.target.checked)}
                  className="w-4 h-4 text-wbn-blue rounded focus:ring-wbn-blue"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-extrabold text-wbn-navy flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                    Set as Top Story of the Day
                  </span>
                  <p className="text-[11px] text-slate-500">Puts this report on the main Lead Hero Card on homepage</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-white transition-colors">
                <input
                  type="checkbox"
                  checked={isBreaking}
                  onChange={(e) => setIsBreaking(e.target.checked)}
                  className="w-4 h-4 text-wbn-blue rounded focus:ring-wbn-blue"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-extrabold text-wbn-navy flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-wbn-blue animate-pulse" />
                    Push to Live Moving Breaking Marquee
                  </span>
                  <p className="text-[11px] text-slate-500">Headline will loop across the top breaking news banner</p>
                </div>
              </label>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-wbn-navy uppercase tracking-wider">
                Feature Image URL (Unsplash or Image Link)
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-wbn-blue"
              />
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-wbn-navy uppercase tracking-wider">
                Executive Summary / Deck Line
              </label>
              <input
                type="text"
                placeholder="Brief 1-2 sentence overview of the news report"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-wbn-blue"
              />
            </div>

            {/* Main Content Body */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-wbn-navy uppercase tracking-wider">
                Full Article Content Body *
              </label>
              <textarea
                rows={10}
                placeholder="Write the complete news article text here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-wbn-blue"
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPublishing}
              className="w-full bg-wbn-navy hover:bg-wbn-blue text-white font-extrabold text-sm py-4 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isPublishing ? (
                <span>Saving to Supabase Database...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Publish Article Live</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Recently Published Articles List */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
          <h3 className="font-extrabold text-base text-wbn-navy magazine-rule-dark pb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-wbn-blue" />
            Recently Published Articles ({articles.length})
          </h3>
          <div className="space-y-3">
            {articles.map((art) => (
              <div
                key={art.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-wbn-cobalt uppercase">
                    <span>{art.category}</span>
                    <span>•</span>
                    <span className="text-slate-400">{art.publishedAt}</span>
                    {art.isTopStory && <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[9px]">Top Story</span>}
                    {art.isBreaking && <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[9px]">Breaking</span>}
                  </div>
                  <h4 className="font-bold text-wbn-navy text-sm line-clamp-1">{art.title}</h4>
                </div>
                <Link
                  href={`/news/${art.slug}`}
                  className="bg-white border border-slate-300 hover:bg-slate-100 text-wbn-navy font-bold px-3 py-1.5 rounded-xl transition-all whitespace-nowrap"
                >
                  View Article →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
