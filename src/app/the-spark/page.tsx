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
  const inputStyles = "input";
  const labelStyles = "block text-wcn-text text-base font-semibold mb-2";
  const errorStyles = "text-red-300 text-sm mt-2";
  
  // Loading state
  if (loading) {
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
        <div className="relative flex flex-col items-center justify-center p-4 min-h-screen">
          <div className="text-wcn-text text-xl font-semibold">Loading...</div>
        </div>
      </main>
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

      <div className="relative flex flex-col items-center justify-center p-4 min-h-screen">
        <div className="card-elevated w-full max-w-lg mx-auto p-10 bg-wcn-primary/80 backdrop-blur-sm border-2 border-wcn-card shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-wcn-text">
            {siteContent.intake.title}
          </h1>
          <p className="text-lg md:text-xl text-wcn-text leading-relaxed">
            {siteContent.intake.subtitle}
          </p>
        </div>
        
        {/* Success message */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-wcn-accent1/10 border border-wcn-accent1 rounded-card p-8 mb-6"
          >
            <h2 className="text-2xl font-bold text-wcn-primary mb-4">
              {siteContent.intake.confirmation.title}
            </h2>
            <p className="text-wcn-text mb-6 leading-relaxed">
              {siteContent.intake.confirmation.message}
            </p>
            
            {/* Next Steps */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-wcn-text mb-4">What happens next:</h3>
              <div className="space-y-3">
                {siteContent.intake.confirmation.steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-wcn-primary text-white text-sm font-bold rounded-full flex items-center justify-center mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-wcn-text/90">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-wcn-accent1/20">
              <a
                href="/"
                className="btn-secondary inline-block"
              >
                Return to Homepage
              </a>
            </div>
          </motion.div>
        )}
        
        {/* Intake Form */}
        {!submitted && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              className={`btn-primary w-full py-4 text-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? siteContent.intake.form.submittingText : siteContent.intake.form.submitButton}
            </button>
            
            {onboardError && (
              <div className="bg-red-900/20 border border-red-500/50 text-red-300 p-4 rounded-card mt-4">
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
                className="ml-2 text-wcn-accent2 hover:text-wcn-accent1 font-medium transition-colors duration-200"
              >
                {siteContent.intake.returningUser.linkText}
              </a>
            </p>
          </div>
        )}
        </div>
      </div>
    </main>
  );
}