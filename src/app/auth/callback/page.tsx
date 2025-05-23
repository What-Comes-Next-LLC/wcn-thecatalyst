'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import SectionWrapper from '@/components/SectionWrapper';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';

// Component that uses searchParams
function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get token and type from URL
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        if (!token || !type) {
          setStatus('error');
          setMessage('Invalid confirmation link. Please try again or contact support.');
          return;
        }

        // Verify the token
        if (type === 'email_change' || type === 'signup') {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: type === 'signup' ? 'signup' : 'email_change',
          });

          if (error) {
            setStatus('error');
            setMessage('Could not verify your email. The link may have expired.');
            console.error('Verification error:', error);
          } else {
            setStatus('success');
            setMessage('Your email has been verified! You can now sign in.');
            
            // Redirect after a delay
            setTimeout(() => {
              router.push('/signin');
            }, 3000);
          }
        } else {
          setStatus('error');
          setMessage('Invalid confirmation type.');
        }
      } catch (error) {
        console.error('Callback processing error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again later.');
      }
    };

    handleEmailConfirmation();
  }, [searchParams, router]);

  return (
    <>
      {status === 'loading' && (
        <div className="text-center">
          <div className="animate-pulse flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-wcn-accent1/50"></div>
          </div>
          <h2 className="text-2xl font-bold text-wcn-text mb-4">Verifying Your Email</h2>
          <p className="text-wcn-text/80">Just a moment while we confirm your details...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div className="rounded-full bg-wcn-accent1/20 p-4">
              <svg className="h-12 w-12 text-wcn-accent1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </motion.div>
          <h2 className="text-2xl font-bold text-wcn-text mb-4">Email Verified!</h2>
          <p className="text-wcn-text/80">{message}</p>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div className="rounded-full bg-red-500/20 p-4">
              <svg className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </motion.div>
          <h2 className="text-2xl font-bold text-wcn-text mb-4">Verification Failed</h2>
          <p className="text-wcn-text/80">{message}</p>
          <button
            onClick={() => router.push('/signin')}
            className="mt-6 px-4 py-2 bg-wcn-accent1 text-wcn-text rounded-lg hover:bg-wcn-accent1/80 transition-all"
          >
            Back to Sign In
          </button>
        </div>
      )}
    </>
  );
}

// Loading fallback for Suspense
function AuthCallbackLoading() {
  return (
    <div className="text-center py-8">
      <div className="animate-pulse flex flex-col items-center">
        <div className="rounded-full bg-wcn-gray/20 h-16 w-16 mb-4"></div>
        <div className="h-4 bg-wcn-gray/20 rounded w-32 mb-2"></div>
        <div className="h-4 bg-wcn-gray/10 rounded w-24"></div>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <SectionWrapper bgColor="bg-gradient-to-b from-wcn-primary via-wcn-dark to-black" textColor="text-white">
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

      {/* Main Content */}
      <div className="relative max-w-md mx-auto px-4 py-16 z-10 flex flex-col items-center justify-center min-h-screen">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative bg-wcn-card backdrop-blur-wcn-card rounded-2xl p-8 border-2 border-wcn-card hover:border-wcn-card-hover transition-all shadow-lg w-full"
        >
          <Suspense fallback={<AuthCallbackLoading />}>
            <AuthCallbackContent />
          </Suspense>
        </motion.div>
      </div>
    </SectionWrapper>
  );
} 