import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadContent } from '../../content/uploadContent';

interface UploadInterfaceProps {
  onUploadComplete?: (file: File) => void;
}

export const UploadInterface: React.FC<UploadInterfaceProps> = ({ onUploadComplete }) => {
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError(uploadContent.upload.errorMessages.fileTooLarge);
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      setError(uploadContent.upload.errorMessages.invalidFormat);
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      // TODO: Implement actual file upload logic here
      // This is where you would make an API call to upload the file
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      onUploadComplete?.(file);
    } catch (err) {
      setError(uploadContent.upload.errorMessages.uploadFailed);
    } finally {
      setIsUploading(false);
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'text/plain': ['.txt']
    },
    maxFiles: 1
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {uploadContent.upload.title}
        </h1>
        <p className="text-gray-600">
          {uploadContent.upload.description}
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="text-4xl text-gray-400">
            📁
          </div>
          <p className="text-lg text-gray-600">
            {uploadContent.upload.dragAndDropText}
          </p>
          <p className="text-sm text-gray-500">
            {uploadContent.upload.supportedFormats.join(', ')}
          </p>
          {isUploading && (
            <div className="text-blue-600">
              {uploadContent.upload.uploadingText}
            </div>
          )}
          {error && (
            <div className="text-red-600">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 