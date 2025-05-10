'use client';

import Image from 'next/image';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-wcn-gradient from-wcn-primary to-wcn-accent1 relative overflow-hidden">
      {/* Watermark Logo */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute inset-0 bg-wcn-primary/5"></div>
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/logo.png"
            alt="What Comes Next Logo"
            fill
            className="object-contain opacity-[0.15] mix-blend-overlay"
            priority
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-4xl mx-auto px-4 py-16">
        <div className="bg-wcn-card backdrop-blur-wcn-card rounded-2xl p-8 shadow-lg border-2 border-wcn-card">
          <h1 className="text-4xl font-bold text-wcn-text mb-8">
            Privacy Policy for The Spark (by What Comes Next?, LLC)
          </h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-wcn-text/80 mb-6">
              Effective Date: [Set the date you submit to Play Store]
            </p>

            <h2 className="text-2xl font-bold text-wcn-text mt-8 mb-4">Our Commitment</h2>
            <p className="text-wcn-text/80 mb-6">
              At What Comes Next?, LLC, we take your privacy seriously. We do not sell your data, we do not run ads, and we do not track your behavior across apps. The Spark is built as a privacy-first tool to help you log meals and build awareness — not to monetize your habits.
            </p>

            <h2 className="text-2xl font-bold text-wcn-text mt-8 mb-4">What We Collect</h2>
            <p className="text-wcn-text/80 mb-4">
              The Spark collects the following, <strong>only when you choose to submit it</strong>:
            </p>
            <ul className="list-disc list-inside text-wcn-text/80 mb-6 space-y-2">
              <li>A photo or file (meal images)</li>
              <li>A short message (optional notes)</li>
              <li>The timestamp of your submission</li>
              <li>A secure token used to identify you as part of your trainer's system</li>
            </ul>
            <p className="text-wcn-text/80 mb-4">
              We do <strong>not</strong> collect:
            </p>
            <ul className="list-disc list-inside text-wcn-text/80 mb-6 space-y-2">
              <li>Location data</li>
              <li>Contacts or phone numbers</li>
              <li>Persistent device identifiers</li>
              <li>Background data</li>
            </ul>

            <h2 className="text-2xl font-bold text-wcn-text mt-8 mb-4">AI & Data Ethics</h2>
            <p className="text-wcn-text/80 mb-6">
              We believe AI should support people — not profile them.
            </p>
            <p className="text-wcn-text/80 mb-6">
              While The Spark does not currently use AI inference on your photos, future features may include <strong>local-only, user-controlled insights</strong>. We will never share, sell, or externally train on your data. Your behavioral data belongs to you.
            </p>
            <p className="text-wcn-text/80 mb-4">
              We follow the ethical guidance of:
            </p>
            <ul className="list-disc list-inside text-wcn-text/80 mb-6 space-y-2">
              <li>The IAPP (International Association of Privacy Professionals)</li>
              <li>The IAGP (International Association of Generative Privacy)</li>
              <li>The principles of explainability, transparency, and user consent</li>
            </ul>
            <p className="text-wcn-text/80 mb-6">
              Your data will never be used to train or feed centralized AI models without explicit, opt-in permission.
            </p>

            <h2 className="text-2xl font-bold text-wcn-text mt-8 mb-4">How We Use Your Data</h2>
            <p className="text-wcn-text/80 mb-4">
              Your meal logs are used to:
            </p>
            <ul className="list-disc list-inside text-wcn-text/80 mb-6 space-y-2">
              <li>Provide contextualized feedback from your trainer</li>
              <li>Help you reflect on your eating habits over time</li>
              <li>(In future versions) Generate personalized suggestions <strong>on your device</strong></li>
            </ul>
            <p className="text-wcn-text/80 mb-6">
              All data submitted through The Spark is securely stored and accessible only to you and your authorized coach or platform operator.
            </p>

            <h2 className="text-2xl font-bold text-wcn-text mt-8 mb-4">Contact</h2>
            <p className="text-wcn-text/80 mb-4">
              If you have questions or need to request data deletion, contact us:
            </p>
            <div className="bg-wcn-dark rounded-lg p-6 mb-6">
              <p className="text-wcn-text font-bold mb-2">What Comes Next?, LLC</p>
              <p className="text-wcn-text/80 mb-2">535 Griswold Street, Suite 111-132</p>
              <p className="text-wcn-text/80 mb-2">Detroit, MI 48226</p>
              <p className="text-wcn-text/80">📧 privacy@whatcomesnextllc.ai</p>
            </div>

            <p className="text-wcn-text/80 italic mt-8">
              The Spark is not a social platform. There are no comments, no sharing, and no ads. Just your data, in your control, powering your journey.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 