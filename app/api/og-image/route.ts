import { NextRequest, NextResponse } from 'next/server';
import { getArticleBySlug } from '@/lib/newsData';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.redirect('https://west-bridge-network.vercel.app/logo.png');
  }

  const article = await getArticleBySlug(slug);
  if (!article || !article.imageUrl) {
    return NextResponse.redirect('https://west-bridge-network.vercel.app/logo.png');
  }

  // If already an absolute HTTPS URL (e.g. Unsplash or Supabase Storage URL)
  if (article.imageUrl.startsWith('http://') || article.imageUrl.startsWith('https://')) {
    return NextResponse.redirect(article.imageUrl);
  }

  // If base64 data string (data:image/png;base64,...)
  if (article.imageUrl.startsWith('data:image')) {
    try {
      const matches = article.imageUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');

        return new NextResponse(buffer, {
          headers: {
            'Content-Type': mimeType,
            'Content-Length': buffer.length.toString(),
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    } catch (e) {
      console.error('Base64 image conversion error:', e);
    }
  }

  return NextResponse.redirect('https://west-bridge-network.vercel.app/logo.png');
}
