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
      const { data, error } = await supabase
        .from('spark_users')
        .select('status')
        .eq('id', user.id)
        .single();
      if (error || !data) {
        setStatus('unauthorized');
        return;
      }
      if (data.status === 'pending') {
        setStatus('pending');
      } else if (data.status === 'active') {
        setStatus('active');
        setUserId(user.id);
      } else {
        setStatus('unauthorized');
      }
    };
    checkAuth();
  }, []);

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
      <SectionWrapper bgColor="bg-gradient-to-b from-wcn-primary via-wcn-dark to-black" textColor="text-white" className="min-h-screen flex items-center justify-center">
        <div className="text-center text-xl text-red-400">{uploadContent.log.unauthorized}</div>
      </SectionWrapper>
    );
  }
  if (status === 'pending') {
    return (
      <SectionWrapper bgColor="bg-gradient-to-b from-wcn-primary via-wcn-dark to-black" textColor="text-white" className="min-h-screen flex items-center justify-center">
        <div className="text-center text-xl text-yellow-400">{uploadContent.log.pending}</div>
      </SectionWrapper>
    );
  }
  return (
    <LogPageContent userId={userId!} />
  );
} 