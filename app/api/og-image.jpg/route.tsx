import React from 'react';
import { NextRequest, NextResponse } from 'next/server';
import { ImageResponse } from 'next/og';
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

  // 1. DUAL-PHOTO WHATSAPP & SOCIAL PREVIEW
  // If the article has a secondImageUrl, composite both photos side-by-side into a 1200x630 card
  if (article.secondImageUrl) {
    try {
      return new ImageResponse(
        (
          <div
            style={{
              display: 'flex',
              width: '1200px',
              height: '630px',
              position: 'relative',
              backgroundColor: '#0a192f',
              overflow: 'hidden',
            }}
          >
            {/* Left Photo (Main 1) */}
            <div
              style={{
                display: 'flex',
                width: '598px',
                height: '630px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.imageUrl}
                alt="Main 1"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>

            {/* Middle Divider */}
            <div
              style={{
                width: '4px',
                height: '630px',
                backgroundColor: '#ffffff',
                zIndex: 10,
              }}
            />

            {/* Right Photo (Main 2) */}
            <div
              style={{
                display: 'flex',
                width: '598px',
                height: '630px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.secondImageUrl}
                alt="Main 2"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>

            {/* Bottom Official WBN Brand Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '24px',
                left: '24px',
                right: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 24px',
                backgroundColor: 'rgba(10, 25, 47, 0.92)',
                borderRadius: '16px',
                border: '2px solid rgba(255, 255, 255, 0.25)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#ef4444',
                  }}
                />
                <span
                  style={{
                    fontSize: '22px',
                    fontWeight: 900,
                    color: '#ffffff',
                    letterSpacing: '2px',
                  }}
                >
                  WEST BRIDGE NEWS
                </span>
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#60a5fa',
                    marginLeft: '8px',
                    padding: '4px 10px',
                    backgroundColor: 'rgba(37, 99, 235, 0.2)',
                    borderRadius: '8px',
                  }}
                >
                  {article.category.toUpperCase()}
                </span>
              </div>

              <span
                style={{
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#e2e8f0',
                }}
              >
                SPECIAL REPORT
              </span>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    } catch (e) {
      console.error('Dual image composition error:', e);
    }
  }

  // 2. SINGLE PHOTO WITH WBN BADGE (or fallback to binary stream)
  // External HTTPS image URL -> fetch & stream binary image
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

  // 3. Base64 data string (Uploaded from device)
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
