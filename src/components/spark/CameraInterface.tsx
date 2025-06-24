'use client';

import { useState, useRef, useEffect } from 'react';
import { createFocusTrap, announceToScreenReader, announceError, KEYBOARD_KEYS } from '@/lib/accessibility';

interface CameraInterfaceProps {
  onCapture: (file: File) => void;
  onCancel: () => void;
  onFallbackToFile: () => void;
}

export default function CameraInterface({ onCapture, onCancel, onFallbackToFile }: CameraInterfaceProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCaptured, setIsCaptured] = useState(false);
  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    
    // Set up focus trap
    let cleanupFocusTrap: (() => void) | null = null;
    if (containerRef.current) {
      cleanupFocusTrap = createFocusTrap(containerRef.current);
    }
    
    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === KEYBOARD_KEYS.ESCAPE) {
        handleCancel();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Announce camera interface
    announceToScreenReader('Camera interface opened. Press Escape to cancel.', 'assertive');
    
    // Cleanup on unmount
    return () => {
      stopCamera();
      cleanupFocusTrap?.();
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Request camera access with back camera preference
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' }, // Back camera preferred
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          setIsLoading(false);
          announceToScreenReader('Camera ready. Tap the large camera button to take a photo.', 'polite');
        };
      }
    } catch (err) {
      console.error('Camera access error:', err);
      const errorMessage = 'Camera access denied or not available';
      setError(errorMessage);
      setIsLoading(false);
      
      // Announce error to screen readers
      announceError(errorMessage, 'camera access');
      
      // Auto-fallback to file upload after a delay
      setTimeout(() => {
        onFallbackToFile();
      }, 2000);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob and create file
    canvas.toBlob((blob) => {
      if (blob) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const file = new File([blob], `spark-${timestamp}.jpg`, { 
          type: 'image/jpeg' 
        });
        
        // Show preview
        const imageUrl = URL.createObjectURL(blob);
        setCapturedImageUrl(imageUrl);
        setIsCaptured(true);
        
        // Stop camera since we have the photo
        stopCamera();
      }
    }, 'image/jpeg', 0.9);
  };

  const confirmCapture = () => {
    if (!canvasRef.current) return;

    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const file = new File([blob], `spark-${timestamp}.jpg`, { 
          type: 'image/jpeg' 
        });
        onCapture(file);
      }
    }, 'image/jpeg', 0.9);
  };

  const retakePhoto = () => {
    setIsCaptured(false);
    setCapturedImageUrl(null);
    startCamera();
  };

  const handleCancel = () => {
    stopCamera();
    onCancel();
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-wcn-primary via-wcn-dark to-black z-50 flex items-center justify-center p-4">
        <div className="container-narrow text-center">
          <div className="text-6xl mb-6">📱</div>
          <h2 className="text-2xl font-bold text-wcn-text mb-4">
            Camera Not Available
          </h2>
          <p className="text-wcn-text/80 mb-8">
            {error}
          </p>
          
          <div className="space-y-4">
            <button
              onClick={onFallbackToFile}
              className="btn-primary btn-xl w-full"
            >
              <span className="mr-2">📁</span>
              Choose File Instead
            </button>
            
            <button
              onClick={handleCancel}
              className="btn-ghost btn-lg w-full"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-gradient-to-b from-wcn-primary via-wcn-dark to-black z-50"
      role="dialog"
      aria-modal="true"
      aria-label="Camera interface for capturing Spark photo"
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="text-4xl mb-4">📷</div>
            <div className="text-wcn-text text-xl">
              Starting camera...
            </div>
          </div>
        </div>
      )}

      {/* Camera view */}
      {!isCaptured && (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ display: isLoading ? 'none' : 'block' }}
          />
          
          {/* Camera controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center justify-between max-w-md mx-auto">
              {/* Cancel button */}
              <button
                onClick={handleCancel}
                className="btn-ghost text-white border-white/20 hover:border-white/40"
                aria-label="Cancel camera"
              >
                ✕
              </button>

              {/* Capture button */}
              <button
                onClick={capturePhoto}
                disabled={isLoading}
                className="w-20 h-20 bg-white rounded-full border-4 border-wcn-primary hover:scale-105 active:scale-95 transition-all duration-200 focus:ring-4 focus:ring-white/30"
                aria-label="Take photo"
              >
                <div className="w-full h-full bg-wcn-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl">📸</span>
                </div>
              </button>

              {/* Upload alternative */}
              <button
                onClick={onFallbackToFile}
                className="btn-ghost text-white border-white/20 hover:border-white/40"
                aria-label="Choose file instead"
              >
                📁
              </button>
            </div>
            
            <div className="text-center mt-4">
              <p className="text-white/70 text-sm">
                Tap the camera button to capture your Spark
              </p>
            </div>
          </div>
        </>
      )}

      {/* Photo preview */}
      {isCaptured && capturedImageUrl && (
        <>
          <img
            src={capturedImageUrl}
            alt="Captured photo preview"
            className="w-full h-full object-cover"
          />
          
          {/* Preview controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center justify-center space-x-4 max-w-md mx-auto">
              <button
                onClick={retakePhoto}
                className="btn-secondary btn-lg"
              >
                ↻ Retake
              </button>
              
              <button
                onClick={confirmCapture}
                className="btn-primary btn-lg"
              >
                ✓ Use Photo
              </button>
            </div>
            
            <div className="text-center mt-4">
              <p className="text-white/70 text-sm">
                Happy with your Spark? Tap "Use Photo" to continue
              </p>
            </div>
          </div>
        </>
      )}

      {/* Hidden canvas for photo processing */}
      <canvas
        ref={canvasRef}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
}