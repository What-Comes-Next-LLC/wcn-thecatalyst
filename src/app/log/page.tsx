'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { uploadContent } from '@/content/uploadContent';
import { LogPageContent } from './LogPageContent';
import { LoadingState } from '@/components/ui/LoadingState';
import SectionWrapper from '@/components/SectionWrapper';

export default function LogPage() {
  const [status, setStatus] = useState<'loading' | 'unauthorized' | 'pending' | 'active'>('loading');
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setStatus('unauthorized');
        return;
      }
      
      // Get user role from metadata - this is now the source of truth
      const userRole = user.user_metadata?.role;
      
      // If user is a coach, they should not access this page
      if (userRole === 'coach') {
        // Redirect coaches to admin page
        router.replace('/admin');
        return;
      }
      
      // If user is a lead, they're still pending approval
      if (userRole === 'lead') {
        setStatus('pending');
        return;
      }
      
      // If user has client role, they're approved and active
      if (userRole === 'client') {
        setStatus('active');
        setUserId(user.id);
        return;
      }
      
      // Default to unauthorized if role doesn't match expected values
      setStatus('unauthorized');
    };
    checkAuth();
  }, [router]);

  if (status === 'loading') {
    return (
      <SectionWrapper bgColor="bg-gradient-to-b from-wcn-primary via-wcn-dark to-black" textColor="text-white" className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-wcn-text/80 text-lg mb-4">{uploadContent.log.loading}</div>
        <LoadingState />
      </SectionWrapper>
    );
  }

  if (status === 'unauthorized') {
    return (
      <SectionWrapper bgColor="bg-gradient-to-b from-wcn-primary via-wcn-dark to-black" textColor="text-white" className="min-h-screen flex flex-col items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">{uploadContent.log.unauthorized}</h1>
          <button
            onClick={() => router.push('/the-spark')}
            className="px-4 py-2 bg-wcn-accent1 hover:bg-wcn-accent2 text-white rounded-md transition-colors"
          >
            Sign In
          </button>
        </div>
      </SectionWrapper>
    );
  }

  if (status === 'pending') {
    return (
      <SectionWrapper bgColor="bg-gradient-to-b from-wcn-primary via-wcn-dark to-black" textColor="text-white" className="min-h-screen flex flex-col items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Account Pending Approval</h1>
          <p className="mb-4">{uploadContent.log.pending}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-wcn-accent1 hover:bg-wcn-accent2 text-white rounded-md transition-colors"
          >
            Return to Home
          </button>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <LogPageContent userId={userId || undefined} />
  );
} 