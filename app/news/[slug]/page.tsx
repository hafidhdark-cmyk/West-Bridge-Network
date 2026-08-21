import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import AdBanner from '@/components/AdBanner';
import ArticleClientActions from './ArticleClientActions';
import { getArticleBySlug } from '@/lib/newsData';
import { ChevronRight } from 'lucide-react';

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
      title: 'West Bridge Network | News Report',
      description: 'Premier digital news platform committed to speed and accuracy across West Africa.',
    };
  }

  const fullUrl = `${siteUrl}/news/${article.slug}`;

  // Ensure image is a valid absolute HTTPS URL for WhatsApp crawler
  let validImageUrl = article.imageUrl;
  if (!validImageUrl || validImageUrl.startsWith('data:image')) {
    validImageUrl = `${siteUrl}/logo.png`;
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
          url: validImageUrl,
          secureUrl: validImageUrl,
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
      images: [validImageUrl],
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

  let validImageUrl = article.imageUrl;
  if (!validImageUrl || validImageUrl.startsWith('data:image')) {
    validImageUrl = `${siteUrl}/logo.png`;
  }

  return (
    <div className="min-h-screen flex flex-col bg-wbn-bg">
      {/* Explicit Raw HTML Meta Tags for WhatsApp Crawler */}
      <head>
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.summary} />
        <meta property="og:image" content={validImageUrl} />
        <meta property="og:image:secure_url" content={validImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:url" content={`${siteUrl}/news/${article.slug}`} />
        <meta property="og:site_name" content="West Bridge Network" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.summary} />
        <meta name="twitter:image" content={validImageUrl} />
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
