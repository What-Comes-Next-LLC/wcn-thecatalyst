'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SectionWrapper from '@/components/SectionWrapper';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const resetSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ResetFormData = z.infer<typeof resetSchema>;

export default function ResetPasswordRequest() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: ResetFormData) => {
    try {
      setError(undefined);
      
      // Send password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) {
        setError(error.message);
        return;
      }
      
      setSubmitted(true);
    } catch (err) {
      setError(`An unexpected error occurred: ${err instanceof Error ? err.message : 'Please try again later'}`);
    }
  };

  const inputStyles = "w-full p-3 border-2 border-wcn-gray rounded-lg bg-white/5 text-white placeholder-gray-400 focus:border-wcn-mid focus:ring-2 focus:ring-wcn-mid/50 focus:outline-none transition-all duration-200";
  const labelStyles = "block text-wcn-gray text-sm font-medium mb-1";
  const errorStyles = "text-red-400 text-sm mt-1";

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
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-wcn-text via-wcn-accent2 to-wcn-accent1 bg-clip-text text-transparent">
            Reset Your Password
          </h1>
          <p className="text-lg text-wcn-text/80">
            Enter your email address below and we'll send you a link to reset your password.
          </p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-wcn-card backdrop-blur-wcn-card rounded-2xl p-8 border-2 border-wcn-card hover:border-wcn-card-hover transition-all shadow-lg w-full"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex justify-center mb-6"
              >
                <div className="rounded-full bg-wcn-accent1/20 p-4">
                  <svg className="h-12 w-12 text-wcn-accent1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </motion.div>
              <h2 className="text-2xl font-bold text-wcn-text mb-4">Check Your Email</h2>
              <p className="text-wcn-text/80">
                If an account exists with that email, we've sent instructions to reset your password.
              </p>
              <button
                onClick={() => router.push('/signin')}
                className="mt-6 px-4 py-2 bg-wcn-accent1 text-wcn-text rounded-lg hover:bg-wcn-accent1/80 transition-all"
              >
                Back to Sign In
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-wcn-card backdrop-blur-wcn-card rounded-2xl p-8 border-2 border-wcn-card hover:border-wcn-card-hover transition-all shadow-lg w-full"
          >
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="email" className={labelStyles}>Email</label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="Your email address"
                  className={`${inputStyles} ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && (
                  <p className={errorStyles}>{errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-wcn-accent1 text-wcn-text rounded-lg font-medium hover:bg-wcn-accent1/90 focus:outline-none focus:ring-2 focus:ring-wcn-accent1/50 disabled:opacity-50 transition-all duration-200"
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </button>
              
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => router.push('/signin')}
                  className="text-wcn-text/70 hover:text-wcn-text/90 transition-colors"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </SectionWrapper>
  );
} 