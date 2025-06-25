'use client';

import { useState, useEffect } from 'react';

interface CoachMessageData {
  message_text: string;
  coach_name: string;
  created_at: string;
}

interface CoachMessageProps {
  userId?: string;
  className?: string;
}

// Fallback motivational messages
const DEFAULT_MESSAGES = [
  { message: "Every Spark counts! 🔥", coach: "The Catalyst Team" },
  { message: "Small steps, big changes! ✨", coach: "The Catalyst Team" },
  { message: "You're building something amazing! 🌟", coach: "The Catalyst Team" },
  { message: "Consistency beats perfection! 💪", coach: "The Catalyst Team" },
  { message: "Your future self will thank you! 🙏", coach: "The Catalyst Team" },
  { message: "Progress, not perfection! 📈", coach: "The Catalyst Team" },
  { message: "Every upload is a victory! 🎉", coach: "The Catalyst Team" },
  { message: "Keep that momentum going! 🚀", coach: "The Catalyst Team" },
  { message: "You're stronger than you think! 💪", coach: "The Catalyst Team" },
  { message: "Document your journey! 📸", coach: "The Catalyst Team" },
];

export default function CoachMessage({ userId, className = '' }: CoachMessageProps) {
  const [coachMessage, setCoachMessage] = useState<CoachMessageData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fallbackMessage] = useState(() => {
    // Select a random fallback message on component mount
    return DEFAULT_MESSAGES[Math.floor(Math.random() * DEFAULT_MESSAGES.length)];
  });

  useEffect(() => {
    if (userId) {
      fetchCoachMessage();
    }
  }, [userId]); // fetchCoachMessage is stable, userId dependency sufficient

  const fetchCoachMessage = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      
      // Call API to get active coach message
      const response = await fetch(`/api/spark/coach-message?userId=${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.message) {
          setCoachMessage(data.message);
        }
      }
    } catch (error) {
      console.error('Error fetching coach message:', error);
      // Will fall back to default message
    } finally {
      setIsLoading(false);
    }
  };

  const displayMessage = coachMessage || {
    message_text: fallbackMessage.message,
    coach_name: fallbackMessage.coach,
    created_at: new Date().toISOString(),
  };

  if (isLoading) {
    return (
      <div className={`text-center ${className}`}>
        <div className="bg-wcn-primary/20 backdrop-blur-sm rounded-2xl px-8 py-6 border-2 border-wcn-accent1/40 shadow-xl">
          <div className="animate-pulse">
            <div className="h-8 bg-wcn-primary/30 rounded-lg mb-3 w-3/4 mx-auto"></div>
            <div className="h-6 bg-wcn-primary/20 rounded-lg w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`text-center ${className}`}>
      {/* Message bubble */}
      <div className="relative inline-block">
        {/* Background bubble with enhanced styling */}
        <div className="bg-gradient-to-br from-wcn-accent1/30 to-wcn-primary/20 backdrop-blur-sm rounded-2xl px-8 py-6 border-2 border-wcn-accent1/40 shadow-xl">
          {/* Coach icon */}
          <div className="mb-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto text-wcn-accent2">
              <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          {/* Message text */}
          <div className="text-xl font-semibold text-wcn-text mb-3 leading-relaxed">
            &ldquo;{displayMessage.message_text}&rdquo;
          </div>
          
          {/* Coach attribution */}
          <div className="text-base text-wcn-text/80 font-medium">
            — {displayMessage.coach_name}
          </div>
        </div>
        
        {/* Enhanced speech bubble tail */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
          <div className="w-0 h-0 border-l-10 border-r-10 border-t-10 border-l-transparent border-r-transparent border-t-wcn-accent1/40"></div>
        </div>
      </div>
      
      {/* Enhanced coaching indicator */}
      <div className="mt-8 flex items-center justify-center space-x-3 text-wcn-text/70 text-base font-medium">
        <span className="w-3 h-3 bg-wcn-accent1 rounded-full animate-pulse shadow-lg"></span>
        <span>Your coach is cheering you on</span>
        <span className="w-3 h-3 bg-wcn-accent2 rounded-full animate-pulse shadow-lg" style={{ animationDelay: '0.5s' }}></span>
      </div>
    </div>
  );
}