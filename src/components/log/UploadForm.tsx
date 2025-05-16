'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function UploadForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

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

      setSuccess('File uploaded successfully!');
      
      // Clear form
      e.currentTarget.reset();

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-wcn-text">
          Upload Type
        </label>
        <select 
          name="type"
          className="w-full rounded-lg border-2 border-wcn-card bg-white/5 text-wcn-text placeholder-wcn-text/50 focus:border-wcn-accent1 focus:ring-2 focus:ring-wcn-accent1/50 focus:outline-none transition-all duration-200"
          required
        >
          <option value="food-log">Food Log</option>
          <option value="progress-photo">Progress Photo</option>
          <option value="measurement">Measurements</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-wcn-text">
          File Upload
        </label>
        <input 
          type="file" 
          name="file"
          className="w-full rounded-lg border-2 border-wcn-card bg-white/5 text-wcn-text file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-wcn-text file:bg-wcn-accent1/20 file:hover:bg-wcn-accent1/30 file:transition-colors file:cursor-pointer"
          accept=".jpg,.jpeg,.png,.pdf"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-wcn-text">
          Notes (Optional)
        </label>
        <textarea 
          name="notes"
          className="w-full rounded-lg border-2 border-wcn-card bg-white/5 text-wcn-text placeholder-wcn-text/50 focus:border-wcn-accent1 focus:ring-2 focus:ring-wcn-accent1/50 focus:outline-none transition-all duration-200"
          rows={3}
          placeholder="Add any details about this upload..."
        />
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
        className="w-full bg-wcn-accent1 text-wcn-text py-3 px-6 rounded-lg font-medium shadow-lg hover:bg-wcn-accent1/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isUploading ? 'Uploading...' : 'Submit'}
      </button>
    </form>
  );
} 