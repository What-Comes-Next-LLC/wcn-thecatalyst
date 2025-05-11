'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { uploadContent } from '@/content/uploadContent';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { onboardSchema, type OnboardFormData } from '@/lib/schemas/onboard';
import { motion } from 'framer-motion';

export default function UnifiedSparkPage() {
  const router = useRouter();
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(true);
  
  // Login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  
  // Onboarding states
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
        setUserRole(role);
        
        // If user is a coach, they should not access this page
        if (role === 'coach') {
          // Sign them out and redirect to home
          await supabase.auth.signOut();
          setIsAuthenticated(false);
          router.replace('/');
          return;
        }
        
        // Check if user is active
        const { data, error } = await supabase
          .from('spark_users')
          .select('status')
          .eq('id', user.id)
          .single();
          
        if (!error && data && data.status === 'active') {
          setIsAuthenticated(true);
          // Redirect active client users to their log
          setTimeout(() => {
            router.replace('/log');
          }, 1000);
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [router]);

  // Handle login form submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    
    if (error) {
      setLoginError('Invalid email or password. Please try again.');
      setLoginLoading(false);
      return;
    }
    
    // Check if user is a coach - they should not access this route
    if (data.user.user_metadata?.role === 'coach') {
      await supabase.auth.signOut();
      setLoginError('Coach accounts cannot access this area.');
      setLoginLoading(false);
      return;
    }
    
    // Check user status
    const { data: userData, error: userError } = await supabase
      .from('spark_users')
      .select('status')
      .eq('id', data.user.id)
      .single();
      
    if (userError || !userData || userData.status !== 'active') {
      setLoginError('Your account is not active. Please contact support.');
      setLoginLoading(false);
      return;
    }
    
    setLoginLoading(false);
    router.replace('/log');
  };

  // Handle onboarding form submission
  const onOnboardSubmit = async (data: OnboardFormData) => {
    try {
      setOnboardError(undefined);
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ 
        email: data.email, 
        password: data.password,
        options: {
          data: {
            role: 'client'
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (!signUpData?.user) {
        setOnboardError(signUpError?.message || 'Submission failed. Please try again.');
        return;
      }
      
      // Insert into spark_users with status 'pending' - this makes them a lead in our workflow
      const { error: insertError } = await supabase.from('spark_users').insert({
        id: signUpData.user.id,
        name: data.name,
        email: data.email,
        goal: data.goal,
        notes: data.notes || null,
        status: 'pending',
        role: 'lead'
      });
      
      if (insertError) {
        setOnboardError(insertError.message || 'Failed to create user profile. Please try again.');
        return;
      }
      
      setSubmitted(true);
      reset();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Clear the authentication cookie
      await supabase.auth.signOut();
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      setOnboardError(`Network error: ${err instanceof Error ? err.message : 'Please check your connection and try again.'}`);
    }
  };

  // Toggle between new user and returning user views
  const toggleUserType = () => setIsNewUser(!isNewUser);

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
  
  // Already authenticated state - will redirect
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-wcn-accent1 via-wcn-primary to-wcn-accent2 flex flex-col items-center justify-center p-4">
        <div className="text-wcn-accent1 text-center font-semibold py-4 text-xl">
          {uploadContent.theSpark.alreadySignedIn}
        </div>
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
            {isNewUser ? "Begin Your Journey" : uploadContent.theSpark.title}
          </h1>
          <p className="text-lg text-wcn-text/80">
            {isNewUser 
              ? "Take the first step towards sustainable transformation with our guided onboarding." 
              : uploadContent.theSpark.subtitle
            }
          </p>
        </div>
        
        {/* Success message for onboarding */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-wcn-accent2/20 border border-wcn-accent2/50 rounded-lg p-6 mb-6"
          >
            <h2 className="text-2xl font-bold text-wcn-accent2 mb-2">
              {uploadContent.onboarding.successTitle}
            </h2>
            <p className="text-white">
              {uploadContent.onboarding.successMessage}
            </p>
          </motion.div>
        )}
        
        {/* Form Display: Login or Onboarding */}
        {!submitted && (
          <>
            {isNewUser ? (
              /* Onboarding Form */
              <form onSubmit={handleSubmit(onOnboardSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="name" className={labelStyles}>Name</label>
                  <input
                    id="name"
                    {...register('name')}
                    placeholder="Your full name"
                    className={`${inputStyles} ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && <p className={errorStyles}>{errors.name.message}</p>}
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
                  {errors.email && <p className={errorStyles}>{errors.email.message}</p>}
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
                  {errors.password && <p className={errorStyles}>{errors.password.message}</p>}
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
                  {errors.confirmPassword && <p className={errorStyles}>{errors.confirmPassword.message}</p>}
                </div>
                
                <div>
                  <label htmlFor="goal" className={labelStyles}>Your Goal</label>
                  <textarea
                    id="goal"
                    {...register('goal')}
                    placeholder="What is your primary fitness or wellness goal?"
                    className={`${inputStyles} ${errors.goal ? 'border-red-500' : ''}`}
                    rows={3}
                  ></textarea>
                  {errors.goal && <p className={errorStyles}>{errors.goal.message}</p>}
                </div>
                
                <div>
                  <label htmlFor="notes" className={labelStyles}>Additional Notes (Optional)</label>
                  <textarea
                    id="notes"
                    {...register('notes')}
                    placeholder="Anything else you'd like us to know?"
                    className={inputStyles}
                    rows={3}
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-wcn-accent2 hover:bg-wcn-accent1 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-wcn-accent2/20 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit and Begin'}
                </button>
                
                {onboardError && (
                  <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg mt-4">
                    <p>{onboardError}</p>
                  </div>
                )}
              </form>
            ) : (
              /* Login Form */
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div>
                  <label htmlFor="login-email" className={labelStyles}>
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={inputStyles}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="login-password" className={labelStyles}>
                    Password
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={inputStyles}
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loginLoading}
                  className={`w-full bg-wcn-accent2 hover:bg-wcn-accent1 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-wcn-accent2/20 ${loginLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loginLoading ? 'Signing in...' : uploadContent.theSpark.buttonText}
                </button>
                
                {loginError && <p className="text-red-400 text-sm mt-2 text-center">{loginError}</p>}
              </form>
            )}
            
            {/* Toggle between new and returning user */}
            <div className="mt-6 text-center">
              <p className="text-wcn-text/80">
                {isNewUser ? 'Already have an account?' : 'Need to create an account?'}
                <button
                  onClick={toggleUserType}
                  className="ml-2 text-wcn-accent2 hover:text-wcn-accent1 font-medium transition-colors"
                >
                  {isNewUser ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 