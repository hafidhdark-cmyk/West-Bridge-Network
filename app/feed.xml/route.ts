import { NextResponse } from 'next/server';
import { fetchArticlesFromSupabase } from '@/lib/newsData';

export async function GET() {
  const siteUrl = 'https://westbridgenews.com';
  const articles = await fetchArticlesFromSupabase(50);

  const feedItemsXml = articles
    .map((art) => {
      const pubDate = art.createdAtRaw
        ? new Date(art.createdAtRaw).toUTCString()
        : new Date().toUTCString();

      const articleUrl = `${siteUrl}/news/${art.slug}`;

      return `
    <item>
      <title><![CDATA[${art.title}]]></title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <description><![CDATA[${art.summary}]]></description>
      <category><![CDATA[${art.category}]]></category>
      <pubDate>${pubDate}</pubDate>
      ${art.imageUrl ? `<media:content url="${art.imageUrl}" medium="image" />` : ''}
    </item>`;
    })
    .join('');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>West Bridge Network | Live News Feed</title>
    <link>${siteUrl}</link>
    <description>Premier digital news platform committed to speed, accuracy, and investigative integrity across West Africa.</description>
    <language>en-us</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${feedItemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=600, stale-while-revalidate=60',
    },
  });
}
