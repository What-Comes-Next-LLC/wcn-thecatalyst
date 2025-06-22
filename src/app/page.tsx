'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { siteContent } from '@/content/siteContent';

export default function HomePage() {
  const { homepage } = siteContent;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative py-24">
        <div className="container-wide text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight text-heading">
              {homepage.hero.title}
            </h1>
            <p className="text-xl md:text-3xl mb-10 text-body font-medium leading-relaxed">
              {homepage.hero.subtitle}
            </p>
            <p className="text-lg md:text-xl mb-12 text-muted max-w-3xl mx-auto leading-relaxed">
              {homepage.hero.description}
            </p>
            <Link
              href="/the-spark"
              className="btn-primary text-xl px-8 py-4"
            >
              {homepage.finalCta.buttonText}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="container-wide">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-heading">
            {homepage.howItWorks.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {homepage.howItWorks.steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center group"
              >
                <div className="w-20 h-20 rounded-full bg-wcn-primary text-white font-bold text-2xl flex items-center justify-center mx-auto mb-6 shadow-button group-hover:shadow-button-hover transition-all duration-200">
                  {step.step}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-heading">{step.title}</h3>
                <p className="text-body text-lg leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-slate-50">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-heading">{homepage.pricing.title}</h2>
            <p className="text-xl md:text-2xl text-body leading-relaxed">{homepage.pricing.subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {homepage.pricing.tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`group relative ${
                  tier.primary 
                    ? 'transform lg:scale-110 z-10' 
                    : ''
                }`}
              >
                <div className={`card-interactive p-8 h-full flex flex-col ${
                  tier.primary 
                    ? 'border-wcn-primary bg-wcn-primary/5' 
                    : ''
                }`}>
                  {tier.primary && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-wcn-primary text-white px-6 py-2 rounded-full text-sm font-semibold shadow-button">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center flex-grow">
                    <h3 className="text-3xl font-bold mb-4 text-heading">{tier.name}</h3>
                    <div className="text-5xl font-bold text-wcn-primary mb-4">
                      {tier.price}
                    </div>
                    <p className="text-body mb-8 text-lg leading-relaxed">{tier.description}</p>
                    
                    <ul className="space-y-4 mb-10 text-left">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-wcn-accent1 mr-3 text-xl font-bold">✓</span>
                          <span className="text-body">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Link
                    href="/the-spark"
                    className={tier.primary ? 'btn-primary w-full text-center py-4' : 'btn-secondary w-full text-center py-4'}
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
      <section className="py-24 bg-white">
        <div className="container-wide">
          <div className="grid md:grid-cols-3 gap-10">
            {homepage.testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="card-interactive p-8"
              >
                <div className="text-center">
                  <p className="text-body text-lg italic mb-6 leading-relaxed">"{testimonial.text}"</p>
                  <p className="text-wcn-primary font-semibold text-lg">— {testimonial.author}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-slate-50">
        <div className="container-narrow text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-heading">{homepage.finalCta.title}</h2>
          <p className="text-xl md:text-2xl text-body mb-12 leading-relaxed">{homepage.finalCta.subtitle}</p>
          <Link
            href="/the-spark"
            className="btn-primary text-2xl px-12 py-6"
          >
            {homepage.finalCta.buttonText}
          </Link>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="border-t border-slate-200 py-12 bg-white">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-body">{siteContent.footer.tagline}</p>
              <p className="text-muted text-sm">{siteContent.footer.company}</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/about" className="text-muted hover:text-wcn-primary transition-colors duration-200">
                {siteContent.navigation.about}
              </Link>
              <Link href="/foundersletter" className="text-muted hover:text-wcn-primary transition-colors duration-200">
                {siteContent.navigation.founderLetter}
              </Link>
              <Link href="/signin" className="text-muted hover:text-wcn-primary transition-colors duration-200">
                {siteContent.navigation.signin}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}