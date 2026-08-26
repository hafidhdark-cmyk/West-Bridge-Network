'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header, { CATEGORIES } from '@/components/Header';
import { getStoredArticles, fetchArticlesFromSupabase, saveArticleToSupabase, deleteArticleFromSupabase, Article } from '@/lib/newsData';
import { PlusCircle, FileText, CheckCircle2, Lock, ArrowLeft, Radio, Star, Send, Trash2, Upload, ImageIcon, Loader2 } from 'lucide-react';

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
  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setArticles(getStoredArticles());
    fetchArticlesFromSupabase().then((data) => {
      if (data && data.length > 0) setArticles(data);
    });
  }, []);

  // HTML5 Canvas helper to compress large camera photos down to ~100KB under 1200px width
  const compressImageFile = (file: File, maxWidth = 1200, quality = 0.75): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedDataUrl);
          } else {
            resolve(event.target?.result as string);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressingImage(true);
      try {
        const compressed = await compressImageFile(file, 1200, 0.75);
        setImageUrl(compressed);
        setImagePreview(compressed);
      } catch (err) {
        console.error('Image compression failed:', err);
      } finally {
        setIsCompressingImage(false);
      }
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsPublishing(true);

    try {
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
      const updatedList = await fetchArticlesFromSupabase();
      setArticles(updatedList && updatedList.length > 0 ? updatedList : getStoredArticles());
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
    } catch (err) {
      console.error('Publishing error:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleToggleTopStory = async (art: Article) => {
    const updated = { ...art, isTopStory: !art.isTopStory };
    await saveArticleToSupabase(updated);
    const updatedList = await fetchArticlesFromSupabase();
    setArticles(updatedList && updatedList.length > 0 ? updatedList : getStoredArticles());
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
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Live Website</span>
          </Link>
        </div>

        {/* Success Alert Banner */}
        {publishSuccess && (
          <div className="bg-emerald-600 text-white p-4 rounded-2xl flex items-center gap-3 shadow-md animate-fade-in">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <div>
              <h4 className="font-extrabold text-sm">Article Published Successfully!</h4>
              <p className="text-xs text-emerald-100">Your news report is now live globally on West Bridge Network.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Create Article Form (Col 7) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <PlusCircle className="w-5 h-5 text-wbn-blue" />
              <h2 className="font-extrabold text-lg text-wbn-navy">Create & Publish News Article</h2>
            </div>

            <form onSubmit={handlePublish} className="space-y-5">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-wbn-navy uppercase tracking-wider">
                  Article Title / Headline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Federal Government Approves ₦2.5 Trillion Clean Energy Initiative"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-wbn-navy focus:outline-none focus:ring-2 focus:ring-wbn-blue"
                  required
                />
              </div>

              {/* Category Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-wbn-navy uppercase tracking-wider">
                  Select Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-wbn-navy focus:outline-none focus:ring-2 focus:ring-wbn-blue"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Summary / Subdeck */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-wbn-navy uppercase tracking-wider">
                  Executive Summary / Subdeck
                </label>
                <textarea
                  rows={2}
                  placeholder="A concise 1-2 sentence overview of the story..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-wbn-navy focus:outline-none focus:ring-2 focus:ring-wbn-blue"
                />
              </div>

              {/* Full Content Body */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-wbn-navy uppercase tracking-wider">
                  Full Article Body Text <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={10}
                  placeholder="Write or paste your news report body here (separate paragraphs with blank lines)..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-wbn-navy focus:outline-none focus:ring-2 focus:ring-wbn-blue leading-relaxed"
                  required
                />
              </div>

              {/* Feature Image Upload / URL Input */}
              <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <label className="block text-xs font-extrabold text-wbn-navy uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-wbn-blue" />
                  Cover Feature Image (Upload File or Enter Image URL)
                </label>

                {/* Option 1: File Upload */}
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer bg-wbn-navy hover:bg-wbn-blue text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 shadow-sm">
                    {isCompressingImage ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <Upload className="w-4 h-4 text-white" />
                    )}
                    <span>{isCompressingImage ? 'Optimizing Photo...' : 'Upload Photo from Device'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                      disabled={isCompressingImage}
                    />
                  </label>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">or URL</span>
                </div>

                {/* Option 2: Image URL Input */}
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImagePreview(e.target.value);
                  }}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-wbn-navy focus:outline-none focus:ring-2 focus:ring-wbn-blue"
                />

                {/* Image Preview Box */}
                {imagePreview && (
                  <div className="relative w-full h-40 rounded-xl overflow-hidden border border-slate-300 mt-2">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  </div>
                )}
              </div>

              {/* Toggles / Flags */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl cursor-pointer hover:bg-blue-100/60 transition-colors">
                  <input
                    type="checkbox"
                    checked={isTopStory}
                    onChange={(e) => setIsTopStory(e.target.checked)}
                    className="w-4 h-4 text-wbn-blue rounded focus:ring-wbn-blue"
                  />
                  <div className="flex items-center gap-1.5 text-xs font-bold text-wbn-navy">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>Set as Top Story of the Day (Auto-overrides previous top story)</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-xl cursor-pointer hover:bg-red-100/60 transition-colors">
                  <input
                    type="checkbox"
                    checked={isBreaking}
                    onChange={(e) => setIsBreaking(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-950">
                    <Radio className="w-4 h-4 text-red-600 animate-pulse" />
                    <span>Push to Live Breaking Marquee (Expires after 24h)</span>
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPublishing || isCompressingImage}
                className="w-full bg-wbn-navy hover:bg-wbn-blue text-white font-extrabold text-sm py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Publishing Live to Supabase...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Publish Article Live</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Published Articles List (Col 5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-base text-wbn-navy flex items-center gap-2">
                  <FileText className="w-4 h-4 text-wbn-blue" />
                  Live Published Articles ({articles.length})
                </h3>
              </div>

              <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1 no-scrollbar">
                {articles.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-6">No articles currently published.</p>
                ) : (
                  articles.map((art) => (
                    <div key={art.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 group hover:bg-blue-50/40 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-wbn-navy text-white rounded">
                          {art.category}
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap justify-end">
                          <button
                            onClick={() => handleToggleTopStory(art)}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors ${
                              art.isTopStory ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-amber-50'
                            }`}
                          >
                            {art.isTopStory ? '★ Top Story' : '+ Top Story'}
                          </button>

                          <button
                            onClick={() => handleDelete(art.id, art.slug)}
                            disabled={deletingId === art.id}
                            className="text-slate-400 hover:text-red-600 p-1 transition-colors ml-1"
                            title="Delete Article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <Link href={`/news/${art.slug}`} target="_blank">
                        <h4 className="font-bold text-xs text-wbn-navy group-hover:text-wbn-blue line-clamp-2 leading-snug">
                          {art.title}
                        </h4>
                      </Link>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                        <span>{art.publishedAt}</span>
                        <span>{art.views} Reads</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
