'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';

export default function PendingPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.replace('/signin');
        return;
      }
      
      const userRole = user.user_metadata?.role;
      
      // Redirect if user is no longer a lead
      if (userRole === 'client') {
        router.replace('/log');
        return;
      } else if (userRole === 'coach') {
        router.replace('/admin');
        return;
      } else if (userRole !== 'lead') {
        router.replace('/signin');
        return;
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-wcn-gradient from-wcn-primary to-wcn-accent1 relative overflow-hidden flex items-center justify-center">
        <div className="text-wcn-text text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-wcn-gradient from-wcn-primary to-wcn-accent1 relative overflow-hidden">
      {/* Watermark Logo */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute inset-0 bg-wcn-primary/5"></div>
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/logo-official.png"
            alt="What Comes Next Logo"
            fill
            className="object-contain opacity-[0.15] mix-blend-overlay"
            priority
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-2xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-screen text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-wcn-primary/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-wcn-card shadow-2xl"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div className="rounded-full bg-wcn-accent2/20 p-4">
              <svg className="h-16 w-16 text-wcn-accent2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-bold text-wcn-text mb-4">
            Welcome to The Catalyst!
          </h1>
          
          <h2 className="text-xl font-semibold text-wcn-text mb-6">
            We're preparing your coaching consultation
          </h2>
          
          <div className="space-y-4 text-wcn-text">
            <p className="text-lg leading-relaxed">
              Perfect! Your email is verified and our coaching team is reviewing your information. We'll reach out within 24-48 hours to schedule your initial consultation.
            </p>
            
            <p className="leading-relaxed">
              Once approved, you'll gain immediate access to The Spark habit tracker and begin your personalized transformation journey.
            </p>
            
            <div className="bg-wcn-accent1/20 rounded-xl p-6 mt-6">
              <h3 className="font-semibold mb-4 text-lg">Your Next Steps:</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-wcn-accent2 text-wcn-primary text-sm font-bold rounded-full flex items-center justify-center mt-0.5">1</div>
                  <p className="text-sm">Our coaching team reviews your goals and background</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-wcn-accent2 text-wcn-primary text-sm font-bold rounded-full flex items-center justify-center mt-0.5">2</div>
                  <p className="text-sm">You'll receive an email to schedule your consultation call</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-wcn-accent2 text-wcn-primary text-sm font-bold rounded-full flex items-center justify-center mt-0.5">3</div>
                  <p className="text-sm">After approval, immediate access to The Spark tracker</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-wcn-accent2 text-wcn-primary text-sm font-bold rounded-full flex items-center justify-center mt-0.5">4</div>
                  <p className="text-sm">Begin building sustainable habits with coach guidance</p>
                </div>
              </div>
            </div>
            
            <div className="bg-wcn-primary/20 rounded-lg p-4 mt-4">
              <p className="text-sm font-medium">
                💡 <strong>Pro tip:</strong> Keep an eye on your email for our outreach within the next 1-2 business days!
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={() => router.push('/')}
              className="btn-primary px-8 py-3"
            >
              Return to Homepage
            </button>
            
            <div>
              <button
                onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
                className="text-wcn-text/80 hover:text-wcn-text transition-colors text-sm underline"
              >
                Sign out
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}