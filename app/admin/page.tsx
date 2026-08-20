'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import { saveArticle, Article } from '@/lib/newsData';
import { Sparkles, Copy, Check, Send, Globe, MessageSquare, ShieldCheck, Newspaper, ArrowLeft } from 'lucide-react';

export default function AdminPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Politics');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isBreaking, setIsBreaking] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  // Free ChatGPT Journalist Assistant Prompt State
  const [promptTopic, setPromptTopic] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // WhatsApp Broadcast Payload State
  const [broadcastPayload, setBroadcastPayload] = useState('');
  const [copiedPayload, setCopiedPayload] = useState(false);

  const handleGeneratePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptTopic.trim()) return;

    const template = `Write a comprehensive, professional 500-word news article on the topic: "${promptTopic}".
Format your response cleanly with the following sections:
1. HEADLINE: Catchy, authoritative news title.
2. SUMMARY: 2-sentence executive summary.
3. BODY: 3 detailed paragraphs with facts, context, and impact.

Tone: Serious, investigative, unbiased, professional journalism for West Bridge Network (WBN).`;

    setGeneratedPrompt(template);
  };

  const handleCopyPrompt = () => {
    if (navigator.clipboard && generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 3000);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    const defaultImage = imageUrl.trim() || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80';

    const newArt: Article = {
      id: `wbn-${Date.now()}`,
      title: title.trim(),
      slug,
      category,
      summary: summary.trim() || title.trim(),
      content: content.trim(),
      imageUrl: defaultImage,
      publishedAt: 'JUST NOW',
      readTime: '3 min read',
      author: 'West Bridge Network',
      authorAvatar: '/logo.png',
      isBreaking,
      views: 1,
      likes: 0,
      commentsCount: 0,
      whatsappChannelLink: 'https://whatsapp.com/channel/0029Va9WjfK4Y9Ifdqw4Mi32',
    };

    saveArticle(newArt);
    setPublishedSuccess(true);

    // Auto-generate 1-Click WhatsApp Broadcast Payload
    const waPayload = `🚨 *BREAKING NEWS | WEST BRIDGE NETWORK*

*${newArt.title}*

${newArt.summary}

📖 *Read Full Report Here:*
http://localhost:3000/news/${newArt.slug}

📲 *Join WBN WhatsApp Channel for Live News Updates:*
https://whatsapp.com/channel/0029Va9WjfK4Y9Ifdqw4Mi32`;

    setBroadcastPayload(waPayload);

    setTimeout(() => {
      setPublishedSuccess(false);
    }, 5000);
  };

  const handleCopyPayload = () => {
    if (navigator.clipboard && broadcastPayload) {
      navigator.clipboard.writeText(broadcastPayload);
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-wbn-bg">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Admin Header Bar */}
        <div className="bg-wbn-navy text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> WBN Private Publisher Studio
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-editorial">Admin Journalist Dashboard</h1>
            <p className="text-xs text-slate-300">
              Publish breaking news reports directly tagged as <strong className="text-white">Reported by West Bridge Network</strong>.
            </p>
          </div>
          <Link
            href="/"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> View Live Website
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Article Publisher Form (Col 7) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-lg font-extrabold text-wbn-navy flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-wbn-blue" />
                Publish News Article
              </h2>
              <span className="text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full font-bold">
                Author: West Bridge Network
              </span>
            </div>

            {publishedSuccess && (
              <div className="bg-emerald-500 text-white p-4 rounded-2xl font-bold text-xs flex items-center gap-2 shadow">
                <Check className="w-5 h-5" /> Article Published Successfully! Check your homepage and WhatsApp payload below.
              </div>
            )}

            <form onSubmit={handlePublish} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-wbn-navy">Article Title / Headline *</label>
                <input
                  type="text"
                  placeholder="e.g. Federal Government Announces Major Infrastructure Fund..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-wbn-blue"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-wbn-navy">News Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-wbn-blue"
                  >
                    <option value="Politics">Politics</option>
                    <option value="Business">Business</option>
                    <option value="World">World</option>
                    <option value="Tech">Tech</option>
                    <option value="Security">Security</option>
                    <option value="Sports">Sports</option>
                    <option value="Entertainment">Entertainment</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-wbn-navy">Feature Image URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-wbn-blue"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-wbn-navy">Executive Summary (2 Sentences)</label>
                <textarea
                  rows={2}
                  placeholder="Brief summary that appears on news cards and WhatsApp previews..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-wbn-blue"
                ></textarea>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-wbn-navy">Full News Article Content *</label>
                <textarea
                  rows={8}
                  placeholder="Paste your news report here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-wbn-blue"
                  required
                ></textarea>
              </div>

              <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 p-3.5 rounded-xl">
                <input
                  type="checkbox"
                  id="breaking"
                  checked={isBreaking}
                  onChange={(e) => setIsBreaking(e.target.checked)}
                  className="w-4 h-4 text-wbn-blue rounded focus:ring-wbn-blue"
                />
                <label htmlFor="breaking" className="text-xs font-bold text-amber-900 cursor-pointer">
                  Mark as BREAKING NEWS (Pushes story to top marquee banner)
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-wbn-navy hover:bg-wbn-blue text-white font-extrabold text-sm py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Publish Story to West Bridge Network
              </button>
            </form>
          </div>

          {/* Right Column: Free ChatGPT Prompt Generator & WhatsApp Studio (Col 5) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Free ChatGPT Prompt Assistant Card */}
            <div className="bg-gradient-to-br from-slate-900 to-wbn-navy text-white rounded-3xl p-6 shadow-md space-y-4">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-base">Free ChatGPT Prompt Assistant</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Generate professional news stories without paid API keys. Type a news topic, copy the prompt, and paste it into free ChatGPT!
              </p>

              <form onSubmit={handleGeneratePrompt} className="space-y-3">
                <input
                  type="text"
                  placeholder="e.g. ECOWAS summit outcomes in Abuja..."
                  value={promptTopic}
                  onChange={(e) => setPromptTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button
                  type="submit"
                  className="w-full bg-amber-400 hover:bg-amber-300 text-wbn-navy font-bold text-xs py-2.5 rounded-xl transition-all"
                >
                  Generate Journalist Prompt
                </button>
              </form>

              {generatedPrompt && (
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <textarea
                    rows={6}
                    value={generatedPrompt}
                    readOnly
                    className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-slate-200"
                  ></textarea>
                  <button
                    onClick={handleCopyPrompt}
                    className="w-full bg-white/20 hover:bg-white/30 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    {copiedPrompt ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedPrompt ? 'Copied Prompt!' : 'Copy Prompt for ChatGPT'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* 1-Click WhatsApp Broadcast Studio */}
            {broadcastPayload && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 text-emerald-800">
                  <MessageSquare className="w-5 h-5 fill-current" />
                  <h3 className="font-extrabold text-base">1-Click WhatsApp Broadcast Studio</h3>
                </div>
                <p className="text-xs text-emerald-700">
                  Your formatted broadcast payload is ready to copy and share across WhatsApp groups & channels!
                </p>
                <textarea
                  rows={7}
                  value={broadcastPayload}
                  readOnly
                  className="w-full p-3.5 bg-white border border-emerald-300 rounded-2xl text-xs font-mono text-slate-800"
                ></textarea>
                <button
                  onClick={handleCopyPayload}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow transition-all"
                >
                  {copiedPayload ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedPayload ? 'Broadcast Copied!' : 'Copy WhatsApp Broadcast Payload'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
