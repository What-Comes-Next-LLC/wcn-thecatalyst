// import { getUserData } from '@/lib/airtable';
import { UploadForm } from '@/components/log/UploadForm';
import Image from 'next/image';
import Link from 'next/link';
import { SignOutButton } from '@/components/SignOutButton';
import SectionWrapper from '@/components/SectionWrapper';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
// import logoImage from '/images/logo-official.png'; // Update path if needed

// Simple lock icon component to avoid heroicons dependency
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
  </svg>
);

// Simple chevron icon component
const ChevronIcon = ({ direction = 'down' }: { direction?: 'up' | 'down' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={`h-4 w-4 transition-transform ${direction === 'up' ? 'rotate-180' : ''}`} 
    viewBox="0 0 20 20" 
    fill="currentColor"
  >
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

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
  const [showUploads, setShowUploads] = useState(true);

  // Motivational messages
  const motivationalMessages = [
    "Every upload builds your journey!",
    "Keep going! Consistency is key.",
    "Small steps lead to big changes.",
    "Capture today, transform tomorrow.",
    "Your future self will thank you."
  ];
  
  // Select a random motivational message
  const randomMotivationalText = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

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

  // Toggle the visibility of the recent uploads section
  const toggleUploads = () => {
    setShowUploads(!showUploads);
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
      <div className="relative max-w-md sm:max-w-xl md:max-w-2xl mx-auto px-4 py-6 sm:py-10 space-y-6 z-10">
        {/* Header with logo and sign out */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-2 relative">
              <Image
                src="/images/logo.png"
                alt="The Spark"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-wcn-text">The Spark</h1>
          </div>
          <SignOutButton />
        </div>
        
        {/* Welcome Message */}
        <div className="text-center mb-2">
          <p className="text-lg text-wcn-text/80 italic">{randomMotivationalText}</p>
        </div>
        
        {/* Main Upload Section - Now Prioritized with enhanced styling */}
        <section className="rounded-2xl bg-wcn-card backdrop-blur-wcn-card p-6 sm:p-8 shadow-lg border-2 border-wcn-card hover:border-wcn-accent1/20 transition-all">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-wcn-text">Capture Your Progress</h2>
            <div className="flex items-center text-xs text-wcn-text/60">
              <LockIcon />
              <span className="ml-1">Privacy Protected</span>
            </div>
          </div>
          
          <p className="text-wcn-text/80 mb-6">
            Upload a photo or log to track your journey. Your data stays private and secure.
          </p>
          
          {/* Enhanced Upload Form */}
          <div className="transform hover:scale-[1.01] transition-transform">
            <UploadForm userId={userId} />
          </div>
        </section>

        {/* Recent Uploads Section - Now Collapsible with enhanced styling */}
        <section className="rounded-2xl bg-wcn-card backdrop-blur-wcn-card p-6 sm:p-8 shadow-lg border-2 border-wcn-card hover:border-wcn-card-hover transition-all">
          <div 
            className="flex justify-between items-center mb-4 cursor-pointer" 
            onClick={toggleUploads}
            aria-expanded={showUploads}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && toggleUploads()}
          >
            <h2 className="text-lg sm:text-xl font-semibold text-wcn-text">Your Recent Uploads</h2>
            <div className="flex items-center text-wcn-accent2 text-sm">
              <span className="mr-1">{showUploads ? 'Hide' : 'Show'}</span>
              <ChevronIcon direction={showUploads ? 'up' : 'down'} />
            </div>
          </div>
          
          {showUploads && (
            <>
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
                <div className="text-center py-8">
                  <p className="text-wcn-text/70">No uploads yet.</p>
                  <p className="text-wcn-accent2 mt-2">Capture your first Spark moment!</p>
                </div>
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
                            className="text-wcn-accent2 hover:text-wcn-accent1 transition-colors text-sm flex items-center"
                          >
                            <span>View</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
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
            </>
          )}
        </section>
        
        {/* Privacy Reminder */}
        <div className="text-center text-xs text-wcn-text/60 pt-2 flex items-center justify-center">
          <LockIcon />
          <span className="ml-1">Your uploads are processed on our secure servers, not in the cloud.</span>
        </div>
      </div>
    </SectionWrapper>
  );
}
