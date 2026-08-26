import { MetadataRoute } from 'next';
import { fetchArticlesFromSupabase } from '@/lib/newsData';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://westbridgenews.com';

  // Fetch all live articles from Supabase PostgreSQL
  const articles = await fetchArticlesFromSupabase();

  const articleUrls: MetadataRoute.Sitemap = articles.map((art) => ({
    url: `${baseUrl}/news/${art.slug}`,
    lastModified: art.createdAtRaw ? new Date(art.createdAtRaw) : new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/admin`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.2,
    },
    ...articleUrls,
  ];
}
