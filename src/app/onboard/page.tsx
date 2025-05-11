// src/app/onboard/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import SectionWrapper from '@/components/SectionWrapper';
import { onboardSchema, type OnboardFormData } from '@/lib/schemas/onboard';
import { supabase } from '../../lib/supabaseClient';
import { uploadContent } from '@/content/uploadContent';

export default function OnboardPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<OnboardFormData>({
    resolver: zodResolver(onboardSchema),
    mode: 'onBlur', // Validate fields when user leaves them
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string>();

  const onSubmit = async (data: OnboardFormData) => {
    try {
      setError(undefined);
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ 
        email: data.email, 
        password: data.password,
        options: {
          data: {
            role: 'client' // Set initial role in metadata
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (!signUpError && signUpData.user) {
        // Insert into spark_users instead of user_profiles
        await supabase.from('spark_users').insert({
          id: signUpData.user.id,
          name: data.name,
          email: data.email,
          age: data.age,
          height: data.height,
          weight: data.weight,
          goal: data.goal,
          notes: data.notes || null,
          status: 'pending',
          role: 'client'
        });
        
        setSubmitted(true);
        reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Clear the authentication cookie
        await supabase.auth.signOut();
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setError(signUpError?.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      setError(`Network error: ${err instanceof Error ? err.message : 'Please check your connection and try again.'}`);
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

      {/* Main Content Container */}
      <div className="relative max-w-2xl mx-auto px-4 py-12 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* Hero Text */}
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-wcn-text via-wcn-accent2 to-wcn-accent1 bg-clip-text text-transparent">
            Begin Your Journey
          </h1>
          <p className="text-xl text-wcn-text/80 max-w-xl mx-auto">
            Take the first step towards sustainable transformation with our guided onboarding process.
          </p>

          {submitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                transition: {
                  duration: 1.2,
                  ease: [0.22, 1, 0.36, 1]
                }
              }}
              className="bg-gradient-to-r from-wcn-primary via-wcn-accent1 to-wcn-accent2 p-[2px] rounded-2xl mt-8"
            >
              <div className="bg-black/90 backdrop-blur-lg rounded-2xl p-8">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: 0.3, duration: 0.8 }
                  }}
                  className="text-3xl font-bold text-wcn-text mb-4"
                >
                  {uploadContent.onboarding.successTitle}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    transition: { delay: 0.6, duration: 0.8 }
                  }}
                  className="text-wcn-accent2"
                >
                  {uploadContent.onboarding.successMessage}
                </motion.p>
              </div>
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg mt-4"
            >
              <p className="text-lg">{error}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Form Container */}
        <div className="relative bg-wcn-card backdrop-blur-wcn-card rounded-2xl p-8 border-2 border-wcn-card hover:border-wcn-card-hover transition-all shadow-lg">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div>
                <label htmlFor="name" className={labelStyles}>Name</label>
                <input
                  id="name"
                  {...register('name')}
                  placeholder="Your full name"
                  className={`${inputStyles} ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className={errorStyles}>{errors.name.message}</p>
                )}
              </div>

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

              <div>
                <label htmlFor="password" className={labelStyles}>Password</label>
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

              <div>
                <label htmlFor="age" className={labelStyles}>Age</label>
                <input
                  id="age"
                  type="number"
                  {...register('age', { valueAsNumber: true })}
                  placeholder="Your age"
                  className={`${inputStyles} ${errors.age ? 'border-red-500' : ''}`}
                />
                {errors.age && (
                  <p className={errorStyles}>{errors.age.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="height" className={labelStyles}>Height</label>
                <input
                  id="height"
                  type="number"
                  {...register('height', { valueAsNumber: true })}
                  placeholder="Height in inches (e.g. 72 for 6 feet)"
                  className={`${inputStyles} ${errors.height ? 'border-red-500' : ''}`}
                />
                {errors.height && (
                  <p className={errorStyles}>{errors.height.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="weight" className={labelStyles}>Weight</label>
                <input
                  id="weight"
                  type="number"
                  {...register('weight', { valueAsNumber: true })}
                  placeholder="Weight (lbs)"
                  className={`${inputStyles} ${errors.weight ? 'border-red-500' : ''}`}
                />
                {errors.weight && (
                  <p className={errorStyles}>{errors.weight.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="goal" className={labelStyles}>Fitness Goal</label>
                <input
                  id="goal"
                  {...register('goal')}
                  placeholder="What do you want to achieve?"
                  className={`${inputStyles} ${errors.goal ? 'border-red-500' : ''}`}
                />
                {errors.goal && (
                  <p className={errorStyles}>{errors.goal.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="notes" className={labelStyles}>Additional Notes</label>
                <textarea
                  id="notes"
                  {...register('notes')}
                  placeholder="Anything else you&apos;d like us to know?"
                  className={`${inputStyles} min-h-[100px] resize-y ${errors.notes ? 'border-red-500' : ''}`}
                />
                {errors.notes && (
                  <p className={errorStyles}>{errors.notes.message}</p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-wcn-mid hover:bg-wcn-dark text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-wcn-mid/20 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}