import { deckContent } from "@/content/deckContent";

export default function CtaPromo() {
  const { heading, blurb, buttonText, videoUrl, buttonUrl } = deckContent.ctaPromo;

  return (
    <section className="w-full py-24 px-6 bg-wcn-black text-white text-center">
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-4xl font-bold">{heading}</h2>
        <video
          src={videoUrl}
          controls
          className="w-full rounded-2xl shadow-lg mx-auto"
        />
        <p className="text-xl mt-4">{blurb}</p>
        <a
          href={buttonUrl}
          className="inline-block mt-4 px-6 py-3 bg-wcn-light text-black font-semibold rounded-xl hover:bg-wcn-mid transition"
          target="_blank"
          rel="noopener noreferrer"
        >
          {buttonText}
        </a>
      </div>
    </section>
  );
}