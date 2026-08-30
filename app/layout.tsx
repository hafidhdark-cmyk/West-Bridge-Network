import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#0F172A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://westbridgenews.com'),
  title: {
    default: 'West Bridge News | Journalistic Integrity & Speed',
    template: '%s | West Bridge News',
  },
  description:
    'West Bridge News (WBN) is a premier digital news platform committed to speed, accuracy, and investigative integrity across West Africa and global news.',
  keywords: [
    'West Bridge News',
    'WBN News',
    'Nigeria News',
    'West Africa Headlines',
    'Breaking News',
    'African Tech',
    'ECOWAS',
    'African Business',
    'Super Eagles',
    'Nollywood',
    'Security',
    'Lifestyle',
  ],
  authors: [{ name: 'West Bridge News Editorial Bureau' }],
  creator: 'West Bridge News',
  publisher: 'West Bridge News',
  other: {
    'google-adsense-account': 'ca-pub-2586916860240984',
  },
  verification: {
    google: '8H9PnX15pMnyrklgt50-6imvO_AzOTI2A_q56z7hnMU',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://westbridgenews.com',
    siteName: 'West Bridge News',
    title: 'West Bridge News | Journalistic Integrity & Speed',
    description:
      'Premier digital news platform committed to speed, accuracy, and investigative integrity across West Africa.',
    images: [
      {
        url: 'https://westbridgenews.com/logo.png',
        width: 800,
        height: 800,
        alt: 'West Bridge News Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'West Bridge News | Journalistic Integrity & Speed',
    description:
      'Premier digital news platform committed to speed, accuracy, and investigative integrity across West Africa.',
    images: ['https://westbridgenews.com/logo.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/android-chrome-192x192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdOrg = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    'name': 'West Bridge News',
    'url': 'https://westbridgenews.com',
    'logo': 'https://westbridgenews.com/logo.png',
    'sameAs': [
      'https://chat.whatsapp.com/FSqZA2tOXbv0luyOPa7iKD?s=cl&p=a&ilr=4'
    ],
    'publishingPrinciples': 'https://westbridgenews.com/#editorial-policy'
  };

  const jsonLdWebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'West Bridge News',
    'url': 'https://westbridgenews.com',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://westbridgenews.com/?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="8H9PnX15pMnyrklgt50-6imvO_AzOTI2A_q56z7hnMU" />
        <meta name="google-adsense-account" content="ca-pub-2586916860240984" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2586916860240984"
          crossOrigin="anonymous"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/android-chrome-192x192.png" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Lora:ital,wght@0,500;0,600;0,700;1,600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body className="antialiased bg-[#FAFAF9] text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
