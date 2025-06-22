'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { sendMagicLinkSignin } from '@/lib/auth';
import { siteContent } from '@/content/siteContent';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSuccess(false);
    
    const { error } = await sendMagicLinkSignin(email);
    
    if (error) {
      setError(error.message || 'Failed to send magic link. Please try again.');
      setLoading(false);
      return;
    }
    
    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-wcn-primary via-wcn-dark to-black flex flex-col items-center justify-center p-4">
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
      <div className="relative z-10 w-full max-w-md mx-auto bg-black/30 backdrop-blur-lg rounded-2xl p-8 border-2 border-wcn-mid/20">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-wcn-text via-wcn-accent2 to-wcn-accent1 bg-clip-text text-transparent text-center">
          {siteContent.signin.title}
        </h1>
        <p className="text-center text-wcn-text/80 mb-6">
          {siteContent.signin.subtitle}
        </p>
        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-wcn-accent2/20 border border-wcn-accent2/50 rounded-lg p-6 text-center"
          >
            <h2 className="text-2xl font-bold text-wcn-accent2 mb-2">
              {siteContent.signin.confirmation.title}
            </h2>
            <p className="text-white">
              {siteContent.signin.confirmation.message}
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-wcn-gray text-sm font-medium mb-1">
                {siteContent.signin.form.emailLabel}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 border-2 border-wcn-gray rounded-lg bg-white/5 text-white placeholder-gray-400 focus:border-wcn-mid focus:ring-2 focus:ring-wcn-mid/50 focus:outline-none transition-all duration-200"
                placeholder={siteContent.signin.form.emailPlaceholder}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-wcn-mid hover:bg-wcn-dark text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-wcn-mid/20 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? siteContent.signin.form.submittingText : siteContent.signin.form.submitButton}
            </button>
            {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
} 