import React from "react";

export default function FoundersLetterPage() {
  return (
    <main className="flex flex-col items-center min-h-screen bg-wcn-primary py-12">
      <div className="relative bg-wcn-accent2 max-w-2xl w-full rounded-lg shadow-lg p-8 overflow-hidden">
        {/* Watermark Logo */}
        <img
          src="/images/logo-official.png"
          alt="What Comes Next Logo"
          className="absolute inset-0 m-auto w-3/4 opacity-10 pointer-events-none select-none"
          style={{ zIndex: 0 }}
        />

        {/* Letter Content */}
        <div className="relative z-10 flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-wcn-primary mb-1 tracking-tight">
            What Comes Next, LLC
          </h1>
          <div className="text-wcn-primary italic mb-2">Rebuilding Health. Rehumanizing Tech.</div>

          <div className="border-t border-wcn-primary/30 my-2" />

          <div className="font-bold text-wcn-primary">Memo: Founder Letter & Executive Introduction</div>
          <div className="text-wcn-primary"><span className="font-bold">From:</span> Jason Rashaad, Founder & CEO</div>
          <div className="text-wcn-primary"><span className="font-bold">Subject:</span> Introducing <span className="italic">The Catalyst</span> — A Human-Centered Platform for Sustainable Behavior Change</div>

          <div className="border-t border-wcn-primary/30 my-2" />

          <div className="text-wcn-primary/90">To Whom It May Concern,</div>

          <p className="text-lg text-wcn-primary/90">
            Thank you for taking the time to learn more about{' '}
            <a href="/about" className="text-wcn-accent1 underline hover:text-wcn-primary transition">What Comes Next, LLC</a>{' '}
            and our flagship product,{' '}
            <a href="/promo" className="text-wcn-accent1 underline hover:text-wcn-primary transition">The Catalyst</a>. I'm Jason Rashaad — a Builder by trade, a Founder by necessity, and a Rebuilder by force of will. After experiencing firsthand the emotional and logistical failures of modern fitness tools during my own health crisis, I committed to building a better system — one that values trust, human agency, and long-term change over superficial engagement.
          </p>

          <p className="italic text-wcn-primary/90">The Catalyst</p>
          <p className="text-lg text-wcn-primary/90">is a privacy-first behavior change platform designed specifically for personal trainers and their clients. Unlike generic fitness apps or bloated SaaS tools, our product ecosystem supports real human coaching, not just content delivery. It includes:</p>

          <ul className="list-disc pl-6 space-y-2 text-wcn-primary/90">
            <li>
              <a href="https://whatcomesnextllc.ai/the-spark" target="_blank" rel="noopener noreferrer" className="font-bold text-wcn-accent1 underline hover:text-wcn-primary transition">The Spark</a>{' '}
              – A free habit-tracking mobile app that empowers users to log workouts and meals offline, building momentum one "Spark" at a time.
            </li>
            <li>
              <a href="https://whatcomesnextllc.ai/admin" target="_blank" rel="noopener noreferrer" className="font-bold text-wcn-accent1 underline hover:text-wcn-primary transition">Coach's Clipboard</a>{' '}
              – A lightweight CRM for trainers to view client progress, assign nudges, and extend support beyond gym walls.
            </li>
            <li>
              <span className="font-bold">Day in the Life Plans</span>{' '}
              – AI-generated behavioral blueprints tailored to individual goals, available direct-to-consumer or through coach resale.
            </li>
          </ul>

          <p className="text-lg text-wcn-primary/90">
            This isn't a whitepaper or a wishlist — we've already built a working beta with zero outside capital. <a href="https://github.com/what-comes-next-llc" target="_blank" rel="noopener noreferrer" className="text-wcn-accent1 underline hover:text-wcn-primary transition">All development to date</a> was self-funded (including, yes, selling my own car), and we are now piloting with early users while preparing to scale regionally.
          </p>

          <p className="text-lg text-wcn-primary/90">
            What follows{' '}
            <a href="https://whatcomesnextllc.ai/investors" target="_blank" rel="noopener noreferrer" className="text-wcn-accent1 underline hover:text-wcn-primary transition">in our full investor memo</a>{' '}
            is a detailed breakdown of our market opportunity, product architecture, GTM strategy, early traction, and our $250K seed raise to fund the next 18 months of growth. We've grounded this work in research, validated it with real-world interviews, and built every feature with empathy for both trainer and client in mind.
          </p>

          <p className="text-lg text-wcn-primary/90">
            We are seeking investor partners who share our belief that the future of fitness will be powered not just by AI, but by <span className="italic">accountability, access, and trust</span>.
          </p>

          <p className="text-lg text-wcn-primary/90">
            If this speaks to you — as a trainer, a potential user, or a backer — <a href="https://whatcomesnextllc.ai/donate" target="_blank" rel="noopener noreferrer" className="font-bold text-wcn-accent1 underline hover:text-wcn-primary transition">I invite you to join us.</a>What comes next is already in motion.
          </p>

          <div className="mt-8 text-right">
            <div className="text-wcn-primary font-bold text-lg">Warmly,</div>
            <div className="text-2xl font-signature text-black mt-2 mb-1">Jason Rashaad</div>
            <div className="text-wcn-primary font-medium">Founder & CEO</div>
            <div className="text-wcn-primary">What Comes Next, LLC</div>
            <div className="text-wcn-primary">
              <a href="mailto:jasonrashaad@whatcomesnextllc.ai" className="text-wcn-accent1 underline hover:text-wcn-primary transition">jasonrashaad@whatcomesnextllc.ai</a>{' '}| +1 313 312 5297 |{' '}
              <a href="https://whatcomesnextllc.ai" target="_blank" rel="noopener noreferrer" className="text-wcn-accent1 underline hover:text-wcn-primary transition">whatcomesnextllc.ai</a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 