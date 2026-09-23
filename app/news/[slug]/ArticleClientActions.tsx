'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import AdBanner from '@/components/AdBanner';
import { Article, CommentItem, incrementArticleViews, formatTimeAgo, fetchCommentsForArticle, saveCommentToSupabase } from '@/lib/newsData';
import { 
  Heart, MessageSquare, Share2, Eye, Clock, Send, Check, UserCheck, ShieldCheck, 
  Camera, RotateCcw, ExternalLink, X, ChevronLeft, ChevronRight 
} from 'lucide-react';

function WBNBadge({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-white/20 shadow-lg pointer-events-none select-none ${className}`}>
      <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
      <span className="text-[10px] font-black tracking-wider text-white uppercase font-editorial-heading">
        WBN
      </span>
      <span className="text-[9px] font-semibold text-slate-300 border-l border-white/25 pl-1.5 hidden sm:inline">
        West Bridge News
      </span>
    </div>
  );
}

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
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Gallery Lightbox modal state
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number | null>(null);

  // Video play-once state
  const [videoEnded, setVideoEnded] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const hasIncrementedRef = useRef<boolean>(false);

  const officialXUrl = article.xPostUrl || 'https://x.com/WestBridgeNet';

  useEffect(() => {
    setIsMounted(true);

    // Initial load of comments from article props
    if (article.commentsList && article.commentsList.length > 0) {
      setComments(article.commentsList);
    }

    // Fetch latest global comments from Supabase
    fetchCommentsForArticle(article.slug).then((fetched) => {
      if (fetched && fetched.length > 0) {
        setComments(fetched);
      }
    });

    // Increment view count EXACTLY ONCE per visit (No infinite loop)
    if (!hasIncrementedRef.current) {
      hasIncrementedRef.current = true;
      incrementArticleViews(article.slug).then((updatedViews) => {
        if (updatedViews && updatedViews > 0) {
          setViewsCount(updatedViews);
        }
      });
    }

    // Automatic Copyright Source Attribution when users copy article text
    const handleCopyEvent = (e: ClipboardEvent) => {
      const selection = window.getSelection()?.toString();
      if (selection && selection.length > 40) {
        e.preventDefault();
        const sourceUrl = window.location.href;
        const attribution = `\n\nRead full report on West Bridge News: ${sourceUrl}\n© 2026 West Bridge News (WBN). All Rights Reserved.`;
        if (e.clipboardData) {
          e.clipboardData.setData('text/plain', selection + attribution);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedGalleryIndex(null);
      }
    };

    document.addEventListener('copy', handleCopyEvent);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('copy', handleCopyEvent);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [article.slug, article.commentsList]);

  const handleLike = () => {
    if (!hasLiked) {
      setLikesCount((prev) => prev + 1);
      setHasLiked(true);
    } else {
      setLikesCount((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const authorName = newCommentName.trim() || 'Verified Reader';

    const newC: CommentItem = {
      id: `cmt-${Date.now()}`,
      name: authorName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(authorName)}`,
      text: newCommentText.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = [newC, ...comments];
    setComments(updated);
    setNewCommentText('');
    setNewCommentName('');

    await saveCommentToSupabase(article.slug, newC);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  // Video play-once & replay constraint handlers
  const handleVideoEnded = () => {
    setVideoEnded(true);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleVideoPlayAttempt = (e: React.SyntheticEvent) => {
    if (videoEnded) {
      e.preventDefault();
      if (videoRef.current) {
        videoRef.current.pause();
      }
      window.open(officialXUrl, '_blank', 'noopener,noreferrer');
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
      <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6" suppressHydrationWarning>
        {/* Title & Metadata */}
        <div className="space-y-4">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-wbn-navy leading-tight font-editorial-heading">
            {article.title}
          </h1>

          {/* Reported By West Bridge News Tag */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-100 text-xs">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image src="/logo.png" alt="West Bridge News" fill className="object-contain" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Reported by:</span>
                <h4 className="font-extrabold text-wbn-navy text-sm">West Bridge News</h4>
                <p className="text-[11px] text-wbn-slate font-medium" suppressHydrationWarning>
                  {isMounted ? formatTimeAgo(article.createdAtRaw || article.publishedAt) : article.publishedAt}
                </p>
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

        {/* Featured Main Image(s) - Without Captions */}
        {article.secondImageUrl ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md">
              <Image src={article.imageUrl} alt={article.title} fill className="object-cover" priority />
              <WBNBadge />
            </div>
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md">
              <Image src={article.secondImageUrl} alt={`${article.title} - secondary`} fill className="object-cover" priority />
              <WBNBadge />
            </div>
          </div>
        ) : (
          <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden shadow-md">
            <Image src={article.imageUrl} alt={article.title} fill className="object-cover" priority />
            <WBNBadge />
          </div>
        )}

        {/* Main Article Text Body */}
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

        {/* ================================================================ */}
        {/* OPTIONAL IN PICTURES / STORY GALLERY (WITH CAPTIONS & LIGHTBOX)  */}
        {/* ================================================================ */}
        {article.additionalImages && article.additionalImages.length > 0 && (
          <div className="my-8 pt-6 border-t border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-wbn-navy font-editorial-heading flex items-center gap-2">
                <Camera className="w-5 h-5 text-wbn-blue" />
                <span>In Pictures / Story Gallery ({article.additionalImages.length})</span>
              </h3>
              <span className="text-[11px] font-semibold text-slate-400">Click photo to enlarge</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {article.additionalImages.map((imgItem, idx) => (
                <figure
                  key={idx}
                  className="group cursor-pointer space-y-2 bg-slate-50 border border-slate-200 rounded-2xl p-2.5 transition-all hover:shadow-md hover:border-slate-300"
                  onClick={() => setSelectedGalleryIndex(idx)}
                >
                  <div className="relative h-48 sm:h-56 w-full rounded-xl overflow-hidden bg-slate-200">
                    <Image
                      src={imgItem.url}
                      alt={imgItem.caption || `Story photo ${idx + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <WBNBadge />
                  </div>

                  {imgItem.caption && (
                    <figcaption className="text-xs text-slate-600 font-medium leading-relaxed px-1 flex items-start gap-1.5">
                      <span className="text-wbn-blue font-bold flex-shrink-0">📸</span>
                      <span>{imgItem.caption}</span>
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* OPTIONAL END-OF-ARTICLE VIDEO (STRICTLY OPTIONAL: ONLY IF ADDED)  */}
        {/* CONSTRAINT: PLAYS ONCE, REPLAY ATTEMPT REDIRECTS TO OFFICIAL X   */}
        {/* ================================================================ */}
        {article.videoUrl && (
          <div className="my-8 p-4 sm:p-6 bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-red-500">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                <span>Exclusive Video Report</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">West Bridge News Bureau</span>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
              <video
                ref={videoRef}
                src={article.videoUrl}
                controls
                playsInline
                controlsList="nodownload"
                onEnded={handleVideoEnded}
                onPlay={handleVideoPlayAttempt}
                className="w-full h-full object-contain"
              />

              {/* Play-Once End Screen Overlay */}
              {videoEnded && (
                <div 
                  onClick={() => window.open(officialXUrl, '_blank', 'noopener,noreferrer')}
                  className="absolute inset-0 z-20 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 cursor-pointer animate-fade-in"
                >
                  <div className="w-14 h-14 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
                    <RotateCcw className="w-6 h-6" />
                  </div>

                  <div className="space-y-1.5 max-w-md">
                    <h4 className="text-base sm:text-lg font-black text-white">Video Finished Playing</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      To watch the replay and join the viral discussion, continue on our official X (Twitter) channel.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="bg-white hover:bg-slate-100 text-slate-950 font-black text-xs px-6 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2"
                  >
                    <span>Watch Replay on X (@WestBridgeNet)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              West Bridge News Video Coverage • © 2026 West Bridge News
            </p>
          </div>
        )}

        {/* Official Article Copyright Protection Banner */}
        <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 space-y-1.5 my-6">
          <div className="font-extrabold text-wbn-navy flex items-center gap-1.5 text-xs">
            <ShieldCheck className="w-4 h-4 text-wbn-blue" />
            <span>© 2026 West Bridge News (WBN). All Rights Reserved.</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            This news report and all digital content on westbridgenews.com may not be reproduced, republished, broadcast, rewritten, or redistributed in whole or in part without express prior written permission from West Bridge News Editorial Bureau.
          </p>
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

        {/* Reader Discussion Section */}
        <section id="comments" className="pt-8 border-t border-slate-100 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-wbn-navy flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-wbn-blue" />
              Reader Discussion ({comments.length})
            </h3>
          </div>

          {/* Direct Clean Comment Input Box */}
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
          <div className="space-y-4 pt-2">
            {comments.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-4">
                Be the first reader to comment on this story!
              </p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-wbn-navy text-white rounded-full flex items-center justify-center font-bold text-xs">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-xs text-wbn-navy flex items-center gap-1">
                        {c.name}
                        <UserCheck className="w-3 h-3 text-emerald-600" />
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium" suppressHydrationWarning>
                      {formatTimeAgo(c.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-9">{c.text}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* ================================================================ */}
      {/* FULLSCREEN LIGHTBOX MODAL FOR GALLERY IMAGES                      */}
      {/* ================================================================ */}
      {selectedGalleryIndex !== null && article.additionalImages && article.additionalImages[selectedGalleryIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-fade-in"
          onClick={() => setSelectedGalleryIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedGalleryIndex(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20"
            title="Close Gallery (Esc)"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev Button */}
          {article.additionalImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedGalleryIndex((prev) => (prev! > 0 ? prev! - 1 : article.additionalImages!.length - 1));
              }}
              className="absolute left-2 sm:left-6 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors z-20"
              title="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Main Image in Lightbox */}
          <div
            className="relative max-w-4xl max-h-[72vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[65vh] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={article.additionalImages[selectedGalleryIndex].url}
                alt={article.additionalImages[selectedGalleryIndex].caption || 'Enlarged photo'}
                fill
                className="object-contain"
              />
              <WBNBadge />
            </div>
          </div>

          {/* Caption & Counter */}
          <div
            className="max-w-2xl text-center space-y-1.5 mt-4 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-400">
              Photo {selectedGalleryIndex + 1} of {article.additionalImages.length}
            </span>
            {article.additionalImages[selectedGalleryIndex].caption && (
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                {article.additionalImages[selectedGalleryIndex].caption}
              </p>
            )}
          </div>

          {/* Next Button */}
          {article.additionalImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedGalleryIndex((prev) => (prev! < article.additionalImages!.length - 1 ? prev! + 1 : 0));
              }}
              className="absolute right-2 sm:right-6 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors z-20"
              title="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
