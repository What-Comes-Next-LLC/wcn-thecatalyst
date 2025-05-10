import { deckContent } from "@/content/deckContent";
import SectionWrapper from "./SectionWrapper";
import ScrollTrigger from "./ScrollTrigger";
import Image from 'next/image';

export default function Market() {
  const { heading, paragraphs, image } = deckContent.market;

  // Content section with heading and paragraphs
  const contentSection = (
    <div className="space-y-6">
      <h2 className="text-4xl font-bold">{heading}</h2>
      {paragraphs.map((p, i) => (
        <p key={i} className="text-xl">
          {p}
        </p>
      ))}
    </div>
  );

  // Image section
  const imageSection = image ? (
    <div className="flex items-center justify-center">
      <div className="w-full rounded-lg overflow-hidden shadow-lg bg-white p-4">
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
      bgColor="bg-wcn-light" 
      textColor="text-black"
      twoColumn={!!image}
      imagePosition="right"
    >
      {contentSection}
      {imageSection}
      
      {/* Navigation buttons */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-between px-6">
        <ScrollTrigger targetId="product-section" direction="up" showImmediately={true} />
        <ScrollTrigger targetId="competitive-section" direction="down" showImmediately={true} />
      </div>
    </SectionWrapper>
  );
}