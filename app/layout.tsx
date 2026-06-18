import type { Metadata, Viewport } from 'next';
import { Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { siteConfig, siteUrl } from '@/lib/site';
import './globals.css';

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name }],
  icons: {
    icon: [{ url: '/icon', type: 'image/png' }],
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.ogDescription,
    url: siteUrl,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.twitterDescription,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark" suppressHydrationWarning>
      <body className={`${geistMono.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
