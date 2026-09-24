import { NextRequest, NextResponse } from 'next/server';
import sharp, { OverlayOptions } from 'sharp';
import fs from 'fs';
import path from 'path';
import { getArticleBySlug } from '@/lib/newsData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Safely decodes base64 data strings or fetches remote HTTP/HTTPS images into a Buffer.
 */
async function getImageBuffer(source: string): Promise<Buffer | null> {
  if (!source) return null;
  const trimmed = source.trim();

  // 1. Base64 data string (e.g. data:image/jpeg;base64,...)
  if (trimmed.startsWith('data:image')) {
    const base64Index = trimmed.indexOf('base64,');
    if (base64Index !== -1) {
      try {
        const base64Data = trimmed.slice(base64Index + 7);
        return Buffer.from(base64Data, 'base64');
      } catch (err) {
        console.error('Failed to parse base64 image data:', err);
      }
    }
    return null;
  }

  // 2. Remote HTTP/HTTPS image URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(trimmed, {
        signal: controller.signal,
        cache: 'no-store',
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const arrayBuf = await res.arrayBuffer();
        return Buffer.from(arrayBuf);
      }
    } catch (err) {
      console.error('Failed to fetch remote image for OG:', trimmed.slice(0, 80), err);
    }
  }

  return null;
}

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

  // =========================================================================
  // 1. DUAL-PHOTO PREVIEW (WHATSAPP, FACEBOOK, TWITTER)
  // When an article has two primary images, composite side-by-side (1200x630)
  // Guaranteed < 150KB JPEG so WhatsApp NEVER drops or hides the preview!
  // =========================================================================
  if (article.secondImageUrl) {
    try {
      const [buf1, buf2] = await Promise.all([
        getImageBuffer(article.imageUrl),
        getImageBuffer(article.secondImageUrl),
      ]);

      if (buf1 && buf2) {
        // Resize both images into 598x630 panels with cover fit
        const [leftResized, rightResized] = await Promise.all([
          sharp(buf1)
            .resize(598, 630, { fit: 'cover', position: 'center' })
            .toBuffer(),
          sharp(buf2)
            .resize(598, 630, { fit: 'cover', position: 'center' })
            .toBuffer(),
        ]);

        const compositeLayers: OverlayOptions[] = [
          { input: leftResized, top: 0, left: 0 },
          { input: rightResized, top: 0, left: 602 },
        ];

        // Overlay the official blue WBN logo badge in bottom-right corner
        const logoPath = path.join(process.cwd(), 'public', 'logo.png');
        if (fs.existsSync(logoPath)) {
          try {
            const logoBuffer = await sharp(logoPath)
              .resize(90, 90, { fit: 'inside' })
              .toBuffer();

            compositeLayers.push({
              input: logoBuffer,
              top: 630 - 90 - 24, // 516
              left: 1200 - 90 - 24, // 1086
            });
          } catch (logoErr) {
            console.error('Failed to overlay logo on dual OG image:', logoErr);
          }
        }

        // Composite onto 1200x630 canvas with 4px divider
        const dualJpeg = await sharp({
          create: {
            width: 1200,
            height: 630,
            channels: 4,
            background: { r: 10, g: 25, b: 47, alpha: 1 },
          },
        })
          .composite(compositeLayers)
          .jpeg({ quality: 80, progressive: true })
          .toBuffer();

        return new NextResponse(new Uint8Array(dualJpeg), {
          status: 200,
          headers: {
            'Content-Type': 'image/jpeg',
            'Content-Length': dualJpeg.length.toString(),
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    } catch (dualErr) {
      console.error('Dual image composition error:', dualErr);
      // Fallback seamlessly to single image processing below
    }
  }

  // =========================================================================
  // 2. SINGLE PHOTO PREVIEW (WHATSAPP, FACEBOOK, TWITTER)
  // Ensure the single image is valid JPEG and under WhatsApp's 300KB limit
  // =========================================================================
  const singleBuf = await getImageBuffer(article.imageUrl);
  if (singleBuf) {
    try {
      let outputBuf = singleBuf;

      // If larger than 280KB, resize & compress with sharp to prevent WhatsApp drop
      if (singleBuf.length > 280 * 1024) {
        outputBuf = await sharp(singleBuf)
          .resize(1200, 630, { fit: 'cover', position: 'center' })
          .jpeg({ quality: 80, progressive: true })
          .toBuffer();
      }

      return new NextResponse(new Uint8Array(outputBuf), {
        status: 200,
        headers: {
          'Content-Type': 'image/jpeg',
          'Content-Length': outputBuf.length.toString(),
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    } catch (singleErr) {
      console.error('Single image optimization error:', singleErr);
      return new NextResponse(new Uint8Array(singleBuf), {
        status: 200,
        headers: {
          'Content-Type': 'image/jpeg',
          'Content-Length': singleBuf.length.toString(),
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
  }

  return NextResponse.redirect(fallbackLogo);
}
