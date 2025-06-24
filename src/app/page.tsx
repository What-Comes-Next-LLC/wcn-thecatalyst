import Link from 'next/link';
import Image from 'next/image';
import { getHomepageContent } from '@/lib/homepageContent';
import { siteContent } from '@/content/siteContent';
import { UserIcon, CogIcon, DocumentTextIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';

export default async function HomePage() {
  const content = await getHomepageContent();

  const testimonials = [
    {
      text: "I didn't expect a PDF to change my habits. It did.",
      author: "Sarah K."
    },
    {
      text: "Jason didn't waste my time. He gave me a map and held me to it.",
      author: "Marcus J."
    },
    {
      text: "The Spark was weirdly addictive. Logging made me actually pay attention.",
      author: "David R."
    }
  ];

  const stepIcons = [UserIcon, CogIcon, DocumentTextIcon, ArrowsPointingOutIcon];

  return (
    <main className="min-h-screen bg-wcn-gradient from-wcn-primary to-wcn-accent1 relative overflow-hidden">
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

      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="container-wide text-center">
          <div className="animate-fade-in-up max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-wcn-text">
              {content.hero.title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-wcn-text font-medium leading-relaxed">
              {content.hero.subhead}
            </p>
            <Link
              href={content.hero.cta_link}
              className="btn-primary btn-xl"
            >
              {content.hero.cta_text}
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 bg-wcn-accent1/35 backdrop-blur-sm">
        <div className="container-wide">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-wcn-text">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
            {content.howItWorks.map((step, index) => {
              const IconComponent = stepIcons[index];
              return (
                <div
                  key={step.title}
                  className={`text-center group animate-fade-in-up animate-stagger stagger-${index + 1}`}
                >
                  <div className="w-16 h-16 rounded-full bg-wcn-primary text-white flex items-center justify-center mx-auto mb-6 shadow-button step-indicator">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-wcn-text">{step.subhead}</h3>
                  <p className="text-wcn-text leading-relaxed">{step.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 md:py-20 bg-wcn-primary/30 backdrop-blur-sm">
        <div className="container-wide">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-wcn-text">Offerings</h2>
            <p className="text-lg md:text-xl text-wcn-text leading-relaxed">Start with The Spark, then decide how deep you want to go.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* All pricing tiers in unified layout */}
            {content.pricing.slice(0, 3).map((tier, index) => (
              <div
                key={tier.title}
                className={`group relative animate-fade-in-up animate-stagger stagger-${index + 1} ${
                  index === 1 ? 'transform md:scale-105 z-10' : ''
                }`}
              >
                <div className={`card-interactive p-8 h-full flex flex-col bg-wcn-primary/80 border-4 border-wcn-card rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-102 hover:-translate-y-2 transition-all duration-500 ${
                  index === 1 ? 'border-wcn-primary' : 'hover:border-wcn-card-hover'
                }`}>
                  {index === 1 && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-wcn-accent2 to-wcn-accent1 text-wcn-primary px-6 py-2 rounded-full text-base font-bold shadow-xl border-2 border-wcn-primary">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center flex-grow">
                    <h3 className="text-xl font-bold mb-3 text-wcn-text">{tier.title}</h3>
                    <div className="text-4xl md:text-5xl font-bold text-wcn-accent2 mb-4 bg-wcn-accent2/10 rounded-xl py-2">
                      {tier.subhead}
                    </div>
                    <p className="text-wcn-text mb-6 leading-relaxed text-base opacity-90">{tier.body}</p>
                  </div>
                  
                  <Link
                    href={tier.cta_link}
                    className={`w-full text-center btn-lg font-bold transition-all duration-300 hover:scale-105 active:scale-95 py-5 ${
                      index === 1 
                        ? 'btn-primary' 
                        : 'btn-secondary'
                    }`}
                  >
                    {tier.cta_text}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-20 bg-wcn-accent2/70 backdrop-blur-sm">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 animate-fade-in-up">
              <div className="flex-shrink-0">
                <img
                  src={content.about.image_url}
                  alt="Jason"
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-card"
                />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-wcn-text">
                  {content.about.title}
                </h2>
                <p className="text-lg md:text-xl mb-4 text-wcn-text font-medium">
                  {content.about.subhead}
                </p>
                <p className="text-base md:text-lg text-wcn-text leading-relaxed">
                  {content.about.body}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proof Section */}
      <section className="py-16 md:py-20 bg-wcn-accent1/35 backdrop-blur-sm">
        <div className="container-wide">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-wcn-text">
            {content.proof.title}
          </h2>
          
          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`card-interactive p-8 animate-fade-in-up animate-stagger stagger-${index + 1}`}
              >
                <div className="text-center">
                  <p className="text-wcn-text text-lg italic mb-6 leading-relaxed">"{testimonial.text}"</p>
                  <p className="text-wcn-primary font-semibold text-lg">— {testimonial.author}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Placeholder Images */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card p-8 text-center animate-fade-in-up animate-stagger stagger-4">
              <div className="w-full h-64 bg-slate-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-slate-500 text-lg">Spark UI Screenshot</span>
              </div>
              <p className="text-wcn-text">The Spark interface - simple logging that works</p>
            </div>
            
            <div className="card p-8 text-center animate-fade-in-up animate-stagger stagger-5">
              <div className="w-full h-64 bg-slate-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-slate-500 text-lg">DITL Sample</span>
              </div>
              <p className="text-wcn-text">Sample Day in the Life plan output</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-24 backdrop-blur-sm">
        <div className="container-narrow text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-wcn-text">
              {content.finalCta.title}
            </h2>
            <p className="text-lg md:text-2xl text-wcn-text mb-8 leading-relaxed">
              {content.finalCta.subhead}
            </p>
            <Link
              href={content.finalCta.cta_link}
              className="btn-primary btn-xl px-10"
            >
              {content.finalCta.cta_text}
            </Link>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="border-t border-black/20 py-12 bg-black/70 backdrop-blur-sm">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-white">{siteContent.footer.tagline}</p>
              <p className="text-white/70 text-sm">{siteContent.footer.company}</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/about" className="text-white/80 hover:text-wcn-accent2 transition-colors duration-200">
                {siteContent.navigation.about}
              </Link>
              <Link href="/foundersletter" className="text-white/80 hover:text-wcn-accent2 transition-colors duration-200">
                {siteContent.navigation.founderLetter}
              </Link>
              <Link href="/signin" className="text-white/80 hover:text-wcn-accent2 transition-colors duration-200">
                {siteContent.navigation.signin}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}