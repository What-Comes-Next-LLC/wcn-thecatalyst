// import { getUserData } from '@/lib/airtable';
import { UploadForm } from '@/components/log/UploadForm';
import Image from 'next/image';
import Link from 'next/link';
import { SignOutButton } from '@/components/SignOutButton';
import SectionWrapper from '@/components/SectionWrapper';
// import logoImage from '/images/logo-official.png'; // Update path if needed

export function LogPageContent({ userId }: { userId?: string }) {
  // If no userId, show unauthenticated state
  if (!userId) {
    return (
      <SectionWrapper bgColor="bg-gradient-to-b from-wcn-primary via-wcn-dark to-black" textColor="text-white" className="min-h-screen relative overflow-hidden">
        {/* Watermark Logo */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-wcn-primary/10"></div>
          <div className="absolute inset-0 w-full h-full rotate-12 scale-125">
            <Image
              src="/images/logo.png"
              alt="Company Logo"
              fill
              className="object-contain opacity-[0.08] mix-blend-soft-light"
              priority
            />
          </div>
        </div>
        {/* Welcome Content */}
        <div className="relative max-w-2xl mx-auto px-4 py-16 space-y-8 z-10">
          <header className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-wcn-text">Welcome to The Spark</h1>
            <p className="text-xl text-wcn-text/80 italic">Take a picture of your food. No calorie counting. No shame.</p>
          </header>
          <section className="rounded-2xl bg-wcn-card backdrop-blur-wcn-card p-8 shadow-lg border-2 border-wcn-card hover:border-wcn-card-hover transition-all">
            <Link href="/onboard" className="block">
              <h2 className="text-2xl font-semibold text-wcn-text mb-4">Get Started</h2>
              <p className="text-wcn-text/80">To begin your journey, please complete the onboarding process.</p>
            </Link>
          </section>
        </div>
      </SectionWrapper>
    );
  }

  // Authenticated state - Supabase only
  const userName = 'there'; // Placeholder, can be replaced with Supabase user data if needed
  const randomMotivationalText = 'Keep going!'; // Placeholder

  return (
    <SectionWrapper bgColor="bg-gradient-to-b from-wcn-primary via-wcn-dark to-black" textColor="text-white" className="min-h-screen relative overflow-hidden">
      {/* Watermark Logo */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-wcn-primary/10"></div>
        <div className="absolute inset-0 w-full h-full rotate-12 scale-125">
          <Image
            src="/images/logo.png"
            alt="Company Logo"
            fill
            className="object-contain opacity-[0.08] mix-blend-soft-light"
            priority
          />
        </div>
      </div>
      {/* Upload Content */}
      <div className="relative max-w-2xl mx-auto px-4 py-16 space-y-8 z-10">
        <div className="flex justify-end mb-4">
          <SignOutButton />
        </div>
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-wcn-text">Welcome back, {userName}!</h1>
          <p className="text-xl text-wcn-text/80 italic">{randomMotivationalText}</p>
        </header>
        <section className="rounded-2xl bg-wcn-card backdrop-blur-wcn-card p-8 shadow-lg border-2 border-wcn-card hover:border-wcn-card-hover transition-all">
          <h2 className="text-2xl font-semibold text-wcn-text mb-4">Upload Your Progress</h2>
          <UploadForm userId={userId} />
        </section>
      </div>
    </SectionWrapper>
  );
}
