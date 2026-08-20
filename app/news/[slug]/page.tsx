'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import AdBanner from '@/components/AdBanner';
import { getArticleBySlug, getStoredArticles, Article, CommentItem } from '@/lib/newsData';
import { Heart, MessageSquare, Share2, Eye, Clock, ChevronRight, User, Send, Check } from 'lucide-react';

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newCommentName, setNewCommentName] = useState<string>('');
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    if (slug) {
      const found = getArticleBySlug(slug);
      if (found) {
        setArticle(found);
        setLikesCount(found.likes);
        setComments(found.commentsList || []);
      }
    }
  }, [slug]);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-wbn-bg">
        <Header />
        <div className="flex-1 max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
          <h2 className="text-2xl font-bold text-wbn-navy">Article Loading / Not Found</h2>
          <p className="text-slate-600 text-sm">The news report you requested could not be located.</p>
          <Link href="/" className="inline-block bg-wbn-blue text-white font-bold px-6 py-2.5 rounded-xl">
            ← Return to Headlines
          </Link>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    if (!hasLiked) {
      setLikesCount((prev) => prev + 1);
      setHasLiked(true);
    } else {
      setLikesCount((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newC: CommentItem = {
      id: Date.now().toString(),
      name: newCommentName.trim() || 'Anonymous Reader',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
      text: newCommentText.trim(),
      createdAt: 'Just now',
    };

    setComments([newC, ...comments]);
    setNewCommentText('');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const allArticles = getStoredArticles();
  const trending = [...allArticles].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col bg-wbn-bg">
      {/* Dynamic OpenGraph Metadata Tags for WhatsApp Link Preview */}
      <head>
        <title>{article.title} | West Bridge Network</title>
        <meta name="description" content={article.summary} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.summary} />
        <meta property="og:image" content={article.imageUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="West Bridge Network (WBN)" />
      </head>

      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-6">
          <Link href="/" className="hover:text-wbn-blue">DISCOVER</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-wbn-blue uppercase">{article.category}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-400 line-clamp-1 max-w-xs">{article.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
          {/* Floating Left Social Action Dock */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28 flex flex-col items-center gap-4 bg-white border border-slate-200 shadow-md rounded-2xl p-3">
              {/* Love / Like Button */}
              <button
                onClick={handleLike}
                className="group flex flex-col items-center text-slate-600 hover:text-rose-500 transition-colors"
                title="Love this story"
              >
                <div className={`p-2.5 rounded-xl ${hasLiked ? 'bg-rose-500 text-white' : 'bg-slate-100 group-hover:bg-rose-50'}`}>
                  <Heart className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
                </div>
                <span className="text-[10px] font-bold mt-1">{likesCount}</span>
                <span className="text-[9px] text-slate-400">Love</span>
              </button>

              {/* Comment Count */}
              <a
                href="#comments"
                className="group flex flex-col items-center text-slate-600 hover:text-wbn-blue transition-colors"
                title="View Comments"
              >
                <div className="p-2.5 rounded-xl bg-slate-100 group-hover:bg-blue-50">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold mt-1">{comments.length}</span>
                <span className="text-[9px] text-slate-400">Comments</span>
              </a>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="group flex flex-col items-center text-slate-600 hover:text-wbn-cobalt transition-colors"
                title="Share Article Link"
              >
                <div className="p-2.5 rounded-xl bg-slate-100 group-hover:bg-indigo-50">
                  {copiedLink ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
                </div>
                <span className="text-[10px] font-bold mt-1">{copiedLink ? 'Copied!' : 'Share'}</span>
              </button>

              {/* Join WhatsApp Channel Button */}
              <a
                href={article.whatsappChannelLink || 'https://whatsapp.com/channel/0029Va9WjfK4Y9Ifdqw4Mi32'}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center text-emerald-600 hover:text-emerald-700 transition-colors pt-2 border-t border-slate-100"
                title="Join WBN WhatsApp Channel"
              >
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <MessageSquare className="w-5 h-5 fill-current" />
                </div>
                <span className="text-[9px] font-bold text-center mt-1">Join WA</span>
              </a>
            </div>
          </div>

          {/* Main Article Content Area */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
            {/* Title & Metadata */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-wbn-navy leading-tight">
                {article.title}
              </h1>

              {/* Author & Timestamp Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-100 text-xs">
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border border-wbn-blue shadow-sm">
                    <Image src={article.authorAvatar} alt={article.author} fill className="object-cover" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase">Published by:</span>
                    <h4 className="font-bold text-wbn-navy text-sm">{article.author}</h4>
                    <p className="text-[11px] text-wbn-slate">{article.publishedAt}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-wbn-slate" /> {article.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-wbn-slate" /> {article.views} Reads
                  </span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative h-[300px] sm:h-[450px] rounded-2xl overflow-hidden shadow-md">
              <Image src={article.imageUrl} alt={article.title} fill className="object-cover" priority />
            </div>

            {/* Main Article Body Text */}
            <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-sm sm:text-base space-y-4">
              {article.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Mobile Social Bar */}
            <div className="lg:hidden flex items-center justify-around py-4 border-y border-slate-200">
              <button onClick={handleLike} className="flex items-center gap-2 text-xs font-bold text-rose-600">
                <Heart className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} /> {likesCount} Loves
              </button>
              <button onClick={handleShare} className="flex items-center gap-2 text-xs font-bold text-wbn-blue">
                <Share2 className="w-5 h-5" /> {copiedLink ? 'Link Copied' : 'Share'}
              </button>
              <a
                href={article.whatsappChannelLink || 'https://whatsapp.com/channel/0029Va9WjfK4Y9Ifdqw4Mi32'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full"
              >
                <MessageSquare className="w-4 h-4 fill-current" /> Join Channel
              </a>
            </div>

            {/* Comments Section */}
            <div id="comments" className="pt-8 border-t border-slate-200 space-y-6">
              <h3 className="text-xl font-bold text-wbn-navy flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-wbn-blue" />
                Comments ({comments.length})
              </h3>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Your Name (optional)"
                    value={newCommentName}
                    onChange={(e) => setNewCommentName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-wbn-blue"
                  />
                </div>
                <textarea
                  rows={3}
                  placeholder="Share your thoughts on this story..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="w-full p-4 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-wbn-blue"
                  required
                ></textarea>
                <button
                  type="submit"
                  className="bg-wbn-blue hover:bg-wbn-cobalt text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow"
                >
                  <Send className="w-3.5 h-3.5" /> Post Comment
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((c) => (
                  <div key={c.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-wbn-navy text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {c.name.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-wbn-navy text-xs">{c.name}</h4>
                        <span className="text-[10px] text-slate-400">• {c.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <AdBanner slotType="sidebar" />

            {/* Trending Articles Sidebar Widget */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
              <h3 className="font-extrabold text-sm text-wbn-navy border-b border-slate-100 pb-2">
                Trending In {article.category}
              </h3>
              <div className="space-y-3">
                {trending.map((t) => (
                  <Link key={t.id} href={`/news/${t.slug}`} className="block group">
                    <h4 className="text-xs font-bold text-wbn-navy group-hover:text-wbn-cobalt transition-colors line-clamp-2 leading-snug">
                      {t.title}
                    </h4>
                    <span className="text-[10px] text-slate-400">{t.views} views</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
