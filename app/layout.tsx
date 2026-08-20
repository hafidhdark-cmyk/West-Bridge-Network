import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'West Bridge Network (WBN) | Truth • Speed • Reach',
  description: 'West Africa premier ecosystem of information, breaking news, politics, business, tech, and security updates.',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico', sizes: '48x48' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'West Bridge Network (WBN)',
    description: 'Discover breaking news, politics, business, tech, and security across West Africa.',
    siteName: 'West Bridge Network',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-wbn-blue selection:text-white">
        {children}
      </body>
    </html>
  );
}
