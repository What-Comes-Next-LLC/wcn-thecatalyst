'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

export function UploadForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState('food-log');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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

  // Handle file type selection
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Upload Type Selection - Simplified UI */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <button
          type="button"
          onClick={() => setSelectedType('food-log')}
          className={`py-2 px-3 rounded-lg text-center transition-colors ${
            selectedType === 'food-log' 
              ? 'bg-wcn-accent1 text-wcn-text font-medium' 
              : 'bg-white/5 text-wcn-text/70 hover:bg-white/10'
          }`}
        >
          🍽️ Food
        </button>
        <button
          type="button"
          onClick={() => setSelectedType('progress-photo')}
          className={`py-2 px-3 rounded-lg text-center transition-colors ${
            selectedType === 'progress-photo' 
              ? 'bg-wcn-accent1 text-wcn-text font-medium' 
              : 'bg-white/5 text-wcn-text/70 hover:bg-white/10'
          }`}
        >
          📸 Photo
        </button>
        <button
          type="button"
          onClick={() => setSelectedType('measurement')}
          className={`py-2 px-3 rounded-lg text-center transition-colors ${
            selectedType === 'measurement' 
              ? 'bg-wcn-accent1 text-wcn-text font-medium' 
              : 'bg-white/5 text-wcn-text/70 hover:bg-white/10'
          }`}
        >
          📏 Measure
        </button>
      </div>
      
      {/* Hidden type field that gets the selected value */}
      <input type="hidden" name="type" value={selectedType} />

      {/* File Upload - More Prominent */}
      <div className="rounded-lg border-2 border-dashed border-wcn-card hover:border-wcn-accent2/50 transition-colors p-4 text-center">
        <label className="block cursor-pointer">
          <CloudArrowUpIcon className="h-8 w-8 mx-auto mb-2 text-wcn-text/50" />
          <span className="block text-wcn-text mb-2">
            {selectedType === 'food-log' ? 'Upload your food diary or photo' :
             selectedType === 'progress-photo' ? 'Upload a progress photo' :
             'Upload your measurements'}
          </span>
          <input 
            type="file" 
            name="file"
            className="hidden"
            accept=".jpg,.jpeg,.png,.pdf"
            required
          />
          <span className="inline-block py-2 px-4 bg-wcn-accent2/20 hover:bg-wcn-accent2/30 rounded-lg text-wcn-text/90 transition-colors">
            Select File
          </span>
        </label>
      </div>

      {uploadProgress !== null && isUploading && (
        <div className="w-full bg-wcn-card/50 rounded-full h-2.5 mb-4">
          <div 
            className="bg-wcn-accent1 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${uploadProgress}%` }}
          />
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
        disabled={isUploading}
        className="w-full bg-wcn-accent1 text-wcn-text py-3 px-6 rounded-lg font-medium shadow-lg hover:bg-wcn-accent1/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
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