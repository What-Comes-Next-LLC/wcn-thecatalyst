'use client';

import Image from 'next/image';
import Link from 'next/link';
import { deckContent } from '@/content/deckContent';
import { motion } from 'framer-motion';
import FounderNote from '@/components/ui/FounderNote';

export default function RootPage() {
  const { hero, navigation, footer, testimonials } = deckContent.root;

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
      <div className="relative max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section - Placeholder */}
        <div className="text-center mb-16">
          <motion.div
            className="bg-wcn-card backdrop-blur-wcn-card rounded-2xl px-8 py-10 border-2 border-wcn-card shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-wcn-text drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] uppercase tracking-wide mb-4">
              {hero.title}
            </h1>
            <p className="text-lg md:text-xl text-wcn-text/80 max-w-3xl mx-auto">
              {hero.subtitle}
            </p>
          </motion.div>
        </div>

        {/* Social Proof Banner */}
        <div className="relative overflow-hidden mb-16 py-4">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div key={index} className="mx-8 inline-flex items-center">
                <span className="text-wcn-text/90 italic mr-2">"{testimonial.text}"</span>
                <span className="text-wcn-accent2 font-medium">— {testimonial.author}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Three-Card Navigation with Enhanced Visual Hierarchy */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-4">
          {/* The Spark Card - Left */}
          <Link 
            href={navigation.onboard.link}
            className="group h-full relative overflow-hidden rounded-2xl bg-wcn-card backdrop-blur-wcn-card p-8 shadow-lg transition-all hover:shadow-2xl border-2 border-wcn-card hover:border-wcn-card-hover flex flex-col"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-wcn-text opacity-5 rounded-full transform translate-x-16 -translate-y-16"></div>
            <h2 className="text-2xl font-bold text-wcn-text mb-4">{navigation.onboard.heading}</h2>
            <p className="text-wcn-text/80 mb-6 flex-grow">{navigation.onboard.description}</p>
            <div className="mt-auto pt-4 border-t border-wcn-card">
              <span className="text-wcn-text font-semibold group-hover:text-wcn-accent2 transition-colors flex items-center">
                <span>Start Your Journey</span>
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </span>
            </div>
          </Link>

          {/* The Catalyst Card - Center (Featured) */}
          <Link 
            href={navigation.promo.link}
            className="group h-full relative overflow-hidden rounded-2xl p-8 shadow-xl transition-all hover:shadow-2xl border-2 border-wcn-accent1/30 hover:border-wcn-accent1/60 flex flex-col transform md:scale-105 md:-translate-y-2 z-10"
            style={{ backgroundColor: 'rgba(33, 104, 105, 0.3)', backdropFilter: 'blur(8px)' }}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-wcn-accent1 opacity-10 rounded-full transform translate-x-20 -translate-y-20"></div>
            <div className="mx-auto w-16 h-1 bg-wcn-accent1 rounded-full mb-6"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-wcn-text mb-4">What is The Catalyst?</h2>
            <p className="text-wcn-text/90 mb-6 flex-grow">{navigation.promo.description}</p>
            <div className="mt-auto pt-4 border-t border-wcn-accent1/30">
              <span className="text-wcn-text font-semibold group-hover:text-wcn-accent2 transition-colors flex items-center">
                <span>Discover Our Vision</span>
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </span>
            </div>
          </Link>

          {/* Coach's Clipboard Card - Right */}
          <Link 
            href={navigation.admin.link}
            className="group h-full relative overflow-hidden rounded-2xl bg-wcn-card backdrop-blur-wcn-card p-8 shadow-lg transition-all hover:shadow-2xl border-2 border-wcn-card hover:border-wcn-card-hover flex flex-col"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-wcn-text opacity-5 rounded-full transform translate-x-16 -translate-y-16"></div>
            <h2 className="text-2xl font-bold text-wcn-text mb-4">Coach's Clipboard</h2>
            <p className="text-wcn-text/80 mb-6 flex-grow">{navigation.admin.description}</p>
            <div className="mt-auto pt-4 border-t border-wcn-card">
              <span className="text-wcn-text font-semibold group-hover:text-wcn-accent2 transition-colors flex items-center">
                <span>Access Portal</span>
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </span>
            </div>
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

      {/* Founder's Sticky Note */}
      <FounderNote />

      {/* Add global styles for marquee animation */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </main>
  );
}