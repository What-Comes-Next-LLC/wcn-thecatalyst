// import { getUserData } from '@/lib/airtable';
import { UploadForm } from '@/components/log/UploadForm';
import Image from 'next/image';
import Link from 'next/link';
import { SignOutButton } from '@/components/SignOutButton';
import SectionWrapper from '@/components/SectionWrapper';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
// import logoImage from '/images/logo-official.png'; // Update path if needed

interface Upload {
  id: string;
  type: string;
  file_name: string;
  file_url: string;
  created_at: string;
  notes?: string;
  file_type: string;
  file_size: number;
}

export function LogPageContent({ userId }: { userId?: string }) {
  const [recentUploads, setRecentUploads] = useState<Upload[]>([]);
  const [isLoadingUploads, setIsLoadingUploads] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Fetch recent uploads when userId changes
  useEffect(() => {
    async function fetchUploads() {
      if (!userId) return;
      
      setIsLoadingUploads(true);
      setUploadError(null);

      try {
        const { data, error } = await supabase
          .from('uploads')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setRecentUploads(data || []);
      } catch (err) {
        console.error('Error fetching uploads:', err);
        setUploadError('Failed to load your recent uploads');
      } finally {
        setIsLoadingUploads(false);
      }
    }

    fetchUploads();
  }, [userId]);

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // If no userId, show unauthenticated state
  if (!userId) {
    return (
      <SectionWrapper bgColor="bg-gradient-to-b from-wcn-primary via-wcn-dark to-black" textColor="text-white" className="min-h-screen relative overflow-hidden">
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
        {/* Welcome Content */}
        <div className="relative max-w-2xl mx-auto px-4 py-16 space-y-8 z-10">
          <header className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-wcn-text">Welcome to The Spark</h1>
            <p className="text-xl text-wcn-text/80 italic">Take a picture of your food. No calorie counting. No shame.</p>
          </header>
          <section className="rounded-2xl bg-wcn-card backdrop-blur-wcn-card p-8 shadow-lg border-2 border-wcn-card hover:border-wcn-card-hover transition-all">
            <Link href="/onboard" className="block">
              <h2 className="text-2xl font-semibold text-wcn-text mb-4">Get Started</h2>
              <p className="text-wcn-text/80">To begin your journey, please complete the onboarding process.</p>
            </Link>
          </section>
        </div>
      </SectionWrapper>
    );
  }

  // Authenticated state - Supabase only
  const userName = 'there'; // Placeholder, can be replaced with Supabase user data if needed
  const randomMotivationalText = 'Keep going!'; // Placeholder

  return (
    <SectionWrapper bgColor="bg-gradient-to-b from-wcn-primary via-wcn-dark to-black" textColor="text-white" className="min-h-screen relative overflow-hidden">
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
      {/* Upload Content */}
      <div className="relative max-w-2xl mx-auto px-4 py-16 space-y-8 z-10">
        <div className="flex justify-end mb-4">
          <SignOutButton />
        </div>
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-wcn-text">Welcome back, {userName}!</h1>
          <p className="text-xl text-wcn-text/80 italic">{randomMotivationalText}</p>
        </header>
        <section className="rounded-2xl bg-wcn-card backdrop-blur-wcn-card p-8 shadow-lg border-2 border-wcn-card hover:border-wcn-card-hover transition-all">
          <h2 className="text-2xl font-semibold text-wcn-text mb-4">Upload Your Progress</h2>
          <UploadForm userId={userId} />
        </section>

        {/* Recent Uploads Section */}
        <section className="rounded-2xl bg-wcn-card backdrop-blur-wcn-card p-8 shadow-lg border-2 border-wcn-card hover:border-wcn-card-hover transition-all">
          <h2 className="text-2xl font-semibold text-wcn-text mb-4">Your Recent Uploads</h2>
          
          {isLoadingUploads && (
            <div className="flex justify-center my-8">
              <div className="animate-pulse flex space-x-2">
                <div className="w-2 h-2 bg-wcn-accent1 rounded-full"></div>
                <div className="w-2 h-2 bg-wcn-accent1 rounded-full"></div>
                <div className="w-2 h-2 bg-wcn-accent1 rounded-full"></div>
              </div>
            </div>
          )}
          
          {uploadError && (
            <p className="text-red-400 text-sm p-3 bg-red-900/20 rounded-lg border border-red-400/30">{uploadError}</p>
          )}
          
          {!isLoadingUploads && !uploadError && recentUploads.length === 0 && (
            <p className="text-wcn-text/70 text-center py-6">No uploads yet. Upload your first file above!</p>
          )}
          
          {!isLoadingUploads && recentUploads.length > 0 && (
            <div className="space-y-4">
              {recentUploads.map((upload) => (
                <div 
                  key={upload.id} 
                  className="p-4 rounded-lg border border-wcn-card-hover bg-wcn-dark/20 hover:bg-wcn-dark/40 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-wcn-text">
                        {upload.type === 'food-log' ? '🍽️ Food Log' : 
                         upload.type === 'progress-photo' ? '📸 Progress Photo' : 
                         upload.type === 'measurement' ? '📏 Measurements' : 
                         upload.type}
                      </h3>
                      <p className="text-sm text-wcn-text/60">
                        {formatDate(upload.created_at)}
                      </p>
                    </div>
                    {upload.file_url && (
                      <a 
                        href={upload.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-wcn-accent2 hover:text-wcn-accent1 transition-colors text-sm"
                      >
                        View
                      </a>
                    )}
                  </div>
                  
                  <div className="flex items-center text-sm text-wcn-text/70">
                    <span className="mr-2">
                      {upload.file_type.includes('image') ? '🖼️' : 
                       upload.file_type.includes('pdf') ? '📄' : '📁'}
                    </span>
                    <span className="truncate">{upload.file_name}</span>
                  </div>
                  
                  {upload.notes && (
                    <p className="mt-2 text-sm text-wcn-text/80 italic">{upload.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </SectionWrapper>
  );
}
