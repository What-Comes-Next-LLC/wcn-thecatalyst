import type { Metadata } from "next";
import { Inter, Playfair_Display } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from '@/contexts/AuthContext';
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://whatcomesnextllc.ai'),
  title: "What Comes Next - The Only Way Out Is Through",
  description: "Start logging. Get a plan. Choose your path. Join our privacy-first coaching platform that empowers real trainers with AI tools for lasting habit change.",
  keywords: ["coaching", "fitness", "nutrition", "habits", "personal trainer", "AI coaching", "habit tracking"],
  authors: [{ name: "What Comes Next, LLC" }],
  creator: "What Comes Next, LLC",
  publisher: "What Comes Next, LLC",
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'What Comes Next',
    title: 'What Comes Next - The Only Way Out Is Through',
    description: 'Start logging. Get a plan. Choose your path. Privacy-first coaching platform empowering real trainers.',
    url: 'https://whatcomesnextllc.ai',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'What Comes Next - The Only Way Out Is Through',
        type: 'image/png',
      }
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    site: '@whatcomesnextllc',
    creator: '@whatcomesnextllc', 
    title: 'What Comes Next - The Only Way Out Is Through',
    description: 'Start logging. Get a plan. Choose your path.',
    images: ['/og-image.png'],
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
  
  verification: {
    google: 'google-site-verification-code', // Add your Google Search Console verification code
  },
  
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        rel: 'android-chrome-512x512', 
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  },
  
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
