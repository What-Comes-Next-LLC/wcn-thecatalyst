'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Caveat } from 'next/font/google';

// Load the Caveat font which has a handwritten style perfect for a note
const caveat = Caveat({ subsets: ['latin'] });

export default function FounderNote() {
  const [isOpen, setIsOpen] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  
  // Close the note if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isOpen && !target.closest('.founder-note-content')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Periodic gentle bounce and glow effect
  useEffect(() => {
    // Start subtle pulsing glow and bounce after a delay
    const effectTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setIsGlowing(prev => !prev);
        setIsBouncing(true);
        // Reset bounce after animation completes
        setTimeout(() => setIsBouncing(false), 1200);
      }, 4000);
      return () => clearInterval(interval);
    }, 3000);
    
    return () => clearTimeout(effectTimer);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      {/* The sticky note tab that's always visible */}
      <div 
        className={`founder-note-tab bg-wcn-accent2 shadow-md rounded-t-lg px-4 py-2 cursor-pointer transform rotate-2 border-t border-x border-wcn-card hover:rotate-0 hover:scale-105 transition-all duration-300 ${isGlowing ? 'animate-glow' : ''} ${isBouncing ? 'animate-bounce' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          boxShadow: isGlowing 
            ? '0 0 10px 2px rgba(156, 197, 161, 0.7), 0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
      >
        <p className={`${caveat.className} text-wcn-dark font-medium text-base`}>A note from our Founder</p>
      </div>
      
      {/* The expanded sticky note content */}
      {isOpen && (
        <div 
          className={`founder-note-content bg-wcn-accent2 max-w-xs p-5 rounded-lg rounded-tr-none shadow-lg border border-wcn-card transform rotate-2 animate-slide-in`}
          style={{ 
            backgroundImage: 'linear-gradient(to bottom right, rgba(156, 197, 161, 1), rgba(156, 197, 161, 0.85))',
          }}
        >
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-wcn-primary/20 rounded-full"></div>
          <h3 className={`${caveat.className} text-wcn-primary font-bold text-xl mb-2`}>From Jason Rashaad</h3>
          <p className={`${caveat.className} text-wcn-dark text-base mb-4 italic`}>
            "Thank you for taking the time to learn more about What Comes Next and our flagship product, The Catalyst..."
          </p>
          <Link 
            href="/foundersletter" 
            className="inline-block text-wcn-primary font-medium text-sm underline hover:text-wcn-primary/80"
          >
            Read the full letter →
          </Link>
        </div>
      )}

      {/* Add global styles for animations */}
      <style jsx global>{`
        @keyframes glow {
          0% { box-shadow: 0 0 5px 1px rgba(156, 197, 161, 0.4), 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          50% { box-shadow: 0 0 12px 3px rgba(156, 197, 161, 0.7), 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          100% { box-shadow: 0 0 5px 1px rgba(156, 197, 161, 0.4), 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        }
        
        @keyframes slide-in {
          0% { 
            opacity: 0; 
            transform: translateY(20px) rotate(2deg); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0) rotate(2deg); 
          }
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
} 