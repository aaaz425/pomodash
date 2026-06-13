import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Pomodash — 포모도로 타이머',
  description:
    '작업 계획, 포모도로 집중, 공부 기록을 한 곳에서. 수험생과 취업준비생을 위한 무료 집중 타이머.',
  keywords: ['포모도로 타이머', '공부 타이머', '집중 타이머', '포모도로 기법', '무료 공부 도구'],
  authors: [{ name: 'Pomodash' }],
  openGraph: {
    title: 'Pomodash — 포모도로 타이머',
    description: '작업 계획, 포모도로 집중, 공부 기록을 한 곳에서.',
    url: 'https://pomodash.vercel.app',
    siteName: 'Pomodash',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pomodash — 포모도로 타이머',
    description: '수험생과 취업준비생을 위한 무료 집중 타이머.',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#0f172a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
