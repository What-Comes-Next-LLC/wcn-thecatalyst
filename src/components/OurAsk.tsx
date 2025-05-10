import { deckContent } from "@/content/deckContent";

export default function OurAsk() {
  const { heading, paragraphs } = deckContent.ourAsk;

  return (
    <section className="w-full py-24 px-6 bg-wcn-dark text-wcn-gray text-center">
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-4xl font-bold">{heading}</h2>
        {paragraphs.map((p, i) => (
          <p key={i} className="text-xl">
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}