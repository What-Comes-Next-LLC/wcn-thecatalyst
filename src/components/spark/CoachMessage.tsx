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
  }, [userId]);

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
        <div className="animate-pulse">
          <div className="h-6 bg-wcn-primary/20 rounded mb-2 w-3/4 mx-auto"></div>
          <div className="h-4 bg-wcn-primary/10 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`text-center ${className}`}>
      {/* Message bubble */}
      <div className="relative inline-block">
        {/* Background bubble */}
        <div className="bg-wcn-primary/20 backdrop-blur-sm rounded-2xl px-6 py-4 border border-wcn-primary/30">
          {/* Message text */}
          <div className="text-lg font-medium text-wcn-text mb-2">
            "{displayMessage.message_text}"
          </div>
          
          {/* Coach attribution */}
          <div className="text-sm text-wcn-text/70">
            — {displayMessage.coach_name}
          </div>
        </div>
        
        {/* Speech bubble tail */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-wcn-primary/20"></div>
        </div>
      </div>
      
      {/* Coaching indicator */}
      <div className="mt-6 flex items-center justify-center space-x-2 text-wcn-text/50 text-sm">
        <span className="w-2 h-2 bg-wcn-accent1 rounded-full animate-pulse"></span>
        <span>Your coach is cheering you on</span>
        <span className="w-2 h-2 bg-wcn-accent1 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></span>
      </div>
    </div>
  );
}