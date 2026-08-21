import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#0F172A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://west-bridge-network.vercel.app'),
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
  ],
  authors: [{ name: 'West Bridge Network Editorial Bureau' }],
  creator: 'West Bridge Network',
  publisher: 'West Bridge Network',
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
    url: 'https://west-bridge-network.vercel.app',
    siteName: 'West Bridge Network',
    title: 'West Bridge Network | Journalistic Integrity & Speed',
    description:
      'Premier digital news platform committed to speed, accuracy, and investigative integrity across West Africa.',
    images: [
      {
        url: 'https://west-bridge-network.vercel.app/logo.png',
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
    images: ['https://west-bridge-network.vercel.app/logo.png'],
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
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#FAFAF9] text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
