'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { uploadContent } from '@/content/uploadContent';
import { LoadingState } from '@/components/ui/LoadingState';
import { announceMilestone, announceUploadProgress } from '@/lib/accessibility';

// New Spark components
import ConstellationDisplay from '@/components/spark/ConstellationDisplay';
import CaptureButton from '@/components/spark/CaptureButton';
import CameraInterface from '@/components/spark/CameraInterface';
import FileUploadInterface from '@/components/spark/FileUploadInterface';
import CoachMessage from '@/components/spark/CoachMessage';
import SuccessFeedback from '@/components/spark/SuccessFeedback';

interface SparkPageState {
  status: 'loading' | 'unauthorized' | 'pending' | 'active';
  userId: string | null;
  sparkCount: number;
  interface: 'main' | 'camera' | 'file' | 'uploading';
  showSuccess: boolean;
  lastUploadNumber: number;
}

export default function LogPage() {
  const { user, loading: authLoading } = useAuth();
  const [state, setState] = useState<SparkPageState>({
    status: 'loading',
    userId: null,
    sparkCount: 0,
    interface: 'main',
    showSuccess: false,
    lastUploadNumber: 0,
  });
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      checkAuthAndLoadData();
    }
  }, [user, authLoading, router]);

  const checkAuthAndLoadData = async () => {
    if (!user) {
      setState(prev => ({ ...prev, status: 'unauthorized' }));
      return;
    }
    
    const userRole = user.user_metadata?.role;
    
    // Route users based on role
    if (userRole === 'coach') {
      router.replace('/admin');
      return;
    }
    
    if (userRole === 'lead') {
      setState(prev => ({ ...prev, status: 'pending' }));
      return;
    }
    
    if (userRole === 'client') {
      // Load user's spark count
      await loadSparkCount(user.id);
      setState(prev => ({ 
        ...prev, 
        status: 'active', 
        userId: user.id 
      }));
      return;
    }
    
    setState(prev => ({ ...prev, status: 'unauthorized' }));
  };

  const loadSparkCount = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('uploads')
        .select('id')
        .eq('user_id', userId);
        
      if (!error && data) {
        setState(prev => ({ ...prev, sparkCount: data.length }));
      }
    } catch (error) {
      console.error('Error loading spark count:', error);
    }
  };

  const handleCameraClick = () => {
    setState(prev => ({ ...prev, interface: 'camera' }));
  };

  const handleFileClick = () => {
    setState(prev => ({ ...prev, interface: 'file' }));
  };

  const handleInterfaceCancel = () => {
    setState(prev => ({ ...prev, interface: 'main' }));
  };

  const handleFileUpload = async (file: File) => {
    if (!state.userId) return;
    
    setState(prev => ({ ...prev, interface: 'uploading' }));
    setUploadProgress(0);
    setUploadError(null);

    try {
      // Create FormData for upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'progress-photo'); // Default type for mobile captures
      formData.append('userId', state.userId);
      formData.append('notes', `Spark captured on ${new Date().toLocaleDateString()}`);

      // Simulate progress for better UX with accessibility announcements
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev >= 90 ? 90 : prev + 10;
          announceUploadProgress(newProgress);
          return newProgress;
        });
      }, 200);

      // Upload file
      const response = await fetch('/api/log', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      // Success! Update spark count and show celebration
      const newSparkCount = state.sparkCount + 1;
      
      // Announce milestone achievements
      const milestones = [1, 10, 25, 50, 100, 250, 500, 1000];
      if (milestones.includes(newSparkCount)) {
        setTimeout(() => {
          announceMilestone(newSparkCount);
        }, 1000);
      }
      
      setState(prev => ({ 
        ...prev, 
        sparkCount: newSparkCount,
        interface: 'main',
        showSuccess: true,
        lastUploadNumber: newSparkCount
      }));

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
      setState(prev => ({ ...prev, interface: 'main' }));
    }
  };

  const handleSuccessComplete = () => {
    setState(prev => ({ ...prev, showSuccess: false }));
  };

  // Loading state
  if (state.status === 'loading') {
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
              className="object-contain opacity-[0.08] mix-blend-overlay"
              priority
            />
          </div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center bg-wcn-primary/20 backdrop-blur-sm border-2 border-wcn-accent2/30 rounded-2xl p-12 shadow-2xl">
            <div className="text-wcn-text text-2xl mb-6 font-medium">{uploadContent.log.loading}</div>
            <LoadingState />
          </div>
        </div>
      </main>
    );
  }

  // Unauthorized state
  if (state.status === 'unauthorized') {
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
              className="object-contain opacity-[0.08] mix-blend-overlay"
              priority
            />
          </div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="container-narrow text-center">
            <div className="bg-wcn-primary/80 backdrop-blur-sm border-2 border-wcn-card rounded-2xl p-12 shadow-2xl">
              <div className="text-6xl mb-6">🔒</div>
              <h1 className="text-3xl md:text-4xl font-bold text-wcn-text mb-6">
                {uploadContent.log.unauthorized}
              </h1>
              <button
                onClick={() => router.push('/the-spark')}
                className="btn-primary btn-xl px-10"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Pending approval state
  if (state.status === 'pending') {
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
              className="object-contain opacity-[0.08] mix-blend-overlay"
              priority
            />
          </div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="container-narrow text-center">
            <div className="bg-wcn-primary/80 backdrop-blur-sm border-2 border-wcn-card rounded-2xl p-12 shadow-2xl">
              <div className="text-6xl mb-6">⏳</div>
              <h1 className="text-3xl md:text-4xl font-bold text-wcn-text mb-6">
                Account Pending Approval
              </h1>
              <p className="text-xl text-wcn-text/80 mb-8 leading-relaxed">
                {uploadContent.log.pending}
              </p>
              <button
                onClick={() => router.push('/')}
                className="btn-secondary btn-lg"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Camera interface
  if (state.interface === 'camera') {
    return (
      <CameraInterface
        onCapture={handleFileUpload}
        onCancel={handleInterfaceCancel}
        onFallbackToFile={() => setState(prev => ({ ...prev, interface: 'file' }))}
      />
    );
  }

  // File upload interface
  if (state.interface === 'file') {
    return (
      <FileUploadInterface
        onFileSelect={handleFileUpload}
        onCancel={handleInterfaceCancel}
      />
    );
  }

  // Uploading state
  if (state.interface === 'uploading') {
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
              className="object-contain opacity-[0.08] mix-blend-overlay"
              priority
            />
          </div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="container-narrow text-center">
            <div className="bg-wcn-primary/80 backdrop-blur-sm border-2 border-wcn-card rounded-2xl p-12 shadow-2xl">
              <div className="text-6xl mb-6 animate-bounce">⚡</div>
              <h1 className="text-3xl md:text-4xl font-bold text-wcn-text mb-6">
                Capturing Your Spark...
              </h1>
              
              {/* Progress bar */}
              <div className="w-full bg-wcn-primary/30 rounded-full h-4 mb-6 overflow-hidden shadow-inner">
                <div 
                  className="bg-gradient-to-r from-wcn-accent1 to-wcn-accent2 h-4 rounded-full transition-all duration-300 shadow-lg"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              
              <p className="text-xl text-wcn-text/80 font-medium">
                {uploadProgress}% complete
              </p>
              
              {uploadError && (
                <div className="mt-8 p-6 bg-red-900/30 border border-red-500/50 rounded-xl text-red-300">
                  {uploadError}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Main Spark interface (active state)
  return (
    <>
      <main className="min-h-screen bg-wcn-gradient from-wcn-primary to-wcn-accent1 relative overflow-hidden">
        {/* Watermark Logo */}
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 bg-wcn-primary/5"></div>
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/images/logo-official.png"
              alt="What Comes Next Logo"
              fill
              className="object-contain opacity-[0.08] mix-blend-overlay"
              priority
            />
          </div>
        </div>
        
        <div className="relative z-10 container-narrow min-h-screen flex flex-col py-12">
          
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-wcn-text mb-6 leading-tight">
              The Spark
            </h1>
            <p className="text-xl md:text-2xl text-wcn-text font-medium leading-relaxed">
              Document your journey, one moment at a time
            </p>
          </header>

          {/* Constellation Progress Display */}
          <div className="flex-1 mb-12">
            <div className="bg-wcn-primary/20 backdrop-blur-sm border-2 border-wcn-accent2/30 rounded-2xl p-8 shadow-2xl">
              <ConstellationDisplay 
                sparkCount={state.sparkCount}
                className="mb-4"
              />
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-wcn-text mb-2">
                  Your Journey: {state.sparkCount} Sparks
                </div>
                <div className="text-wcn-text/70">
                  {state.sparkCount < 50 && "Keep going! Little Dipper at 50 ⭐"}
                  {state.sparkCount >= 50 && state.sparkCount < 100 && "Amazing! Big Dipper unlocks at 100 ✨"}
                  {state.sparkCount >= 100 && state.sparkCount < 250 && "Incredible! Orion awaits at 250 🌌"}
                  {state.sparkCount >= 250 && state.sparkCount < 500 && "Phenomenal! Winter Sky at 500 ❄️"}
                  {state.sparkCount >= 500 && state.sparkCount < 1000 && "Legendary! Galaxy Master at 1000 🌠"}
                  {state.sparkCount >= 1000 && "🌌 GALAXY MASTER ACHIEVED! 🌌"}
                </div>
              </div>
            </div>
          </div>

          {/* Coach Message */}
          <div className="mb-12">
            <div className="bg-wcn-accent1/20 backdrop-blur-sm border-2 border-wcn-accent1/40 rounded-2xl p-6 shadow-xl">
              <CoachMessage userId={state.userId || undefined} />
            </div>
          </div>

          {/* Main Capture Button */}
          <div className="mb-12">
            <CaptureButton
              onCameraClick={handleCameraClick}
              onFileClick={handleFileClick}
              className="transform hover:scale-105 transition-all duration-300"
            />
          </div>

          {/* Quick Stats */}
          <div className="text-center">
            <div className="bg-wcn-primary/10 backdrop-blur-sm border border-wcn-text/20 rounded-xl px-6 py-4 inline-block">
              <p className="text-wcn-text/80 text-sm font-medium mb-1">
                Privacy protected • Securely stored
              </p>
              <p className="text-xs text-wcn-text/60">
                Your data is encrypted and accessible only to you and your coach
              </p>
            </div>
          </div>

          {/* Sign out (subtle) */}
          <div className="mt-12 text-center">
            <button
              onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
              className="text-wcn-text/50 hover:text-wcn-text/70 text-sm underline transition-colors duration-200"
            >
              Sign out
            </button>
          </div>
        </div>
      </main>

      {/* Success Feedback Overlay */}
      <SuccessFeedback
        sparkNumber={state.lastUploadNumber}
        isVisible={state.showSuccess}
        onComplete={handleSuccessComplete}
      />
    </>
  );
}
