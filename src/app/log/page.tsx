'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { uploadContent } from '@/content/uploadContent';
import { LoadingState } from '@/components/ui/LoadingState';
import { announceToScreenReader, announceSuccess, announceMilestone, announceUploadProgress } from '@/lib/accessibility';

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
    checkAuthAndLoadData();
  }, [router]);

  const checkAuthAndLoadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
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
      <main className="min-h-screen bg-gradient-to-b from-wcn-primary via-wcn-dark to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-wcn-text/80 text-lg mb-4">{uploadContent.log.loading}</div>
          <LoadingState />
        </div>
      </main>
    );
  }

  // Unauthorized state
  if (state.status === 'unauthorized') {
    return (
      <main className="min-h-screen bg-gradient-to-b from-wcn-primary via-wcn-dark to-black flex items-center justify-center p-4">
        <div className="container-narrow text-center">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-3xl font-bold text-wcn-text mb-4">
            {uploadContent.log.unauthorized}
          </h1>
          <button
            onClick={() => router.push('/the-spark')}
            className="btn-primary btn-xl"
          >
            Get Started
          </button>
        </div>
      </main>
    );
  }

  // Pending approval state
  if (state.status === 'pending') {
    return (
      <main className="min-h-screen bg-gradient-to-b from-wcn-primary via-wcn-dark to-black flex items-center justify-center p-4">
        <div className="container-narrow text-center">
          <div className="text-6xl mb-6">⏳</div>
          <h1 className="text-3xl font-bold text-wcn-text mb-4">
            Account Pending Approval
          </h1>
          <p className="text-wcn-text/80 mb-8">
            {uploadContent.log.pending}
          </p>
          <button
            onClick={() => router.push('/')}
            className="btn-secondary btn-lg"
          >
            Return Home
          </button>
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
      <main className="min-h-screen bg-gradient-to-b from-wcn-primary via-wcn-dark to-black flex items-center justify-center p-4">
        <div className="container-narrow text-center">
          <div className="text-6xl mb-6 animate-bounce">⚡</div>
          <h1 className="text-3xl font-bold text-wcn-text mb-4">
            Capturing Your Spark...
          </h1>
          
          {/* Progress bar */}
          <div className="w-full bg-wcn-primary/30 rounded-full h-3 mb-4 overflow-hidden">
            <div 
              className="bg-wcn-accent1 h-3 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          
          <p className="text-wcn-text/70">
            {uploadProgress}% complete
          </p>
          
          {uploadError && (
            <div className="mt-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300">
              {uploadError}
            </div>
          )}
        </div>
      </main>
    );
  }

  // Main Spark interface (active state)
  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-wcn-primary via-wcn-dark to-black relative overflow-hidden">
        <div className="container-narrow min-h-screen flex flex-col py-8">
          
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-6xl md:text-7xl font-bold text-wcn-text mb-4">
              🔥 THE SPARK 🔥
            </h1>
            <p className="text-xl text-wcn-text/80">
              Document your journey, one moment at a time
            </p>
          </header>

          {/* Constellation Progress Display */}
          <div className="flex-1 mb-8">
            <ConstellationDisplay 
              sparkCount={state.sparkCount}
              className="mb-8"
            />
          </div>

          {/* Coach Message */}
          <div className="mb-12">
            <CoachMessage userId={state.userId || undefined} />
          </div>

          {/* Main Capture Button */}
          <div className="mb-8">
            <CaptureButton
              onCameraClick={handleCameraClick}
              onFileClick={handleFileClick}
              className="mb-8"
            />
          </div>

          {/* Quick Stats */}
          <div className="text-center text-wcn-text/60 text-sm">
            <p>Your journey: {state.sparkCount} Sparks captured</p>
            <p className="text-xs mt-1">Privacy protected • Securely stored</p>
          </div>

          {/* Sign out (subtle) */}
          <div className="mt-8 text-center">
            <button
              onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
              className="text-wcn-text/40 hover:text-wcn-text/60 text-xs transition-colors"
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