'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import AdBanner from '@/components/AdBanner';
import { Article, CommentItem, incrementArticleViews } from '@/lib/newsData';
import { Heart, MessageSquare, Share2, Eye, Clock, Send, Check } from 'lucide-react';

interface ArticleClientActionsProps {
  article: Article;
  officialWhatsAppLink: string;
}

export default function ArticleClientActions({ article, officialWhatsAppLink }: ArticleClientActionsProps) {
  const [likesCount, setLikesCount] = useState<number>(article.likes);
  const [viewsCount, setViewsCount] = useState<number>(article.views);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentItem[]>(article.commentsList || []);
  const [newCommentName, setNewCommentName] = useState<string>('');
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    incrementArticleViews(article.slug).then((updatedViews) => {
      if (updatedViews > viewsCount) {
        setViewsCount(updatedViews);
      }
    });
  }, [article.slug]);

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
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const paragraphs = article.content.split('\n\n');

  return (
    <>
      {/* Floating Left Social Action Dock */}
      <div className="hidden lg:block lg:col-span-1">
        <div className="sticky top-28 flex flex-col items-center gap-4 bg-white border border-slate-200 shadow-md rounded-2xl p-3">
          {/* Love / Like Button */}
          <button
            onClick={handleLike}
            className="group flex flex-col items-center text-slate-600 hover:text-wbn-blue transition-colors"
            title="Love this story"
          >
            <div className={`p-2.5 rounded-xl ${hasLiked ? 'bg-wbn-blue text-white' : 'bg-slate-100 group-hover:bg-blue-50'}`}>
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

          {/* Copy Link Share Button */}
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

          {/* Join WhatsApp Group Chat Button */}
          <a
            href={officialWhatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center text-emerald-700 hover:text-emerald-800 transition-colors pt-2 border-t border-slate-100"
            title="Join our WhatsApp group chat"
          >
            <div className="p-2.5 rounded-xl bg-emerald-700 text-white shadow-sm hover:bg-emerald-800 transition-colors">
              <WhatsAppIcon className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="text-[9px] font-bold text-center mt-1">WA Group</span>
          </a>
        </div>
      </div>

      {/* Main Article Content Area */}
      <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
        {/* Title & Metadata */}
        <div className="space-y-4">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-wbn-navy leading-tight font-editorial-heading">
            {article.title}
          </h1>

          {/* Reported By West Bridge Network Tag */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-100 text-xs">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image src="/logo.png" alt="West Bridge Network" fill className="object-contain" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Reported by:</span>
                <h4 className="font-extrabold text-wbn-navy text-sm">West Bridge Network</h4>
                <p className="text-[11px] text-wbn-slate font-medium">{article.publishedAt}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-wbn-slate" /> {article.readTime}
              </span>
              <span className="flex items-center gap-1 font-bold text-wbn-navy">
                <Eye className="w-4 h-4 text-wbn-blue" /> {viewsCount} Reads
              </span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden shadow-md">
          <Image src={article.imageUrl} alt={article.title} fill className="object-cover" priority />
        </div>

        {/* Main Article Text Body with Injected Inline Ad Boxes */}
        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-4">
          {paragraphs.map((paragraph, i) => (
            <React.Fragment key={i}>
              <p>{paragraph}</p>
              {/* Insert Ad Box after the 2nd paragraph */}
              {i === 1 && (
                <div className="my-6">
                  <AdBanner slotType="article-inline" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Share Footer */}
        <div className="pt-6 border-t border-slate-100 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                hasLiked ? 'bg-wbn-blue text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
              <span>{likesCount} Loves</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
            </button>
          </div>

          <a
            href={officialWhatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow"
          >
            <WhatsAppIcon className="w-4 h-4 text-white fill-current" />
            <span>Join our WhatsApp group chat</span>
          </a>
        </div>

        {/* Reader Comments Section */}
        <section id="comments" className="pt-8 border-t border-slate-100 space-y-6">
          <h3 className="font-extrabold text-lg text-wbn-navy flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-wbn-blue" />
            Reader Discussion ({comments.length})
          </h3>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Your Name (Optional)"
                value={newCommentName}
                onChange={(e) => setNewCommentName(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-wbn-blue"
              />
            </div>
            <textarea
              rows={3}
              placeholder="Share your thoughts on this story..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-wbn-blue"
              required
            ></textarea>
            <button
              type="submit"
              className="bg-wbn-navy hover:bg-wbn-blue text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Comment</span>
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-wbn-blue text-white rounded-full flex items-center justify-center font-bold text-xs">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-xs text-wbn-navy">{c.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{c.createdAt}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-9">{c.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
