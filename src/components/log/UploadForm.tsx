'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export function UploadForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState('food-log');
  
  // File selection states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    
    // Clear previous errors/success
    setError(null);
    setSuccess(null);
  };

  // Handle file selection from drop area
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    const file = e.dataTransfer.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      if (fileInputRef.current) {
        // Create a DataTransfer object to set the files property of the input
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
      setError(null);
      setSuccess(null);
    }
  };
  
  // Handle drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-wcn-accent2');
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-wcn-accent2');
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    // Validate if a file is selected
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);
    setUploadProgress(0);

    const formData = new FormData(e.currentTarget);
    formData.append('userId', userId);

    try {
      // Simulate upload progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev === null) return 10;
          return prev >= 90 ? 90 : prev + 10;
        });
      }, 500);

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

      setSuccess('Spark captured successfully!');
      
      // Clear form
      e.currentTarget.reset();
      setSelectedFile(null);
      setSelectedType('food-log');

      // Refresh the page to show new upload
      setTimeout(() => {
        router.refresh();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Upload Type Selection - Enhanced UI */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <button
          type="button"
          onClick={() => setSelectedType('food-log')}
          className={`py-3 px-3 rounded-lg text-center transition-all ${
            selectedType === 'food-log' 
              ? 'bg-wcn-accent1 text-wcn-text font-medium shadow-md transform scale-105' 
              : 'bg-white/5 text-wcn-text/70 hover:bg-white/10 hover:transform hover:scale-102'
          }`}
        >
          <span className="text-xl block mb-1">🍽️</span>
          <span className="text-sm">Food</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedType('progress-photo')}
          className={`py-3 px-3 rounded-lg text-center transition-all ${
            selectedType === 'progress-photo' 
              ? 'bg-wcn-accent1 text-wcn-text font-medium shadow-md transform scale-105' 
              : 'bg-white/5 text-wcn-text/70 hover:bg-white/10 hover:transform hover:scale-102'
          }`}
        >
          <span className="text-xl block mb-1">📸</span>
          <span className="text-sm">Photo</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedType('measurement')}
          className={`py-3 px-3 rounded-lg text-center transition-all ${
            selectedType === 'measurement' 
              ? 'bg-wcn-accent1 text-wcn-text font-medium shadow-md transform scale-105' 
              : 'bg-white/5 text-wcn-text/70 hover:bg-white/10 hover:transform hover:scale-102'
          }`}
        >
          <span className="text-xl block mb-1">📏</span>
          <span className="text-sm">Measure</span>
        </button>
      </div>
      
      {/* Hidden type field */}
      <input type="hidden" name="type" value={selectedType} />

      {/* File Upload - Enhanced with drag and drop */}
      <div 
        className={`rounded-lg border-2 border-dashed ${
          selectedFile ? 'border-wcn-accent2/70 bg-wcn-accent2/10' : 'border-wcn-card hover:border-wcn-accent2/50'
        } transition-all p-6 text-center`}
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <label className="block cursor-pointer">
          {selectedFile ? (
            <div className="flex flex-col items-center">
              <div className="mb-3 text-wcn-accent2 bg-wcn-accent2/20 w-12 h-12 rounded-full flex items-center justify-center">
                {selectedFile.type.includes('image') ? (
                  <span className="text-xl">🖼️</span>
                ) : selectedFile.type.includes('pdf') ? (
                  <span className="text-xl">📄</span>
                ) : (
                  <span className="text-xl">📁</span>
                )}
              </div>
              <span className="block text-wcn-text font-medium mb-1">
                {selectedFile.name}
              </span>
              <span className="text-xs text-wcn-text/60">
                {formatFileSize(selectedFile.size)}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="mt-3 text-xs text-wcn-accent2 hover:text-wcn-accent1 transition-colors"
              >
                Change File
              </button>
            </div>
          ) : (
            <>
              <CloudArrowUpIcon className="h-10 w-10 mx-auto mb-3 text-wcn-text/50" />
              <span className="block text-wcn-text font-medium mb-2">
                {selectedType === 'food-log' ? 'Upload your food diary or photo' :
                selectedType === 'progress-photo' ? 'Upload a progress photo' :
                'Upload your measurements'}
              </span>
              <span className="block text-sm text-wcn-text/60 mb-4">
                Drag and drop or click to select
              </span>
              <span className="inline-block py-2 px-6 bg-wcn-accent2/20 hover:bg-wcn-accent2/30 rounded-lg text-wcn-text/90 transition-colors">
                Select File
              </span>
            </>
          )}
          <input 
            ref={fileInputRef}
            type="file" 
            name="file"
            className="hidden"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileChange}
            required
          />
        </label>
      </div>

      {uploadProgress !== null && isUploading && (
        <div className="w-full bg-wcn-card/50 rounded-full h-3 mb-4 overflow-hidden">
          <div 
            className="bg-wcn-accent1 h-3 rounded-full transition-all duration-300 relative"
            style={{ width: `${uploadProgress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-wcn-accent2/30 to-transparent animate-shimmer"></div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-red-400 text-sm p-3 bg-red-900/20 rounded-lg border border-red-400/30">{error}</p>
      )}

      {success && (
        <p className="text-green-400 text-sm p-3 bg-green-900/20 rounded-lg border border-green-400/30">{success}</p>
      )}

      <button
        type="submit"
        disabled={isUploading || !selectedFile}
        className={`w-full bg-wcn-accent1 text-wcn-text py-4 px-6 rounded-lg font-medium shadow-lg hover:bg-wcn-accent1/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center ${selectedFile ? 'animate-pulse-subtle' : ''}`}
      >
        {isUploading ? (
          <>
            <span className="animate-pulse mr-2">⚡</span>
            <span>Capturing...</span>
          </>
        ) : (
          <>
            <span className="mr-2">⚡</span>
            <span>Capture Spark Moment</span>
          </>
        )}
      </button>
    </form>
  );
} 