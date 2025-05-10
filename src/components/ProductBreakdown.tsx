import { deckContent } from "@/content/deckContent";
import SectionWrapper from "./SectionWrapper";
import ScrollTrigger from "./ScrollTrigger";
import Image from 'next/image';

export default function ProductBreakdown() {
  const { heading, bullets, image } = deckContent.product;

  // Content section with heading and bullets
  const contentSection = (
    <div className="space-y-6">
      <h2 className="text-4xl font-bold">{heading}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bullets.map((bullet, i) => (
          <div key={i} className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-2">{bullet.label}</h3>
            <p>{bullet.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // Image section
  const imageSection = image ? (
    <div className="flex items-center justify-center">
      <div className="w-full rounded-lg overflow-hidden shadow-lg bg-gray-100 p-4">
        <div className="relative w-full h-[40vh]">
          <Image 
            src={image} 
            alt={heading} 
            fill
            className="rounded-lg object-contain" 
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      </div>
    </div>
  ) : null;

  return (
    <SectionWrapper 
      bgColor="bg-white" 
      textColor="text-black"
      twoColumn={!!image}
      imagePosition="right"
    >
      {contentSection}
      {imageSection}
      
      {/* Navigation buttons */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-between px-6">
        <ScrollTrigger targetId="solution-section" direction="up" showImmediately={true} />
        <ScrollTrigger targetId="market-section" direction="down" showImmediately={true} />
      </div>
    </SectionWrapper>
  );
}