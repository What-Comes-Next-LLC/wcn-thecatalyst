'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { siteContent } from '@/content/siteContent';

export default function HomePage() {
  const { homepage } = siteContent;

  return (
    <main className="min-h-screen bg-gradient-to-b from-wcn-primary via-wcn-dark to-black text-wcn-text">
      {/* Hero Section */}
      <section className="relative px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {homepage.hero.title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-wcn-text/90">
              {homepage.hero.subtitle}
            </p>
            <p className="text-lg mb-12 text-wcn-text/80 max-w-2xl mx-auto">
              {homepage.hero.description}
            </p>
            <Link
              href="/the-spark"
              className="inline-block bg-wcn-accent1 hover:bg-wcn-accent2 text-wcn-dark font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-200"
            >
              {homepage.finalCta.buttonText}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-16 bg-wcn-dark/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            {homepage.howItWorks.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {homepage.howItWorks.steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-wcn-primary text-wcn-text font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-wcn-text/80">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{homepage.pricing.title}</h2>
            <p className="text-xl text-wcn-text/80">{homepage.pricing.subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {homepage.pricing.tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-wcn-card backdrop-blur-sm rounded-xl p-6 border-2 ${
                  tier.primary 
                    ? 'border-wcn-accent1 transform scale-105' 
                    : 'border-wcn-card'
                }`}
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <div className="text-3xl font-bold text-wcn-accent1 mb-2">
                    {tier.price}
                  </div>
                  <p className="text-wcn-text/80 mb-6">{tier.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <span className="text-wcn-accent2 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    href="/the-spark"
                    className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
                      tier.primary
                        ? 'bg-wcn-accent1 hover:bg-wcn-accent2 text-wcn-dark'
                        : 'bg-wcn-primary hover:bg-wcn-accent1 text-wcn-text'
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-4 py-16 bg-wcn-dark/50">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {homepage.testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <p className="text-wcn-text/90 italic mb-4">"{testimonial.text}"</p>
                <p className="text-wcn-accent2 font-medium">— {testimonial.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{homepage.finalCta.title}</h2>
          <p className="text-xl text-wcn-text/80 mb-8">{homepage.finalCta.subtitle}</p>
          <Link
            href="/the-spark"
            className="inline-block bg-wcn-accent1 hover:bg-wcn-accent2 text-wcn-dark font-semibold px-8 py-4 rounded-lg text-xl transition-colors duration-200"
          >
            {homepage.finalCta.buttonText}
          </Link>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="border-t border-wcn-card px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-wcn-text/80">{siteContent.footer.tagline}</p>
              <p className="text-wcn-text/60 text-sm">{siteContent.footer.company}</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/about" className="text-wcn-text/80 hover:text-wcn-accent1 transition-colors">
                {siteContent.navigation.about}
              </Link>
              <Link href="/foundersletter" className="text-wcn-text/80 hover:text-wcn-accent1 transition-colors">
                {siteContent.navigation.founderLetter}
              </Link>
              <Link href="/signin" className="text-wcn-text/80 hover:text-wcn-accent1 transition-colors">
                {siteContent.navigation.signin}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}