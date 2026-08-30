'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdBanner from '@/components/AdBanner';
import ArticleClientActions from './ArticleClientActions';
import { getArticleBySlug, Article } from '@/lib/newsData';
import { ChevronRight, FileX } from 'lucide-react';

const OFFICIAL_WHATSAPP_LINK = "https://chat.whatsapp.com/FSqZA2tOXbv0luyOPa7iKD?s=cl&p=a&ilr=4";

interface ArticlePageClientProps {
  slug: string;
  initialArticle?: Article;
}

export default function ArticlePageClient({ slug, initialArticle }: ArticlePageClientProps) {
  const [article, setArticle] = useState<Article | undefined>(initialArticle);
  const [loading, setLoading] = useState<boolean>(!initialArticle);

  useEffect(() => {
    getArticleBySlug(slug).then((found) => {
      if (found) {
        setArticle(found);
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-wbn-bg">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-wbn-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 font-bold">Loading news report...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-wbn-bg">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
          <div className="w-16 h-16 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center mx-auto">
            <FileX className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-wbn-navy font-editorial-heading">
              Article Has Been Removed
            </h1>
            <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
              The news report you are looking for has been deleted by the editorial team or is no longer available on West Bridge News.
            </p>
          </div>
          <Link
            href="/"
            className="inline-block bg-wbn-navy hover:bg-wbn-blue text-white font-extrabold text-xs px-8 py-3.5 rounded-2xl shadow-md transition-all"
          >
            ← Return to Live Headlines & Discover
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-wbn-bg">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-6 overflow-x-auto no-scrollbar">
          <Link href="/" className="hover:text-wbn-blue flex-shrink-0">DISCOVER</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-wbn-blue uppercase flex-shrink-0">{article.category}</span>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-slate-400 line-clamp-1">{article.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
          {/* Article Interactive Client Component */}
          <ArticleClientActions article={article} officialWhatsAppLink={OFFICIAL_WHATSAPP_LINK} />

          {/* Right Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <AdBanner slotType="sidebar" />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
