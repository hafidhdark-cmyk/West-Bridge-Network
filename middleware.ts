import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  // 1. Rewrite admin.westbridgenews.com directly to /admin Publisher Admin Studio
  if (hostname.startsWith('admin.')) {
    if (url.pathname === '/') {
      url.pathname = '/admin';
      return NextResponse.rewrite(url);
    }
  }

  // 2. Redirect old .vercel.app domain to official domain https://westbridgenews.com
  if (hostname.includes('vercel.app')) {
    url.host = 'westbridgenews.com';
    url.protocol = 'https';
    url.port = '';
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files, _next, favicon.ico, logo.png
     */
    '/((?!_next/static|_next/image|favicon.ico|logo.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
