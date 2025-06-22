import type { Metadata } from "next";
import { Inter, Playfair_Display } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
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
  title: "The Catalyst | AI-Powered Coaching Platform for Personal Trainers and Men Over 40",
  description: "The Catalyst is a privacy-first coaching platform built to empower certified personal trainers and men over 40 with AI-assisted tools for fitness, nutrition, and long-term habit change. Developed by What Comes Next? LLC, The Catalyst combines adaptive planning, client tracking, and real-time insights without sacrificing data privacy.",
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
        {children}
        <Analytics />
      </body>
    </html>
  );
}
