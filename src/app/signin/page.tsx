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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="card-elevated w-full max-w-lg mx-auto p-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-heading text-center">
          {siteContent.signin.title}
        </h1>
        <p className="text-center text-body mb-8 text-lg leading-relaxed">
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
            <p className="text-body">
              {siteContent.signin.confirmation.message}
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="email" className="block text-heading text-base font-semibold mb-2">
                {siteContent.signin.form.emailLabel}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input"
                placeholder={siteContent.signin.form.emailPlaceholder}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`btn-primary w-full py-4 text-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? siteContent.signin.form.submittingText : siteContent.signin.form.submitButton}
            </button>
            {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
} 