'use client';

import { useState, useRef, useEffect } from 'react';
import { createFocusTrap, announceToScreenReader, announceError, KEYBOARD_KEYS } from '@/lib/accessibility';

interface FileUploadInterfaceProps {
  onFileSelect: (file: File) => void;
  onCancel: () => void;
  acceptedTypes?: string;
  maxSize?: number; // in MB
}

export default function FileUploadInterface({ 
  onFileSelect, 
  onCancel,
  acceptedTypes = "image/*,application/pdf,.pdf,.jpg,.jpeg,.png",
  maxSize = 10
}: FileUploadInterfaceProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set up focus trap
    let cleanupFocusTrap: (() => void) | null = null;
    if (containerRef.current) {
      cleanupFocusTrap = createFocusTrap(containerRef.current);
    }
    
    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === KEYBOARD_KEYS.ESCAPE) {
        onCancel();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Announce file upload interface
    announceToScreenReader('File upload interface opened. Press Escape to cancel.', 'assertive');
    
    // Cleanup on unmount
    return () => {
      cleanupFocusTrap?.();
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCancel]);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }

    // Check file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'application/pdf'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return 'Please select a JPG, PNG, or PDF file';
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      announceError(validationError, 'file validation');
      return;
    }

    setError(null);
    announceToScreenReader(`File selected: ${file.name}. Processing upload...`, 'assertive');
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      announceToScreenReader('File dropped. Validating...', 'polite');
      handleFileSelect(files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-gradient-to-b from-wcn-primary via-wcn-dark to-black z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="File upload interface"
    >
      <div className="container-narrow w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📁</div>
          <h2 className="text-3xl font-bold text-wcn-text mb-2">
            Upload Your Spark
          </h2>
          <p className="text-wcn-text/70">
            Choose a photo or document to capture your progress
          </p>
        </div>

        {/* Drop zone */}
        <div
          className={`
            relative border-2 border-dashed rounded-2xl p-8 text-center
            transition-all duration-200 cursor-pointer focus:outline-none
            focus:ring-4 focus:ring-wcn-accent1/30
            ${dragActive 
              ? 'border-wcn-accent1 bg-wcn-accent1/10' 
              : 'border-wcn-primary/30 hover:border-wcn-accent1/50 hover:bg-wcn-primary/5'
            }
          `}
          onDrop={handleDrop}
          onDragOver={handleDrag}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onClick={openFileDialog}
          onKeyDown={(e) => {
            if (e.key === KEYBOARD_KEYS.ENTER || e.key === KEYBOARD_KEYS.SPACE) {
              e.preventDefault();
              openFileDialog();
            }
          }}
          tabIndex={0}
          role="button"
          aria-label="Click to select file or drag and drop file here"
        >
          {/* Upload icon */}
          <div className="text-4xl mb-4 text-wcn-accent1">
            {dragActive ? '📥' : '⬆️'}
          </div>

          {/* Upload text */}
          <div className="text-wcn-text mb-4">
            <div className="text-lg font-medium mb-2">
              {dragActive ? 'Drop your file here' : 'Drag & drop or click to select'}
            </div>
            <div className="text-sm text-wcn-text/60">
              JPG, PNG, PDF • Max {maxSize}MB
            </div>
          </div>

          {/* File input */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={acceptedTypes}
            onChange={handleInputChange}
            aria-label="Select file to upload"
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300 text-center">
            {error}
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-8 space-y-4">
          <button
            onClick={openFileDialog}
            className="btn-primary btn-xl w-full"
          >
            <span className="mr-2">📎</span>
            Choose File
          </button>

          <button
            onClick={onCancel}
            className="btn-ghost btn-lg w-full"
          >
            ← Back
          </button>
        </div>

        {/* Help text */}
        <div className="mt-6 text-center text-xs text-wcn-text/50">
          <p>Supported formats: JPEG, PNG, PDF</p>
          <p>Your uploads are securely stored and private</p>
        </div>
      </div>
    </div>
  );
}