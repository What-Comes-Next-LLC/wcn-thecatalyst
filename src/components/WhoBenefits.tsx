import { deckContent } from "@/content/deckContent";

export default function WhoBenefits() {
  const { heading, bullets } = deckContent.whoBenefits;

  return (
    <section className="w-full py-24 px-6 bg-white text-black">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-8">{heading}</h2>
        <ul className="list-disc pl-6 space-y-4 text-xl">
          {bullets.map(({ label, description }, i) => (
            <li key={i}>
              <strong>{label}:</strong> {description}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}