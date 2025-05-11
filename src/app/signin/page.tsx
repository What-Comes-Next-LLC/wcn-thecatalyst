'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { supabase } from '../../lib/supabaseClient';
import { uploadContent } from '@/content/uploadContent';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSuccess(false);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(uploadContent.signin.errorInvalid);
      setLoading(false);
      return;
    }
    
    // Check user role from user metadata
    const userRole = data.user.user_metadata?.role;
    
    setSuccess(true);
    setTimeout(() => {
      if (userRole === 'coach') {
        router.replace('/admin');
      } else {
        router.replace('/log');
      }
    }, 1000);
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
          {uploadContent.signin.title}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-wcn-gray text-sm font-medium mb-1">
              {uploadContent.signin.emailLabel}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-3 border-2 border-wcn-gray rounded-lg bg-white/5 text-white placeholder-gray-400 focus:border-wcn-mid focus:ring-2 focus:ring-wcn-mid/50 focus:outline-none transition-all duration-200"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-wcn-gray text-sm font-medium mb-1">
              {uploadContent.signin.passwordLabel}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-3 border-2 border-wcn-gray rounded-lg bg-white/5 text-white placeholder-gray-400 focus:border-wcn-mid focus:ring-2 focus:ring-wcn-mid/50 focus:outline-none transition-all duration-200"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-wcn-mid hover:bg-wcn-dark text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-wcn-mid/20 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Signing in...' : uploadContent.signin.buttonText}
          </button>
          {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
          {success && <p className="text-wcn-accent2 text-center mt-2">{uploadContent.signin.welcomeBack}</p>}
        </form>
      </div>
    </div>
  );
} 