import { deckContent } from "@/content/deckContent";
import withNavigation from "./withNavigation";
import SectionWrapper from "./SectionWrapper";
import Image from 'next/image';

function Solution() {
  const { heading, paragraphs, image } = deckContent.solution;

  return (
    <SectionWrapper bgColor="bg-wcn-light" textColor="text-black">
      <div className="space-y-6">
        <h2 className="text-4xl font-bold">{heading}</h2>
        {paragraphs.map((p, i) => (
          <p key={i} className="text-xl">
            {p}
          </p>
        ))}
        {image && (
          <div className="mt-8 relative w-full h-[40vh]">
            <Image 
              src={image} 
              alt={heading} 
              fill
              className="rounded-lg shadow-lg object-contain" 
              sizes="(max-width: 768px) 100vw, 80vw"
              priority
            />
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

export default withNavigation(Solution, {
  prevSectionId: "problem-section",
  nextSectionId: "product-section"
});