import { deckContent } from "@/content/deckContent";

export default function WhyNow() {
  const { heading, paragraphs } = deckContent.whyNow;

  return (
    <section className="w-full py-24 px-6 bg-wcn-dark text-wcn-gray">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-8">{heading}</h2>
        {paragraphs.map((p, i) => (
          <p key={i} className="text-xl mb-4">{p}</p>
        ))}
      </div>
    </section>
  );
}