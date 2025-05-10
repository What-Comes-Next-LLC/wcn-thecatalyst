'use client';

import Image from 'next/image';
import Link from 'next/link';
import { deckContent } from '@/content/deckContent';
import { motion } from 'framer-motion';

export default function RootPage() {
  const { hero, navigation, footer } = deckContent.root;

  return (
    <main className="min-h-screen bg-wcn-gradient from-wcn-primary to-wcn-accent1 relative overflow-hidden">
      {/* Watermark Logo */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute inset-0 bg-wcn-primary/5"></div>
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={hero.image}
            alt="What Comes Next Logo"
            fill
            className="object-contain opacity-[0.15] mix-blend-overlay"
            priority
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-16">
        {/* Welcome Message */}
        <div className="text-center mb-16 space-y-4">
          <Link href="/the-spark" passHref legacyBehavior>
            <motion.a
              className="inline-block bg-wcn-card backdrop-blur-wcn-card rounded-2xl px-8 py-6 border-2 border-wcn-card shadow-lg cursor-pointer transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-wcn-accent1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              tabIndex={0}
            >
              <div className="mx-auto w-16 h-1 bg-wcn-accent1 rounded-full mb-6"></div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-wcn-text drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] uppercase tracking-wide">
                {hero.title}
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-wcn-text/80 max-w-2xl mx-auto mt-4">
                {hero.subtitle}
              </p>
            </motion.a>
          </Link>
        </div>

        {/* Navigation Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {/* Onboarding Card */}
          <Link 
            href={navigation.onboard.link}
            className="group relative overflow-hidden rounded-2xl bg-wcn-card backdrop-blur-wcn-card p-8 shadow-lg transition-all hover:shadow-2xl border-2 border-wcn-card hover:border-wcn-card-hover"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-wcn-text opacity-5 rounded-full transform translate-x-16 -translate-y-16"></div>
            <h2 className="text-2xl font-bold text-wcn-text mb-4">{navigation.onboard.heading}</h2>
            <p className="text-wcn-text/80 mb-6">{navigation.onboard.description}</p>
            <span className="text-wcn-text font-semibold group-hover:text-wcn-accent2 transition-colors">
              Get Started →
            </span>
          </Link>

          {/* Promo/About Card */}
          <Link 
            href={navigation.promo.link}
            className="group relative overflow-hidden rounded-2xl bg-wcn-card backdrop-blur-wcn-card p-8 shadow-lg transition-all hover:shadow-2xl border-2 border-wcn-card hover:border-wcn-card-hover"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-wcn-text opacity-5 rounded-full transform translate-x-16 -translate-y-16"></div>
            <h2 className="text-2xl font-bold text-wcn-text mb-4">{navigation.promo.heading}</h2>
            <p className="text-wcn-text/80 mb-6">{navigation.promo.description}</p>
            <span className="text-wcn-text font-semibold group-hover:text-wcn-accent2 transition-colors">
              Learn More →
            </span>
          </Link>

          {/* Admin Portal Card - Inverted Colors */}
          <Link 
            href={navigation.admin.link}
            className="group relative overflow-hidden rounded-2xl backdrop-blur-wcn-card p-8 shadow-lg transition-all hover:shadow-2xl border-2 border-wcn-card hover:border-wcn-card-hover"
            style={{ backgroundColor: 'rgba(33,104,105,0.5)' }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-wcn-text opacity-5 rounded-full transform translate-x-16 -translate-y-16"></div>
            <h2 className="text-2xl font-bold text-wcn-text mb-4">Coach's Clipboard</h2>
            <p className="text-wcn-text/80 mb-6">{navigation.admin.description}</p>
            <span className="text-wcn-text font-semibold group-hover:text-wcn-accent2 transition-colors">
              Access Portal →
            </span>
          </Link>
        </div>

        {/* Inspirational Footer */}
        <div className="text-center mt-20 space-y-4">
          <p className="text-wcn-text/80 italic text-lg">
            "{footer.quote}"
          </p>
          <Link 
            href="/about"
            className="text-wcn-text/50 text-sm hover:text-wcn-text transition-all cursor-pointer relative group"
          >
            <span className="absolute inset-0 bg-wcn-text/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out"></span>
            <span className="relative">About Our Company</span>
          </Link>
        </div>
      </div>
    </main>
  );
}