import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_COOKIE_NAME, isValidAdminSessionToken } from './lib/adminAuth';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  // 1. NEVER intercept, block, or rewrite API routes (login, logout, og-image, etc.)
  if (url.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // 2. Rewrite admin.westbridgenews.com directly to /admin Publisher Admin Studio
  if (hostname.startsWith('admin.')) {
    if (url.pathname === '/' || url.pathname === '') {
      url.pathname = '/admin';
    } else if (url.pathname === '/login') {
      url.pathname = '/admin/login';
    } else if (!url.pathname.startsWith('/admin')) {
      url.pathname = `/admin${url.pathname}`;
    }
  }

  // 3. Admin Authentication Gate for /admin routes
  // (All public news pages, articles, sitemaps, RSS feeds remain 100% open for Google AdSense bots)
  if (url.pathname.startsWith('/admin')) {
    // Whitelist the login portal itself
    if (url.pathname === '/admin/login') {
      // If already logged in with a valid session, redirect to /admin studio
      const sessionToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
      if (isValidAdminSessionToken(sessionToken)) {
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      }
      return hostname.startsWith('admin.') ? NextResponse.rewrite(url) : NextResponse.next();
    }

    // Check for valid session token
    const sessionToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!isValidAdminSessionToken(sessionToken)) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('returnUrl', url.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If rewritten for admin subdomain
  if (hostname.startsWith('admin.')) {
    return NextResponse.rewrite(url);
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
