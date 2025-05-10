'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '../../lib/supabaseClient';
import { uploadContent } from '@/content/uploadContent';

export default function TheSparkPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [alreadySignedIn, setAlreadySignedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Check if user is active
        const { data, error } = await supabase
          .from('spark_users')
          .select('status')
          .eq('id', user.id)
          .single();
        if (!error && data && data.status === 'active') {
          setAlreadySignedIn(true);
          setTimeout(() => {
            router.replace('/log');
          }, 1200);
        }
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
      return;
    }
    // Check user status
    const { data: userData, error: userError } = await supabase
      .from('spark_users')
      .select('status')
      .eq('id', data.user.id)
      .single();
    if (userError || !userData || userData.status !== 'active') {
      setError('Your account is not active. Please contact support.');
      setLoading(false);
      return;
    }
    setLoading(false);
    router.replace('/log');
  };

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
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-wcn-accent2 via-wcn-text to-wcn-accent1 bg-clip-text text-transparent text-center">
          {uploadContent.theSpark.title}
        </h1>
        <p className="text-lg text-wcn-text/80 text-center mb-6">{uploadContent.theSpark.subtitle}</p>
        <p className="text-wcn-accent2 text-center mb-6">{uploadContent.theSpark.instructions}</p>
        {alreadySignedIn ? (
          <div className="text-wcn-accent1 text-center font-semibold py-4">
            {uploadContent.theSpark.alreadySignedIn}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-wcn-gray text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 border-2 border-wcn-accent1 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:border-wcn-accent2 focus:ring-2 focus:ring-wcn-accent2/50 focus:outline-none transition-all duration-200"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-wcn-gray text-sm font-medium mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-3 border-2 border-wcn-accent1 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:border-wcn-accent2 focus:ring-2 focus:ring-wcn-accent2/50 focus:outline-none transition-all duration-200"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-wcn-accent2 hover:bg-wcn-accent1 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-wcn-accent2/20 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Signing in...' : uploadContent.theSpark.buttonText}
            </button>
            {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
} 