'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function UploadForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsUploading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append('userId', userId);

    try {
      const response = await fetch('/api/log', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      // Refresh the page to show new upload
      router.refresh();
    } catch (err) {
      setError('Failed to upload. Please try again.');
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

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
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