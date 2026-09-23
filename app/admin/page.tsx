'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header, { CATEGORIES } from '@/components/Header';
import { fetchArticlesFromSupabase, saveArticleToSupabase, deleteArticleFromSupabase, Article, GalleryImage } from '@/lib/newsData';
import { 
  PlusCircle, FileText, CheckCircle2, Lock, ArrowLeft, Radio, Star, Send, 
  Trash2, Upload, ImageIcon, Loader2, LogOut, Video, Plus, X, Layers, AlertCircle, Share2
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();

  const [articles, setArticles] = useState<Article[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Politics');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  
  // Photo 1 (Main Primary)
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCompressingImage, setIsCompressingImage] = useState(false);

  // Photo 2 (Optional Main Secondary for WhatsApp Dual-Photo Preview)
  const [enableSecondImage, setEnableSecondImage] = useState(false);
  const [secondImageUrl, setSecondImageUrl] = useState('');
  const [secondImagePreview, setSecondImagePreview] = useState<string | null>(null);
  const [isCompressingSecondImage, setIsCompressingSecondImage] = useState(false);

  // Additional Story Photos (Gallery with Captions)
  const [additionalImages, setAdditionalImages] = useState<GalleryImage[]>([]);
  const [compressingGalleryIdx, setCompressingGalleryIdx] = useState<number | null>(null);

  // Optional Video at End of Article
  const [videoUrl, setVideoUrl] = useState('');
  const [xPostUrl, setXPostUrl] = useState('');

  // Toggles & Flags
  const [isTopStory, setIsTopStory] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isLoadingArticles, setIsLoadingArticles] = useState<boolean>(true);

  const loadLatestArticles = async () => {
    setIsLoadingArticles(true);
    try {
      const data = await fetchArticlesFromSupabase();
      setArticles(data || []);
    } catch (err) {
      console.error('Error fetching admin articles:', err);
    } finally {
      setIsLoadingArticles(false);
    }
  };

  useEffect(() => {
    loadLatestArticles();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (e) {
      // Ignore network errors on logout
    }
    router.push('/admin/login');
    router.refresh();
  };

  // HTML5 Canvas helper to compress large camera photos down to ~30KB under 800px width
  const compressImageFile = (file: File, maxWidth = 800, quality = 0.6): Promise<string> => {
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

  // Main Image 1 change
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressingImage(true);
      try {
        const compressed = await compressImageFile(file, 800, 0.6);
        setImageUrl(compressed);
        setImagePreview(compressed);
      } catch (err) {
        console.error('Image compression failed:', err);
      } finally {
        setIsCompressingImage(false);
      }
    }
  };

  // Main Image 2 change (for WhatsApp Dual-Photo Preview)
  const handleSecondImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressingSecondImage(true);
      try {
        const compressed = await compressImageFile(file, 800, 0.6);
        setSecondImageUrl(compressed);
        setSecondImagePreview(compressed);
      } catch (err) {
        console.error('Second image compression failed:', err);
      } finally {
        setIsCompressingSecondImage(false);
      }
    }
  };

  // Additional Story Photos Gallery handlers
  const handleAddGalleryPhoto = () => {
    setAdditionalImages((prev) => [...prev, { url: '', caption: '' }]);
  };

  const handleRemoveGalleryPhoto = (index: number) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGalleryFieldChange = (index: number, field: 'url' | 'caption', value: string) => {
    setAdditionalImages((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleGalleryFileChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCompressingGalleryIdx(index);
      try {
        const compressed = await compressImageFile(file, 800, 0.6);
        handleGalleryFieldChange(index, 'url', compressed);
      } catch (err) {
        console.error('Gallery image compression failed:', err);
      } finally {
        setCompressingGalleryIdx(null);
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

      // Clean gallery images list: only keep items with non-empty URL
      const validGalleryImages = additionalImages.filter(img => img.url && img.url.trim().length > 0);

      const newArticle: Article = {
        id: `wbn-${Date.now()}`,
        title: title.trim(),
        slug: generatedSlug,
        category,
        summary: summary.trim() || title.trim(),
        content: content.trim(),
        imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
        secondImageUrl: enableSecondImage && secondImageUrl.trim() ? secondImageUrl.trim() : undefined,
        additionalImages: validGalleryImages.length > 0 ? validGalleryImages : undefined,
        videoUrl: videoUrl.trim() ? videoUrl.trim() : undefined,
        xPostUrl: xPostUrl.trim() ? xPostUrl.trim() : undefined,
        createdAtRaw: nowIso,
        publishedAt: 'Just now',
        readTime: `${Math.max(2, Math.ceil(content.split(' ').length / 200))} min read`,
        author: 'West Bridge News',
        authorAvatar: '/logo.png',
        isTopStory,
        isBreaking,
        views: 1,
        likes: 0,
        commentsCount: 0,
      };

      // 1. Optimistic Instant UI Update (Article appears immediately in Admin list!)
      setArticles((prev) => [newArticle, ...prev.filter((a) => a.slug !== newArticle.slug)]);

      // Reset Form
      setTitle('');
      setSummary('');
      setContent('');
      setImageUrl('');
      setImagePreview(null);
      setSecondImageUrl('');
      setSecondImagePreview(null);
      setEnableSecondImage(false);
      setAdditionalImages([]);
      setVideoUrl('');
      setXPostUrl('');
      setIsTopStory(false);
      setIsBreaking(false);
      setPublishSuccess(true);

      // 2. Save live to Supabase PostgreSQL
      await saveArticleToSupabase(newArticle);
      await loadLatestArticles();

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
    setArticles((prev) => prev.map((a) => (a.slug === art.slug ? updated : a)));
    await saveArticleToSupabase(updated);
    await loadLatestArticles();
  };

  const handleDelete = async (id: string, slug: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    setDeletingId(id);
    setArticles((prev) => prev.filter((a) => a.id !== id && a.slug !== slug));
    await deleteArticleFromSupabase(id);
    await loadLatestArticles();
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
              <span>West Bridge News Editorial Suite</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-editorial-heading">Publisher Admin Studio</h1>
            <p className="text-slate-300 text-xs">Publish, upload multi-photos, manage WhatsApp dual previews, and optional video reports live</p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://westbridgenews.com"
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Live Website</span>
            </a>
            <button
              onClick={handleLogout}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-bold text-xs px-3.5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
              title="Log Out of Admin Studio"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {publishSuccess && (
          <div className="bg-emerald-600 text-white p-4 rounded-2xl flex items-center gap-3 shadow-md animate-fade-in">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <div>
              <h4 className="font-extrabold text-sm">Article Published Successfully!</h4>
              <p className="text-xs text-emerald-100">Your news report is now live globally on West Bridge News.</p>
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

            <form onSubmit={handlePublish} className="space-y-6">
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
                  {CATEGORIES.filter((cat) => cat.name.toLowerCase() !== 'discover').map((cat) => (
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

              {/* ============================================================== */}
              {/* PRIMARY COVER PHOTO (MAIN 1) */}
              {/* ============================================================== */}
              <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold text-wbn-navy uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-wbn-blue" />
                    <span>Primary Cover Photo (Main 1)</span>
                  </label>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded">No caption (Article Header)</span>
                </div>

                {/* Upload or URL */}
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer bg-wbn-navy hover:bg-wbn-blue text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 shadow-sm">
                    {isCompressingImage ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <Upload className="w-4 h-4 text-white" />
                    )}
                    <span>{isCompressingImage ? 'Optimizing Photo...' : 'Upload Photo 1'}</span>
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

                {imagePreview && (
                  <div className="relative w-full h-40 rounded-xl overflow-hidden border border-slate-300 mt-2">
                    <Image src={imagePreview} alt="Primary Preview" fill className="object-cover" />
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-900/80 text-[10px] font-bold text-white">
                      WBN Auto-Badge Enabled
                    </div>
                  </div>
                )}
              </div>

              {/* ============================================================== */}
              {/* SECONDARY MAIN PHOTO (OPTIONAL MAIN 2 FOR WHATSAPP DUAL PREVIEW) */}
              {/* ============================================================== */}
              <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={enableSecondImage}
                      onChange={(e) => setEnableSecondImage(e.target.checked)}
                      className="w-4 h-4 text-wbn-blue rounded focus:ring-wbn-blue"
                    />
                    <span className="text-xs font-extrabold text-wbn-navy uppercase tracking-wider flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5 text-wbn-blue" />
                      Add Second Main Photo (Dual-Photo WhatsApp Link Preview)
                    </span>
                  </label>
                  <span className="text-[10px] font-bold text-wbn-blue bg-blue-100 px-2 py-0.5 rounded">Optional</span>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  When enabled, WhatsApp and social links will render both photos side-by-side on the chat preview card! Both photos also appear prominently at the top of the article without captions.
                </p>

                {enableSecondImage && (
                  <div className="space-y-3 pt-2 border-t border-blue-200">
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer bg-wbn-blue hover:bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors flex items-center gap-2 shadow-sm">
                        {isCompressingSecondImage ? (
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                        ) : (
                          <Upload className="w-4 h-4 text-white" />
                        )}
                        <span>{isCompressingSecondImage ? 'Optimizing Photo...' : 'Upload Photo 2'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleSecondImageFileChange}
                          className="hidden"
                          disabled={isCompressingSecondImage}
                        />
                      </label>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">or URL</span>
                    </div>

                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-2..."
                      value={secondImageUrl}
                      onChange={(e) => {
                        setSecondImageUrl(e.target.value);
                        setSecondImagePreview(e.target.value);
                      }}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-wbn-navy focus:outline-none focus:ring-2 focus:ring-wbn-blue"
                    />

                    {secondImagePreview && (
                      <div className="relative w-full h-40 rounded-xl overflow-hidden border border-slate-300 mt-2">
                        <Image src={secondImagePreview} alt="Secondary Preview" fill className="object-cover" />
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-900/80 text-[10px] font-bold text-white">
                          WBN Auto-Badge Enabled
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ============================================================== */}
              {/* ADDITIONAL STORY PHOTOS (GALLERY WITH INDIVIDUAL CAPTIONS) */}
              {/* ============================================================== */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="block text-xs font-extrabold text-wbn-navy uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-wbn-blue" />
                      <span>Additional Story Photos (In Pictures / Story Gallery)</span>
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Displayed below the article text with individual editorial captions and tap-to-enlarge lightbox modal.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-lg">
                    {additionalImages.length} {additionalImages.length === 1 ? 'photo' : 'photos'}
                  </span>
                </div>

                {/* List of Gallery Photos */}
                <div className="space-y-3">
                  {additionalImages.map((imgItem, idx) => (
                    <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl space-y-2.5 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-wbn-navy">Gallery Photo #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryPhoto(idx)}
                          className="text-slate-400 hover:text-red-500 p-1 rounded transition-colors"
                          title="Remove Photo"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Photo Upload or URL */}
                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 flex-shrink-0">
                          {compressingGalleryIdx === idx ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Upload className="w-3.5 h-3.5" />
                          )}
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleGalleryFileChange(idx, e)}
                            className="hidden"
                          />
                        </label>

                        <input
                          type="url"
                          placeholder="Or paste image URL (https://...)"
                          value={imgItem.url}
                          onChange={(e) => handleGalleryFieldChange(idx, 'url', e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-wbn-navy focus:outline-none focus:ring-1 focus:ring-wbn-blue"
                        />
                      </div>

                      {/* Photo Thumbnail if URL is present */}
                      {imgItem.url && (
                        <div className="relative w-full h-28 rounded-lg overflow-hidden border border-slate-200">
                          <Image src={imgItem.url} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
                        </div>
                      )}

                      {/* Caption Input */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Photo Caption (Displayed with photo)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Officials inspecting the newly constructed bypass road"
                          value={imgItem.caption || ''}
                          onChange={(e) => handleGalleryFieldChange(idx, 'caption', e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-wbn-navy focus:outline-none focus:ring-1 focus:ring-wbn-blue"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddGalleryPhoto}
                  className="w-full py-2.5 border-2 border-dashed border-slate-300 hover:border-wbn-blue hover:text-wbn-blue text-slate-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Another Story Photo</span>
                </button>
              </div>

              {/* ============================================================== */}
              {/* OPTIONAL END-OF-ARTICLE VIDEO */}
              {/* ============================================================== */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold text-wbn-navy uppercase tracking-wider flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-purple-600" />
                    <span>Video at End of Article (Strictly Optional)</span>
                  </label>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">Plays Once • Replay → X</span>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Strictly optional: If you leave this blank, no video box or placeholder will be rendered at all. When added, the video plays once; any attempt to replay redirects the user to your official X (Twitter) post/profile.
                </p>

                <div className="space-y-3 pt-1">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Video Direct URL (MP4 / WebM / Cloud Hosted)
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/videos/exclusive-report.mp4"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-wbn-navy focus:outline-none focus:ring-2 focus:ring-wbn-blue"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Specific X (Twitter) Post URL for Replay (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://x.com/WestBridgeNet/status/..."
                      value={xPostUrl}
                      onChange={(e) => setXPostUrl(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-wbn-navy focus:outline-none focus:ring-2 focus:ring-wbn-blue"
                    />
                    <span className="text-[10px] text-slate-400 block">
                      Defaults to https://x.com/WestBridgeNet if left blank.
                    </span>
                  </div>
                </div>
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
                disabled={isPublishing || isCompressingImage || isCompressingSecondImage || compressingGalleryIdx !== null}
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
                <Link
                  href="/admin/articles"
                  className="text-xs font-bold text-wbn-blue hover:underline flex items-center gap-1"
                >
                  <span>View All Archive →</span>
                </Link>
              </div>

              <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1 no-scrollbar">
                {isLoadingArticles && articles.length === 0 ? (
                  <div className="py-8 text-center space-y-2">
                    <Loader2 className="w-6 h-6 animate-spin text-wbn-blue mx-auto" />
                    <p className="text-xs text-slate-400">Fetching Articles...</p>
                  </div>
                ) : articles.length === 0 ? (
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

                      <a href={`https://westbridgenews.com/news/${art.slug}`} target="_blank" rel="noopener noreferrer">
                        <h4 className="font-bold text-xs text-wbn-navy group-hover:text-wbn-blue line-clamp-2 leading-snug">
                          {art.title}
                        </h4>
                      </a>

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
