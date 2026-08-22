'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header, { CATEGORIES } from '@/components/Header';
import { getStoredArticles, fetchArticlesFromSupabase, saveArticleToSupabase, deleteArticleFromSupabase, Article, formatTimeAgo } from '@/lib/newsData';
import { PlusCircle, FileText, CheckCircle2, Lock, ArrowLeft, Radio, Star, Send, Trash2, Upload, ImageIcon } from 'lucide-react';

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Politics');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isTopStory, setIsTopStory] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setArticles(getStoredArticles());
    fetchArticlesFromSupabase().then((data) => {
      if (data && data.length > 0) setArticles(data);
    });
  }, []);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImageUrl(result);
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsPublishing(true);

    const generatedSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const nowIso = new Date().toISOString();

    const newArticle: Article = {
      id: `wbn-${Date.now()}`,
      title: title.trim(),
      slug: generatedSlug,
      category,
      summary: summary.trim() || title.trim(),
      content: content.trim(),
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
      createdAtRaw: nowIso,
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

    await saveArticleToSupabase(newArticle);
    setArticles([newArticle, ...articles]);
    setIsPublishing(false);
    setPublishSuccess(true);

    // Reset Form
    setTitle('');
    setSummary('');
    setContent('');
    setImageUrl('');
    setImagePreview(null);
    setIsTopStory(false);
    setIsBreaking(false);

    setTimeout(() => {
      setPublishSuccess(false);
    }, 4000);
  };

  const handleDelete = async (id: string, slug: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    setDeletingId(id);
    await deleteArticleFromSupabase(id);
    setArticles(articles.filter((a) => a.id !== id && a.slug !== slug));
    setDeletingId(null);
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
            <p className="text-slate-300 text-xs">Publish, upload photos, and manage reports live in Supabase PostgreSQL</p>
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
                  {CATEGORIES.filter((c) => c.name !== 'Discover').map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dynamic Placement Toggles */}
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

            {/* Direct Image File Upload & Web URL Option */}
            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <label className="block text-xs font-extrabold text-wbn-navy uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-wbn-blue" />
                Feature Image (Direct Upload or Web Link)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* Direct File Input */}
                <div className="space-y-1">
                  <label className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-300 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors text-xs font-bold text-wbn-navy shadow-xs">
                    <Upload className="w-4 h-4 text-wbn-blue" />
                    <span>Upload Image File from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[10px] text-slate-400 text-center">Supports PNG, JPG, WEBP photos</p>
                </div>

                {/* Web Image URL Alternative */}
                <input
                  type="url"
                  placeholder="Or paste image URL (e.g. Unsplash link)"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImagePreview(e.target.value);
                  }}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-wbn-blue"
                />
              </div>

              {/* Image Live Thumbnail Preview */}
              {imagePreview && (
                <div className="relative h-32 w-48 rounded-xl overflow-hidden border border-slate-300 shadow-xs mt-2">
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                </div>
              )}
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
            Manage Published Articles ({articles.length})
          </h3>
          <div className="space-y-3">
            {articles.map((art) => (
              <div
                key={art.id}
                className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs"
              >
                <div className="space-y-1 flex-1 min-w-[240px]">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-wbn-cobalt uppercase">
                    <span>{art.category}</span>
                    <span>•</span>
                    <span className="text-slate-400">{formatTimeAgo(art.createdAtRaw || art.publishedAt)}</span>
                    {art.isTopStory && <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[9px]">Top Story</span>}
                    {art.isBreaking && <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[9px]">Breaking</span>}
                  </div>
                  <h4 className="font-bold text-wbn-navy text-sm line-clamp-1">{art.title}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/news/${art.slug}`}
                    className="bg-white border border-slate-300 hover:bg-slate-100 text-wbn-navy font-bold px-3 py-1.5 rounded-xl transition-all whitespace-nowrap"
                  >
                    View →
                  </Link>

                  <button
                    onClick={() => handleDelete(art.id, art.slug)}
                    disabled={deletingId === art.id}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
                    title="Delete Article"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>{deletingId === art.id ? 'Deleting...' : 'Delete'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
