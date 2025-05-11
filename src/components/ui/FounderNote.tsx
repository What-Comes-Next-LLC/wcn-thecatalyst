'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Caveat } from 'next/font/google';

// Load the Caveat font which has a handwritten style perfect for a note
const caveat = Caveat({ subsets: ['latin'] });

export default function FounderNote() {
  const [isOpen, setIsOpen] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  
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
    // Start subtle pulsing glow after a delay
    const glowTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setIsGlowing(prev => !prev);
      }, 2000);
      return () => clearInterval(interval);
    }, 3000);
    
    return () => clearTimeout(glowTimer);
  }, []);
  
  // Bounce animation variants
  const tabAnimations = {
    initial: { y: 0 },
    bounce: { 
      y: [0, -8, 0], 
      transition: { 
        duration: 0.6,
        repeat: 2,
        repeatType: "reverse" as const,
        ease: "easeOut" 
      } 
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      {/* The sticky note tab that's always visible */}
      <motion.div 
        className={`founder-note-tab bg-wcn-accent2 shadow-md rounded-t-lg px-4 py-2 cursor-pointer transform rotate-2 border-t border-x border-wcn-card hover:rotate-0 transition-all ${isGlowing ? 'animate-glow' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        initial="initial"
        animate={isGlowing ? "bounce" : "initial"}
        variants={tabAnimations}
        style={{
          boxShadow: isGlowing 
            ? '0 0 10px 2px rgba(156, 197, 161, 0.7), 0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
      >
        <p className={`${caveat.className} text-wcn-dark font-medium text-base`}>A note from our Founder</p>
      </motion.div>
      
      {/* The expanded sticky note content */}
      {isOpen && (
        <motion.div 
          className={`founder-note-content bg-wcn-accent2 max-w-xs p-5 rounded-lg rounded-tr-none shadow-lg border border-wcn-card transform rotate-2`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
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
        </motion.div>
      )}

      {/* Add global styles for the glow animation */}
      <style jsx global>{`
        @keyframes glow {
          0% { box-shadow: 0 0 5px 1px rgba(156, 197, 161, 0.4), 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          50% { box-shadow: 0 0 12px 3px rgba(156, 197, 161, 0.7), 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          100% { box-shadow: 0 0 5px 1px rgba(156, 197, 161, 0.4), 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 