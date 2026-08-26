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
  const siteUrl = 'https://westbridgenews.com';
  const slug = params?.slug || '';
  const article = await getArticleBySlug(slug);

  const pageTitle = article ? `${article.title} | West Bridge Network` : 'West Bridge Network | Journalistic Integrity & Speed';
  const pageDescription = article?.summary || 'Read top journalistic reports, breaking news, and investigative coverage across West Africa on West Bridge Network.';
  const canonicalUrl = `${siteUrl}/news/${slug}`;

  // Dedicated og-image.jpg binary JPEG endpoint for WhatsApp, Facebook, and Twitter link preview cards
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
  const siteUrl = 'https://westbridgenews.com';
  const initialArticle = await getArticleBySlug(slug);

  const jsonLdArticle = initialArticle
    ? {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: initialArticle.title,
        description: initialArticle.summary,
        image: [initialArticle.imageUrl || `${siteUrl}/logo.png`],
        datePublished: initialArticle.createdAtRaw || new Date().toISOString(),
        dateModified: initialArticle.createdAtRaw || new Date().toISOString(),
        author: {
          '@type': 'Organization',
          name: 'West Bridge Network',
          url: siteUrl,
        },
        publisher: {
          '@type': 'Organization',
          name: 'West Bridge Network',
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/logo.png`,
          },
        },
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': `${siteUrl}/news/${initialArticle.slug}`,
        },
      }
    : null;

  return (
    <>
      {jsonLdArticle && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
        />
      )}
      <ArticlePageClient slug={slug} initialArticle={initialArticle} />
    </>
  );
}
