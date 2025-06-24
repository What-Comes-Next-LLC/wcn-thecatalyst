'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { sendMagicLinkSignin, signInWithPassword, isCoachEmail } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { siteContent } from '@/content/siteContent';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [authMethod, setAuthMethod] = useState<'magic' | 'password'>('magic');
  const [showPasswordOption, setShowPasswordOption] = useState(false);
  const router = useRouter();

  // Handle email change and detect coach emails
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    // Show password option for coach emails
    if (newEmail && isCoachEmail(newEmail)) {
      setShowPasswordOption(true);
    } else {
      setShowPasswordOption(false);
      setAuthMethod('magic');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSuccess(false);
    
    if (authMethod === 'password') {
      if (!password) {
        setError('Password is required');
        setLoading(false);
        return;
      }
      
      const { data, error } = await signInWithPassword(email, password);
      
      if (error) {
        setError(error.message || 'Failed to sign in. Please check your credentials.');
        setLoading(false);
        return;
      }
      
      // Redirect based on user role
      if (data?.user) {
        const userRole = data.user.user_metadata?.role;
        if (userRole === 'coach') {
          router.push('/admin');
        } else if (userRole === 'client') {
          router.push('/log');
        } else {
          router.push('/pending');
        }
      }
    } else {
      const { error } = await sendMagicLinkSignin(email);
      
      if (error) {
        setError(error.message || 'Failed to send magic link. Please try again.');
        setLoading(false);
        return;
      }
      
      setSuccess(true);
    }
    
    setLoading(false);
  };

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
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-wcn-text text-center">
          {siteContent.signin.title}
        </h1>
        <p className="text-center text-wcn-text mb-8 text-lg leading-relaxed">
          {siteContent.signin.subtitle}
        </p>
        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-wcn-accent1/10 border border-wcn-accent1 rounded-card p-6 text-center"
          >
            <h2 className="text-2xl font-bold text-wcn-primary mb-2">
              {siteContent.signin.confirmation.title}
            </h2>
            <p className="text-wcn-text">
              {siteContent.signin.confirmation.message}
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="email" className="block text-wcn-text text-base font-semibold mb-2">
                {siteContent.signin.form.emailLabel}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                className="input"
                placeholder={siteContent.signin.form.emailPlaceholder}
                required
              />
            </div>
            
            {showPasswordOption && (
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="authMethod"
                      value="magic"
                      checked={authMethod === 'magic'}
                      onChange={() => setAuthMethod('magic')}
                      className="mr-2"
                    />
                    Magic Link
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="authMethod"
                      value="password"
                      checked={authMethod === 'password'}
                      onChange={() => setAuthMethod('password')}
                      className="mr-2"
                    />
                    Password
                  </label>
                </div>
                
                {authMethod === 'password' && (
                  <div>
                    <label htmlFor="password" className="block text-wcn-text text-base font-semibold mb-2">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="input"
                      placeholder="Your password"
                      required
                    />
                  </div>
                )}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className={`btn-primary w-full py-4 text-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading 
                ? (authMethod === 'password' ? 'Signing in...' : siteContent.signin.form.submittingText)
                : (authMethod === 'password' ? 'Sign In' : siteContent.signin.form.submitButton)
              }
            </button>
            {error && <p className="text-red-300 text-sm mt-4 text-center">{error}</p>}
          </form>
        )}
        </div>
      </div>
    </main>
  );
} 