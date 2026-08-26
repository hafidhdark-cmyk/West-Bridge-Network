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
    default: 'West Bridge Network | Journalistic Integrity & Speed',
    template: '%s | West Bridge Network',
  },
  description:
    'West Bridge Network (WBN) is a premier digital news platform committed to speed, accuracy, and investigative integrity across West Africa and global news.',
  keywords: [
    'West Bridge Network',
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
  authors: [{ name: 'West Bridge Network Editorial Bureau' }],
  creator: 'West Bridge Network',
  publisher: 'West Bridge Network',
  verification: {
    google: 'nVuO_Wn6aelyV49YJjDb_4cjVXvW_sAP4KUNCnrKMwQ',
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
    siteName: 'West Bridge Network',
    title: 'West Bridge Network | Journalistic Integrity & Speed',
    description:
      'Premier digital news platform committed to speed, accuracy, and investigative integrity across West Africa.',
    images: [
      {
        url: 'https://westbridgenews.com/logo.png',
        width: 800,
        height: 800,
        alt: 'West Bridge Network Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'West Bridge Network | Journalistic Integrity & Speed',
    description:
      'Premier digital news platform committed to speed, accuracy, and investigative integrity across West Africa.',
    images: ['https://westbridgenews.com/logo.png'],
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
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
    'name': 'West Bridge Network',
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
    'name': 'West Bridge Network',
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
        <meta name="google-site-verification" content="nVuO_Wn6aelyV49YJjDb_4cjVXvW_sAP4KUNCnrKMwQ" />
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
