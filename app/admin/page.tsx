'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header, { CATEGORIES } from '@/components/Header';
import { saveArticle, Article } from '@/lib/newsData';
import { Sparkles, Copy, Check, Send, MessageSquare, Plus, FileText, CheckCircle2, Share2, ExternalLink } from 'lucide-react';

export default function AdminPage() {
  const [headline, setHeadline] = useState('');
  const [category, setCategory] = useState<Article['category']>('Breaking');
  const [author, setAuthor] = useState('Adetayo Omotoyosi Adeolu');
  const [authorRole, setAuthorRole] = useState('Chief Political Correspondent');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=1200');
  const [whatsappChannelLink, setWhatsappChannelLink] = useState('https://whatsapp.com/channel/0029Va9WjfK4Y9Ifdqw4Mi32');
  
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [publishedArticle, setPublishedArticle] = useState<Article | null>(null);

  const defaultPromptText = `You are a senior investigative journalist for West Bridge Network (WBN). Write a detailed, engaging 500-word news report based on the following headline/topic:

"${headline || 'Enter your headline here'}"

Please structure the output as:
1. TITLE: High impact news headline
2. SUMMARY: 2-sentence concise summary
3. CONTENT: 4-5 detailed paragraphs with key subheadings
4. KEY TAKEAWAYS: Bullet points summarizing the report`;

  const handleCopyPrompt = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(defaultPromptText);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 3000);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim() || !content.trim()) return;

    const slug = headline
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newArticle: Article = {
      id: `wbn-${Date.now()}`,
      slug,
      title: headline,
      summary: summary || headline,
      content,
      category,
      author,
      authorRole,
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      publishedAt: 'JUST NOW',
      readTime: '4 min read',
      imageUrl,
      views: 1,
      likes: 0,
      commentsList: [],
      isBreaking: category === 'Breaking',
      whatsappChannelLink,
    };

    saveArticle(newArticle);
    setPublishedArticle(newArticle);
  };

  const getWhatsAppPayload = (article: Article) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://wbn.com';
    const articleUrl = `${origin}/news/${article.slug}`;

    return `${article.title}

${articleUrl}

---
⚡ Join our WhatsApp channel for faster updates and videos; simply click on this link [${article.whatsappChannelLink || 'https://whatsapp.com/channel/0029Va9WjfK4Y9Ifdqw4Mi32'}] and follow.`;
  };

  const handleOpenWhatsAppBroadcast = (article: Article) => {
    const payload = getWhatsAppPayload(article);
    const encoded = encodeURIComponent(payload);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-wbn-bg">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Admin Title & Overview */}
        <div className="flex flex-wrap justify-between items-center gap-4 bg-wbn-navy text-white rounded-3xl p-6 sm:p-8 shadow-lg">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-wbn-slate">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> WBN Publisher Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">West Bridge Network Admin Studio</h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Create articles using free ChatGPT prompt templates and dispatch 1-Click WhatsApp group broadcasts.
            </p>
          </div>

          <Link
            href="/"
            className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/20 transition-all"
          >
            ← View Live Website
          </Link>
        </div>

        {/* Success Banner when Published */}
        {publishedArticle && (
          <div className="bg-emerald-50 border-2 border-emerald-500 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md animate-fade-in">
            <div className="flex items-center gap-3 text-emerald-800">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 flex-shrink-0" />
              <div>
                <h3 className="font-extrabold text-lg">Story Published Successfully!</h3>
                <p className="text-xs text-emerald-700">
                  Your article is now live on the West Bridge Network homepage and topic feeds.
                </p>
              </div>
            </div>

            {/* 1-Click WhatsApp Broadcast Studio Box */}
            <div className="bg-white rounded-2xl border border-emerald-200 p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 fill-current text-emerald-600" />
                  1-Click WhatsApp Group & Channel Broadcast Payload
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  READY TO DISPATCH
                </span>
              </div>

              <textarea
                rows={5}
                readOnly
                value={getWhatsAppPayload(publishedArticle)}
                className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
              />

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleOpenWhatsAppBroadcast(publishedArticle)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-md"
                >
                  <Send className="w-4 h-4" /> 1-Click Dispatch To WhatsApp Web / App
                </button>
                <Link
                  href={`/news/${publishedArticle.slug}`}
                  target="_blank"
                  className="bg-wbn-blue hover:bg-wbn-cobalt text-white font-bold text-xs px-5 py-3 rounded-xl transition-all flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" /> View Live Article Page
                </Link>
                <button
                  onClick={() => setPublishedArticle(null)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs px-4 py-3 rounded-xl"
                >
                  Publish Another Story
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Free ChatGPT Prompt Helper Box */}
        <div className="bg-gradient-to-r from-blue-900 to-wbn-navy text-white rounded-3xl p-6 space-y-4 shadow-md">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm">Free ChatGPT Journalist Prompt Assistant</h3>
                <p className="text-xs text-slate-300">Copy this prompt to generate full news reports in free ChatGPT</p>
              </div>
            </div>

            <button
              onClick={handleCopyPrompt}
              className="bg-white text-wbn-navy hover:bg-amber-300 font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow"
            >
              {copiedPrompt ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedPrompt ? 'Copied Prompt!' : 'Copy ChatGPT Prompt'}</span>
            </button>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 text-xs font-mono text-slate-200 whitespace-pre-wrap border border-white/10">
            {defaultPromptText}
          </div>
        </div>

        {/* Main Publisher Form */}
        <form onSubmit={handlePublish} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-xl font-extrabold text-wbn-navy border-b border-slate-100 pb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-wbn-blue" />
            Article Content Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-bold text-wbn-navy uppercase tracking-wider">
                News Headline / Title *
              </label>
              <input
                type="text"
                placeholder="e.g. BREAKING: Tinubu's government gives full breakdown of fuel subsidy savings"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-wbn-navy focus:outline-none focus:ring-2 focus:ring-wbn-blue"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-wbn-navy uppercase tracking-wider">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Article['category'])}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-wbn-navy focus:outline-none focus:ring-2 focus:ring-wbn-blue"
              >
                {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>
                    {c} News
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-wbn-navy uppercase tracking-wider">
                Author Name
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-wbn-navy focus:outline-none focus:ring-2 focus:ring-wbn-blue"
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-bold text-wbn-navy uppercase tracking-wider">
                Short Preview Summary (Shown on WhatsApp & Cards)
              </label>
              <textarea
                rows={2}
                placeholder="Concise 2-sentence summary for social previews..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-wbn-navy focus:outline-none focus:ring-2 focus:ring-wbn-blue"
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-bold text-wbn-navy uppercase tracking-wider">
                Featured Thumbnail Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-wbn-navy focus:outline-none focus:ring-2 focus:ring-wbn-blue"
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-bold text-wbn-navy uppercase tracking-wider">
                Full Article Report Content * (Paste from ChatGPT)
              </label>
              <textarea
                rows={10}
                placeholder="Paste full report content generated from ChatGPT here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-wbn-navy focus:outline-none focus:ring-2 focus:ring-wbn-blue leading-relaxed font-sans"
                required
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="bg-wbn-blue hover:bg-wbn-cobalt text-white font-extrabold text-sm px-8 py-3.5 rounded-xl transition-all shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Publish Story To WBN
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
