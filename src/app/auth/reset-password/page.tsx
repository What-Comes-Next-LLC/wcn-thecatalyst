'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import SectionWrapper from '@/components/SectionWrapper';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// Component that uses searchParams
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onBlur',
  });

  useEffect(() => {
    // Check if the recovery token is present
    const checkToken = () => {
      const token = searchParams.get('token');
      if (!token) {
        setIsTokenValid(false);
        setError('Invalid password reset link. Please request a new link.');
      } else {
        setIsTokenValid(true);
      }
    };
    
    checkToken();
  }, [searchParams]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setError(undefined);
      
      // Update password using the recovery token
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });
      
      if (error) {
        setError(error.message || 'Failed to reset password. Please try again.');
        return;
      }
      
      setSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        router.push('/signin');
      }, 3000);
    } catch (err) {
      setError(`An unexpected error occurred: ${err instanceof Error ? err.message : 'Please try again later'}`);
    }
  };

  const inputStyles = "w-full p-3 border-2 border-wcn-gray rounded-lg bg-white/5 text-white placeholder-gray-400 focus:border-wcn-mid focus:ring-2 focus:ring-wcn-mid/50 focus:outline-none transition-all duration-200";
  const labelStyles = "block text-wcn-gray text-sm font-medium mb-1";
  const errorStyles = "text-red-400 text-sm mt-1";

  return (
    <>
      {isTokenValid === false && (
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div className="rounded-full bg-red-500/20 p-4">
              <svg className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </motion.div>
          <h2 className="text-2xl font-bold text-wcn-text mb-4">Invalid Reset Link</h2>
          <p className="text-wcn-text/80">
            This password reset link is invalid or has expired. Please request a new link.
          </p>
          <button
            onClick={() => router.push('/auth/reset-password-request')}
            className="mt-6 px-4 py-2 bg-wcn-accent1 text-wcn-text rounded-lg hover:bg-wcn-accent1/80 transition-all"
          >
            Request New Link
          </button>
        </div>
      )}

      {isTokenValid && success && (
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
          <h2 className="text-2xl font-bold text-wcn-text mb-4">Password Reset Successful</h2>
          <p className="text-wcn-text/80">
            Your password has been updated successfully. You can now sign in with your new password.
          </p>
          <p className="text-wcn-text/60 text-sm mt-2">
            Redirecting to sign in page...
          </p>
        </div>
      )}

      {isTokenValid && !success && (
        <>
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="password" className={labelStyles}>New Password</label>
              <input
                id="password"
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className={`${inputStyles} ${errors.password ? 'border-red-500' : ''}`}
              />
              {errors.password && (
                <p className={errorStyles}>{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className={labelStyles}>Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                placeholder="••••••••"
                className={`${inputStyles} ${errors.confirmPassword ? 'border-red-500' : ''}`}
              />
              {errors.confirmPassword && (
                <p className={errorStyles}>{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-wcn-accent1 text-wcn-text rounded-lg font-medium hover:bg-wcn-accent1/90 focus:outline-none focus:ring-2 focus:ring-wcn-accent1/50 disabled:opacity-50 transition-all duration-200"
            >
              {isSubmitting ? 'Updating...' : 'Reset Password'}
            </button>
          </form>
        </>
      )}
    </>
  );
}

// Loading fallback for Suspense
function ResetPasswordLoading() {
  return (
    <div className="flex justify-center items-center h-full py-8">
      <div className="animate-pulse flex flex-col items-center">
        <div className="rounded-full bg-wcn-gray/20 h-16 w-16 mb-4"></div>
        <div className="h-4 bg-wcn-gray/20 rounded w-32 mb-2"></div>
        <div className="h-4 bg-wcn-gray/10 rounded w-24"></div>
      </div>
    </div>
  );
}

export default function ResetPassword() {
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
            Set New Password
          </h1>
          <p className="text-lg text-wcn-text/80">
            Create a strong password to secure your account.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-wcn-card backdrop-blur-wcn-card rounded-2xl p-8 border-2 border-wcn-card hover:border-wcn-card-hover transition-all shadow-lg w-full"
        >
          <Suspense fallback={<ResetPasswordLoading />}>
            <ResetPasswordForm />
          </Suspense>
        </motion.div>
      </div>
    </SectionWrapper>
  );
} 