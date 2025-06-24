'use client';

import { useState } from 'react';

interface CaptureButtonProps {
  onCameraClick: () => void;
  onFileClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function CaptureButton({ 
  onCameraClick, 
  onFileClick, 
  isLoading = false, 
  disabled = false,
  className = '' 
}: CaptureButtonProps) {
  const [showOptions, setShowOptions] = useState(false);

  const handleMainClick = () => {
    if (disabled || isLoading) return;
    
    // Try camera first, fallback handled in parent
    onCameraClick();
  };

  const handleFileUpload = () => {
    setShowOptions(false);
    onFileClick();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Capture Button */}
      <button
        onClick={handleMainClick}
        disabled={disabled || isLoading}
        className={`
          btn-primary btn-xl w-3/4 mx-auto block relative overflow-hidden
          focus:ring-2 focus:ring-wcn-primary focus:ring-offset-2
          transition-all duration-200
          ${isLoading ? 'animate-pulse' : 'hover:scale-105 active:scale-95'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        aria-label="Capture Spark moment with camera"
      >
        {/* Button content */}
        <div className="flex items-center justify-center space-x-3">
          <span className="text-2xl" role="img" aria-label="Camera">
            {isLoading ? '⚡' : '📸'}
          </span>
          <span className="font-bold">
            {isLoading ? 'CAPTURING...' : 'CAPTURE SPARK'}
          </span>
        </div>
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
      </button>

      {/* Alternative Upload Option */}
      <div className="mt-4 text-center">
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="text-wcn-text/70 hover:text-wcn-text text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-wcn-primary/50 rounded px-2 py-1"
          aria-expanded={showOptions}
          aria-controls="upload-options"
        >
          <span className="mr-2">📁</span>
          Or upload file
          <span className={`ml-1 transition-transform duration-200 ${showOptions ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {/* File Upload Options */}
        {showOptions && (
          <div 
            id="upload-options"
            className="mt-3 animate-fade-in"
          >
            <button
              onClick={handleFileUpload}
              className="btn-secondary btn-lg w-3/4 mx-auto block focus:ring-2 focus:ring-wcn-primary focus:ring-offset-2"
              aria-label="Choose file to upload"
            >
              <span className="mr-2">📎</span>
              Choose File
            </button>
            
            <p className="text-xs text-wcn-text/50 mt-2 px-4">
              JPG, PNG, PDF • Max 10MB
            </p>
          </div>
        )}
      </div>

      {/* Touch target for accessibility */}
      <div className="sr-only" aria-live="polite">
        {isLoading && 'Capturing your Spark moment...'}
        {disabled && 'Capture button is currently disabled'}
      </div>
    </div>
  );
}