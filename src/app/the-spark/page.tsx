'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { sendMagicLinkSignup } from '@/lib/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { onboardSchema, type OnboardFormData } from '@/lib/schemas/onboard';
import { motion } from 'framer-motion';
import { siteContent } from '@/content/siteContent';

export default function TheSparkPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [onboardError, setOnboardError] = useState<string | undefined>();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<OnboardFormData>({
    resolver: zodResolver(onboardSchema),
    mode: 'onBlur',
  });

  // Check authentication status on page load
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Get user role from metadata
        const role = user.user_metadata?.role || null;
        
        // If user is a coach, redirect them to admin without signing out
        if (role === 'coach') {
          router.replace('/admin');
          return;
        }
        
        // Check if user is active
        const { data, error } = await supabase
          .from('spark_users')
          .select('status')
          .eq('id', user.id)
          .single();
          
        if (!error && data && data.status === 'active') {
          // Redirect active client users to their log
          router.replace('/log');
          return;
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [router]);

  // Handle form submission with magic link
  const onSubmit = async (data: OnboardFormData) => {
    try {
      setOnboardError(undefined);
      
      const { error } = await sendMagicLinkSignup(data.email, {
        name: data.name,
        goal: data.goal,
        notes: data.notes
      });
      
      if (error) {
        setOnboardError(error.message || 'Submission failed. Please try again.');
        return;
      }
      
      setSubmitted(true);
      reset();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setOnboardError(`Network error: ${err instanceof Error ? err.message : 'Please check your connection and try again.'}`);
    }
  };

  // Styling constants
  const inputStyles = "w-full p-3 border-2 border-wcn-accent1 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:border-wcn-accent2 focus:ring-2 focus:ring-wcn-accent2/50 focus:outline-none transition-all duration-200";
  const labelStyles = "block text-wcn-gray text-sm font-medium mb-1";
  const errorStyles = "text-red-400 text-sm mt-1";
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-wcn-accent1 via-wcn-primary to-wcn-accent2 flex flex-col items-center justify-center p-4">
        <div className="text-white text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-wcn-accent1 via-wcn-primary to-wcn-accent2 flex flex-col items-center justify-center p-4">
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
      
      <div className="relative z-10 w-full max-w-md mx-auto bg-black/40 backdrop-blur-lg rounded-2xl p-8 border-2 border-wcn-accent1/30">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-wcn-accent2 via-wcn-text to-wcn-accent1 bg-clip-text text-transparent">
            {siteContent.intake.title}
          </h1>
          <p className="text-lg text-wcn-text/80">
            {siteContent.intake.subtitle}
          </p>
        </div>
        
        {/* Success message */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-wcn-accent2/20 border border-wcn-accent2/50 rounded-lg p-6 mb-6"
          >
            <h2 className="text-2xl font-bold text-wcn-accent2 mb-2">
              {siteContent.intake.confirmation.title}
            </h2>
            <p className="text-white">
              {siteContent.intake.confirmation.message}
            </p>
          </motion.div>
        )}
        
        {/* Intake Form */}
        {!submitted && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className={labelStyles}>{siteContent.intake.form.fields.name.label}</label>
              <input
                id="name"
                {...register('name')}
                placeholder={siteContent.intake.form.fields.name.placeholder}
                className={`${inputStyles} ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <p className={errorStyles}>{errors.name.message}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className={labelStyles}>{siteContent.intake.form.fields.email.label}</label>
              <input
                id="email"
                type="email"
                {...register('email')}
                placeholder={siteContent.intake.form.fields.email.placeholder}
                className={`${inputStyles} ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className={errorStyles}>{errors.email.message}</p>}
            </div>
            
            <div>
              <label htmlFor="goal" className={labelStyles}>{siteContent.intake.form.fields.goal.label}</label>
              <textarea
                id="goal"
                {...register('goal')}
                placeholder={siteContent.intake.form.fields.goal.placeholder}
                className={`${inputStyles} ${errors.goal ? 'border-red-500' : ''}`}
                rows={3}
              ></textarea>
              {errors.goal && <p className={errorStyles}>{errors.goal.message}</p>}
            </div>
            
            <div>
              <label htmlFor="notes" className={labelStyles}>{siteContent.intake.form.fields.notes.label}</label>
              <textarea
                id="notes"
                {...register('notes')}
                placeholder={siteContent.intake.form.fields.notes.placeholder}
                className={inputStyles}
                rows={3}
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-wcn-accent2 hover:bg-wcn-accent1 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-wcn-accent2/20 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? siteContent.intake.form.submittingText : siteContent.intake.form.submitButton}
            </button>
            
            {onboardError && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg mt-4">
                <p>{onboardError}</p>
              </div>
            )}
          </form>
        )}
        
        {/* Link to sign in for returning users */}
        {!submitted && (
          <div className="mt-6 text-center">
            <p className="text-wcn-text/80">
              {siteContent.intake.returningUser.text}
              <a
                href="/signin"
                className="ml-2 text-wcn-accent2 hover:text-wcn-accent1 font-medium transition-colors"
              >
                {siteContent.intake.returningUser.linkText}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}