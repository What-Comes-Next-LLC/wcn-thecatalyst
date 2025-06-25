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
          btn-primary btn-xl w-4/5 mx-auto block relative overflow-hidden
          py-6 text-xl shadow-2xl border-2 border-wcn-accent2/30
          bg-gradient-to-r from-wcn-primary to-wcn-accent1
          focus:ring-4 focus:ring-wcn-accent2/50 focus:ring-offset-2
          transition-all duration-300
          ${isLoading ? 'animate-pulse' : 'hover:scale-105 hover:shadow-3xl active:scale-95'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        aria-label="Capture Spark moment with camera"
      >
        {/* Button content */}
        <div className="flex items-center justify-center space-x-4">
          <div className="w-8 h-8 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
              <path d="M23 19C23 20.1046 22.1046 21 21 21H3C1.89543 21 1 20.1046 1 19V8C1 6.89543 1.89543 6 3 6H7L9 4H15L17 6H21C22.1046 6 23 6.89543 23 8V19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-bold text-lg tracking-wide">
            {isLoading ? 'CAPTURING...' : 'CAPTURE SPARK'}
          </span>
        </div>
        
        {/* Enhanced glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-r from-wcn-accent2/0 via-wcn-accent2/10 to-wcn-accent2/0 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </button>

      {/* Alternative Upload Option */}
      <div className="mt-8 text-center">
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="text-wcn-text/80 hover:text-wcn-text text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-wcn-accent2/50 rounded-lg px-4 py-2 hover:bg-wcn-primary/20 backdrop-blur-sm flex items-center justify-center"
          aria-expanded={showOptions}
          aria-controls="upload-options"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 text-wcn-text/80">
            <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 18 21.1046 18 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Or upload file
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`ml-2 transition-transform duration-200 ${showOptions ? 'rotate-180' : ''} text-wcn-text/60`}>
            <polyline points="6,9 12,15 18,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* File Upload Options */}
        {showOptions && (
          <div 
            id="upload-options"
            className="mt-6 animate-fade-in"
          >
            <div className="bg-wcn-primary/20 backdrop-blur-sm border border-wcn-accent2/30 rounded-xl p-6 mx-auto max-w-sm">
              <button
                onClick={handleFileUpload}
                className="btn-secondary btn-lg w-full shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-wcn-accent2/50 flex items-center justify-center"
                aria-label="Choose file to upload"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
                  <path d="M21.44 11.05L12.25 1.77C11.45 0.97 10.55 0.97 9.75 1.77L0.56 11.05C0.21 11.4 0.21 11.96 0.56 12.31C0.91 12.66 1.47 12.66 1.82 12.31L11 3.13L20.18 12.31C20.53 12.66 21.09 12.66 21.44 12.31C21.79 11.96 21.79 11.4 21.44 11.05Z" fill="currentColor"/>
                  <path d="M11 4V21C11 21.55 11.45 22 12 22C12.55 22 13 21.55 13 21V4C13 3.45 12.55 3 12 3C11.45 3 11 3.45 11 4Z" fill="currentColor"/>
                </svg>
                Choose File
              </button>
              
              <p className="text-sm text-wcn-text/70 mt-4 font-medium">
                JPG, PNG, PDF • Max 10MB
              </p>
            </div>
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