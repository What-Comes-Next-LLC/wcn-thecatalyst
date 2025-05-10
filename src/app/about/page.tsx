'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { deckContent } from '@/content/deckContent';

export default function AboutPage() {
  const router = useRouter();
  const { company, founder } = deckContent.about;

  return (
    <div className="min-h-screen bg-wcn-gradient from-wcn-accent1 to-wcn-primary relative overflow-hidden">
      {/* Watermark Logo */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute inset-0 bg-wcn-primary/5"></div>
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/logo-official.png"
            alt="What Comes Next Logo"
            fill
            className="object-contain opacity-[0.15] mix-blend-overlay"
            priority
          />
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={() => router.back()}
        className="fixed top-6 right-6 text-wcn-text/50 hover:text-wcn-text transition-colors z-50"
      >
        ✕
      </button>

      {/* Company Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Company Hero */}
          <div className="relative h-[400px] rounded-2xl overflow-hidden mb-12">
            <Image
              src={company.hero.image}
              alt={company.hero.imageAlt}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-wcn-dark/40 flex items-center justify-center">
              <h1 className="text-6xl font-bold text-wcn-text text-center">
                {company.hero.title}
              </h1>
            </div>
          </div>

          {/* Company Content */}
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-wcn-accent1/20 backdrop-blur-wcn-card rounded-2xl p-8 border-2 border-wcn-accent1/30 hover:border-wcn-accent1/50 transition-all">
              <h2 className="text-3xl font-bold text-wcn-text mb-6">
                {company.vision.heading}
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-wcn-text/90 text-lg">
                  {company.vision.content}
                </p>
              </div>
            </div>

            {/* Metrics Card */}
            <div className="bg-wcn-accent2/20 backdrop-blur-wcn-card rounded-2xl p-8 border-2 border-wcn-accent2/30 hover:border-wcn-accent2/50 transition-all">
              <h2 className="text-3xl font-bold text-wcn-text mb-6">
                {company.metrics.heading}
              </h2>
              <div className="grid grid-cols-2 gap-8">
                {company.metrics.stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl font-bold text-wcn-accent2 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-wcn-text/90">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 px-4 bg-wcn-primary/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-wcn-text text-center mb-16">
            {founder.heading}
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Founder Image */}
            <div className="relative h-[600px] rounded-2xl overflow-hidden">
              <Image
                src={founder.portrait.image}
                alt={founder.portrait.imageAlt}
                fill
                className="object-cover"
              />
            </div>

            {/* Founder Bio */}
            <div className="space-y-8">
              {founder.sections.map((section, index) => (
                <div key={index} className={`backdrop-blur-wcn-card rounded-2xl p-8 border-2 transition-all ${
                  index % 2 === 0 
                    ? 'bg-wcn-accent1/20 border-wcn-accent1/30 hover:border-wcn-accent1/50' 
                    : 'bg-wcn-accent2/20 border-wcn-accent2/30 hover:border-wcn-accent2/50'
                }`}>
                  <h3 className="text-2xl font-bold text-wcn-text mb-4">{section.heading}</h3>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-wcn-text/90 whitespace-pre-line">
                      {section.content}
                    </p>
                  </div>
                </div>
              ))}

              {/* Achievements/Milestones */}
              <div className="bg-wcn-accent1/20 backdrop-blur-wcn-card rounded-2xl p-8 border-2 border-wcn-accent1/30 hover:border-wcn-accent1/50 transition-all">
                <h3 className="text-2xl font-bold text-wcn-text mb-4">{founder.milestones.heading}</h3>
                <ul className="space-y-4">
                  {founder.milestones.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-center text-wcn-text/90">
                      <span className="text-wcn-accent2 mr-3">•</span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 