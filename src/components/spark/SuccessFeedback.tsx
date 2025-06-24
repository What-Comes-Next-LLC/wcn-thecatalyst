'use client';

import { useState, useEffect } from 'react';
import { announceToScreenReader, announceMilestone } from '@/lib/accessibility';

interface SuccessFeedbackProps {
  sparkNumber: number;
  onComplete: () => void;
  isVisible: boolean;
}

const MILESTONE_MESSAGES = {
  1: { emoji: '🌟', message: 'First Spark captured!' },
  10: { emoji: '🔥', message: '10 Sparks strong!' },
  25: { emoji: '⚡', message: 'Quarter century!' },
  50: { emoji: '✨', message: 'Little Dipper complete!' },
  100: { emoji: '🌌', message: 'Big Dipper unlocked!' },
  250: { emoji: '🌠', message: 'Orion constellation!' },
  500: { emoji: '🌟', message: 'Winter sky master!' },
  1000: { emoji: '🌌', message: 'GALAXY COMPLETE!' },
};

const getRandomCelebration = () => {
  const celebrations = [
    'Amazing work!',
    'Keep it up!',
    'You\'re on fire!',
    'Fantastic!',
    'Well done!',
    'Incredible!',
    'You\'re crushing it!',
    'Phenomenal!',
    'Outstanding!',
    'Brilliant!',
  ];
  return celebrations[Math.floor(Math.random() * celebrations.length)];
};

export default function SuccessFeedback({ sparkNumber, onComplete, isVisible }: SuccessFeedbackProps) {
  const [stage, setStage] = useState<'entering' | 'celebrating' | 'exiting'>('entering');
  const [showConfetti, setShowConfetti] = useState(false);

  const isMilestone = sparkNumber in MILESTONE_MESSAGES;
  const milestoneData = isMilestone ? MILESTONE_MESSAGES[sparkNumber as keyof typeof MILESTONE_MESSAGES] : null;

  useEffect(() => {
    if (!isVisible) return;

    // Announce success immediately
    announceToScreenReader(`Spark number ${sparkNumber} captured successfully!`, 'assertive');
    
    // Announce milestone if applicable
    if (isMilestone) {
      setTimeout(() => {
        announceMilestone(sparkNumber);
      }, 500);
    }

    const timer1 = setTimeout(() => setStage('celebrating'), 100);
    const timer2 = setTimeout(() => setShowConfetti(true), 300);
    const timer3 = setTimeout(() => setStage('exiting'), 2500);
    const timer4 = setTimeout(() => {
      setShowConfetti(false);
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [isVisible, onComplete, sparkNumber, isMilestone]);

  if (!isVisible) return null;

  return (
    <div 
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        bg-gradient-to-b from-wcn-primary/90 via-wcn-dark/90 to-black/90
        backdrop-blur-sm transition-all duration-500
        ${stage === 'entering' ? 'opacity-0 scale-95' : ''}
        ${stage === 'celebrating' ? 'opacity-100 scale-100' : ''}
        ${stage === 'exiting' ? 'opacity-0 scale-105' : ''}
      `}
      role="dialog"
      aria-modal="true"
      aria-live="assertive"
      aria-label={`Success: Spark ${sparkNumber} captured${isMilestone ? ', milestone achieved' : ''}`}
    >
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 animate-bounce`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#49a078', '#9cc5a1', '#216869'][Math.floor(Math.random() * 3)],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Main content */}
      <div className="text-center px-8">
        {/* Success icon */}
        <div 
          className={`
            text-8xl mb-6 transition-all duration-500
            ${stage === 'celebrating' ? 'animate-bounce' : ''}
          `}
        >
          {milestoneData ? milestoneData.emoji : '⚡'}
        </div>

        {/* Main message */}
        <h1 className="text-4xl md:text-5xl font-bold text-wcn-text mb-4">
          Spark #{sparkNumber} Captured!
        </h1>

        {/* Milestone or celebration message */}
        <div className="text-xl md:text-2xl text-wcn-accent2 mb-8">
          {milestoneData ? milestoneData.message : getRandomCelebration()}
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center space-x-2 text-wcn-text/80">
          <div className="w-8 h-1 bg-wcn-accent1 rounded-full"></div>
          <span className="text-lg font-medium">{sparkNumber} / 1000</span>
          <div className="w-8 h-1 bg-wcn-accent1 rounded-full"></div>
        </div>

        {/* Special milestone celebration */}
        {isMilestone && (
          <div className="mt-8 text-wcn-accent1">
            <div className="text-sm font-medium mb-2">🎉 MILESTONE ACHIEVED! 🎉</div>
            <div className="text-xs text-wcn-text/60">
              Check your constellation for new stars!
            </div>
          </div>
        )}

        {/* Auto-dismiss indicator */}
        <div className="mt-8">
          <div className="w-16 h-1 bg-wcn-primary/30 rounded-full mx-auto overflow-hidden">
            <div 
              className="h-full bg-wcn-accent1 rounded-full transition-all duration-2500 ease-linear"
              style={{ 
                width: stage === 'celebrating' ? '100%' : '0%'
              }}
            />
          </div>
          <p className="text-xs text-wcn-text/50 mt-2">
            Auto-closing...
          </p>
        </div>
      </div>

      {/* Tap to dismiss */}
      <button
        onClick={onComplete}
        className="absolute inset-0 w-full h-full focus:outline-none"
        aria-label="Dismiss success message"
      />
    </div>
  );
}