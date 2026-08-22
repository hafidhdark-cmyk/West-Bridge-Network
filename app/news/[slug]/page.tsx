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
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return {
      metadataBase: new URL(siteUrl),
      title: 'News Report | West Bridge Network',
      description: 'Read top journalistic reports and breaking news across West Africa on West Bridge Network.',
    };
  }

  const fullUrl = `${siteUrl}/news/${article.slug}`;
  const ogImageUrl = `${siteUrl}/api/og-image.jpg?slug=${article.slug}`;

  return {
    metadataBase: new URL(siteUrl),
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
  const initialArticle = await getArticleBySlug(slug);

  return <ArticlePageClient slug={slug} initialArticle={initialArticle} />;
}
