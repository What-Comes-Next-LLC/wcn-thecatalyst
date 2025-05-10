'use client';

import { useEffect } from 'react';
import Hero from '@/components/Hero';
import Problem from '@/components/Problem';
import Solution from '@/components/Solution';
import ProductBreakdown from '@/components/ProductBreakdown';
import Market from '@/components/Market';
import Competitive from '@/components/Competitive';
import WhyNow from '@/components/WhyNow';
import GoToMarket from '@/components/GoToMarket';
import WhoBenefits from '@/components/WhoBenefits';
import BusinessModel from '@/components/BusinessModel';
import CombinedCta from "@/components/CombinedCta";
import { setupKeyboardNavigation } from '@/utils/scrollNavigation';


export default function Home() {
  useEffect(() => {
    setupKeyboardNavigation();
  }, []);

  return (
    <main className="snap-y snap-mandatory h-screen overflow-y-scroll">
      <section id="hero-section" className="snap-start h-screen">
        <Hero />
      </section>
      <section id="problem-section" className="snap-start h-screen">
        <Problem />
      </section>
      <section id="solution-section" className="snap-start h-screen">
        <Solution />
      </section>
      <section id="product-section" className="snap-start h-screen">
        <ProductBreakdown />
      </section>
      <section id="market-section" className="snap-start h-screen">
        <Market />
      </section>
      <section id="competitive-section" className="snap-start h-screen">
        <Competitive />
      </section>
      <section id="why-now-section" className="snap-start h-screen">
        <WhyNow />
      </section>
      <section id="go-to-market-section" className="snap-start h-screen">
        <GoToMarket />
      </section>
      <section id="who-benefits-section" className="snap-start h-screen">
        <WhoBenefits />
      </section>
      <section id="business-model-section" className="snap-start h-screen">
        <BusinessModel />
      </section>
      <section id="combined-cta-section" className="snap-start h-screen">
        <CombinedCta />
      </section>
    </main>
  );
}