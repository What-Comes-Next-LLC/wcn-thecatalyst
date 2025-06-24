'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { setupUserPassword } from '@/lib/auth';

export default function CoachSetupPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.replace('/signin');
        return;
      }
      
      // Only coaches can access this setup page
      if (user.user_metadata?.role !== 'coach') {
        setAuthorized(false);
        return;
      }
      
      setAuthorized(true);
    };
    
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    const { error } = await setupUserPassword('', password); // Email not needed for current user
    
    if (error) {
      setError(error.message || 'Failed to set up password. Please try again.');
      setLoading(false);
      return;
    }
    
    // Redirect to admin dashboard after successful setup
    router.push('/admin');
  };

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (authorized === false) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="card-elevated max-w-md mx-auto p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-body mb-6">This page is only available to coach accounts.</p>
          <button
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="card-elevated w-full max-w-lg mx-auto p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-heading text-center">
            Set Up Your Password
          </h1>
          <p className="text-center text-body mb-8 text-lg leading-relaxed">
            As a coach, you can set up a password for faster access to the admin dashboard.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-heading text-base font-semibold mb-2">
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input"
                placeholder="Enter your password (min 8 characters)"
                required
                minLength={8}
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-heading text-base font-semibold mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="input"
                placeholder="Confirm your password"
                required
                minLength={8}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`btn-primary w-full py-4 text-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Setting up password...' : 'Set Password'}
            </button>
            
            {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
          </form>
          
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/admin')}
              className="text-wcn-primary hover:text-wcn-accent1 transition-colors text-sm underline"
            >
              Skip for now (continue with magic link)
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}