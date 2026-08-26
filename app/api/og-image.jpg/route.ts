import { NextRequest, NextResponse } from 'next/server';
import { getArticleBySlug } from '@/lib/newsData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const fallbackLogo = 'https://westbridgenews.com/logo.png';

  if (!slug) {
    return NextResponse.redirect(fallbackLogo);
  }

  const article = await getArticleBySlug(slug);
  if (!article || !article.imageUrl) {
    return NextResponse.redirect(fallbackLogo);
  }

  // 1. External HTTPS image URL (e.g., Unsplash) -> fetch & stream binary image/jpeg
  if (article.imageUrl.startsWith('http://') || article.imageUrl.startsWith('https://')) {
    try {
      const res = await fetch(article.imageUrl, { cache: 'no-store' });
      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return new NextResponse(buffer, {
          headers: {
            'Content-Type': 'image/jpeg',
            'Content-Length': buffer.length.toString(),
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    } catch (e) {
      console.error('Failed to proxy external image for WhatsApp:', e);
    }
    return NextResponse.redirect(article.imageUrl);
  }

  // 2. Base64 data string (Uploaded from device)
  if (article.imageUrl.startsWith('data:image')) {
    try {
      const matches = article.imageUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');

        return new NextResponse(buffer, {
          headers: {
            'Content-Type': 'image/jpeg',
            'Content-Length': buffer.length.toString(),
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    } catch (e) {
      console.error('Base64 image conversion error for WhatsApp:', e);
    }
  }

  return NextResponse.redirect(fallbackLogo);
}
