import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import AdBanner from '@/components/AdBanner';
import ArticleClientActions from './ArticleClientActions';
import { getArticleBySlug } from '@/lib/newsData';
import { ChevronRight, FileX } from 'lucide-react';

const OFFICIAL_WHATSAPP_LINK = "https://chat.whatsapp.com/FSqZA2tOXbv0luyOPa7iKD?s=cl&p=a&ilr=4";

interface ArticleDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ArticleDetailPageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  const siteUrl = 'https://west-bridge-network.vercel.app';

  if (!article) {
    return {
      title: 'Article Removed | West Bridge Network',
      description: 'The requested news report has been removed or is no longer available.',
    };
  }

  const fullUrl = `${siteUrl}/news/${article.slug}`;

  // WhatsApp crawler requires absolute public HTTPS image URL.
  // If base64 or local upload, proxy via /api/og-image?slug=...
  let ogImageUrl = article.imageUrl;
  if (!ogImageUrl || ogImageUrl.startsWith('data:image')) {
    ogImageUrl = `${siteUrl}/api/og-image?slug=${article.slug}`;
  }

  return {
    title: `${article.title} | West Bridge Network`,
    description: article.summary,
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: article.title,
      description: article.summary,
      url: fullUrl,
      siteName: 'West Bridge Network',
      images: [
        {
          url: ogImageUrl,
          secureUrl: ogImageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
          type: 'image/jpeg',
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
      images: [ogImageUrl],
      site: '@WestBridgeNet',
    },
  };
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const slug = params?.slug;
  const article = await getArticleBySlug(slug);
  const siteUrl = 'https://west-bridge-network.vercel.app';

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
              The news report you are looking for has been deleted by the editorial team or is no longer available on West Bridge Network.
            </p>
          </div>
          <Link
            href="/"
            className="inline-block bg-wbn-navy hover:bg-wbn-blue text-white font-extrabold text-xs px-8 py-3.5 rounded-2xl shadow-md transition-all"
          >
            ← Return to Live Headlines & Discover
          </Link>
        </main>

        <footer className="bg-wbn-navy text-slate-300 text-xs py-10 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500">
            © 2026 West Bridge Network (WBN). All rights reserved.
          </div>
        </footer>
      </div>
    );
  }

  let ogImageUrl = article.imageUrl;
  if (!ogImageUrl || ogImageUrl.startsWith('data:image')) {
    ogImageUrl = `${siteUrl}/api/og-image?slug=${article.slug}`;
  }

  return (
    <div className="min-h-screen flex flex-col bg-wbn-bg">
      {/* Explicit Raw HTML Meta Tags for WhatsApp Crawler */}
      <head>
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.summary} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:secure_url" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:url" content={`${siteUrl}/news/${article.slug}`} />
        <meta property="og:site_name" content="West Bridge Network" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.summary} />
        <meta name="twitter:image" content={ogImageUrl} />
      </head>

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

          {/* Right Sidebar (Col 3) */}
          <aside className="lg:col-span-3 space-y-6">
            <AdBanner slotType="sidebar" />
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-wbn-navy text-slate-300 text-xs py-10 mt-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500">
          © 2026 West Bridge Network (WBN). All rights reserved.
        </div>
      </footer>
    </div>
  );
}
