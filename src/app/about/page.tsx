'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { deckContent } from '@/content/deckContent';

export default function AboutPage() {
  const router = useRouter();
  const { company, founder } = deckContent.about;

  // Function to render social media icon
  const renderSocialIcon = (iconName: string) => {
    switch (iconName) {
      case 'instagram':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        );
      case 'threads':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
            <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"></path>
          </svg>
        );
      case 'facebook':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
          </svg>
        );
      case 'linkedin':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
            <rect x="2" y="9" width="4" height="12"></rect>
            <circle cx="4" cy="4" r="2"></circle>
          </svg>
        );
      case 'github':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  // Social media data
  const socialMedia = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/whatcomesnextllc/",
      icon: "instagram"
    },
    {
      name: "Threads",
      url: "https://www.threads.net/@jasonrashaad",
      icon: "threads"
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/whatcomesnextllc",
      icon: "linkedin"
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/whatcomesnextllc",
      icon: "facebook"
    },
    {
      name: "GitHub",
      url: "https://github.com/what-comes-next-llc",
      icon: "github"
    }
  ];

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

      {/* Contact CTA Section */}
      <section className="py-16 px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-wcn-accent2/20 backdrop-blur-wcn-card rounded-2xl p-8 border-2 border-wcn-accent2/30 hover:border-wcn-accent2/50 transition-all">
            <h2 className="text-3xl font-bold text-wcn-text mb-6">
              Connect With Us
            </h2>
            <p className="text-wcn-text/90 text-lg mb-8">
              Have questions or want to learn more about What Comes Next? Reach out through our social channels or send us an email at <a href="mailto:coach@whatcomesnextllc.ai" className="text-wcn-accent1 hover:text-wcn-accent2 transition-colors">coach@whatcomesnextllc.ai</a>
            </p>
            
            {/* Social Media Icons */}
            <div className="flex justify-center space-x-6">
              {socialMedia.map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-wcn-text/80 hover:text-wcn-accent1 transition-colors"
                  aria-label={social.name}
                >
                  {renderSocialIcon(social.icon)}
                  <span className="sr-only">{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 