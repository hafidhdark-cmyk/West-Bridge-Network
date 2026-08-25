import React from 'react';
import type { Metadata } from 'next';
import ArticlePageClient from './ArticlePageClient';
import { getArticleBySlug } from '@/lib/newsData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ArticleDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ArticleDetailPageProps): Promise<Metadata> {
  const siteUrl = 'https://west-bridge-network.vercel.app';
  const slug = params?.slug || '';
  const article = await getArticleBySlug(slug);

  // Fallback defaults if article is not found in database during server crawl
  const pageTitle = article ? `${article.title} | West Bridge Network` : 'West Bridge Network | Journalistic Integrity & Speed';
  const pageDescription = article?.summary || 'Read top journalistic reports, breaking news, and investigative coverage across West Africa on West Bridge Network.';
  const canonicalUrl = `${siteUrl}/news/${slug}`;

  // WhatsApp & Social Platforms require an absolute https:// image URL (never a data:image base64 string)
  // Our dedicated og-image.jpg proxy endpoint converts base64/external photos into a clean binary JPEG image!
  const ogImageUrl = `${siteUrl}/api/og-image.jpg?slug=${slug}`;

  return {
    metadataBase: new URL(siteUrl),
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      siteName: 'West Bridge Network',
      images: [
        {
          url: ogImageUrl,
          secureUrl: ogImageUrl,
          width: 1200,
          height: 630,
          alt: article?.title || 'West Bridge Network News Report',
          type: 'image/jpeg',
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [ogImageUrl],
      site: '@WestBridgeNet',
    },
    other: {
      'og:image:secure_url': ogImageUrl,
      'og:image:type': 'image/jpeg',
      'og:image:width': '1200',
      'og:image:height': '630',
    },
  };
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const slug = params?.slug;
  const initialArticle = await getArticleBySlug(slug);

  return <ArticlePageClient slug={slug} initialArticle={initialArticle} />;
}
