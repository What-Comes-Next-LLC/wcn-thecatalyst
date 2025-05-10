import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface ScrollTriggerProps {
  targetId: string;
  direction: "up" | "down";
  className?: string;
  showImmediately?: boolean;
}

export default function ScrollTrigger({ 
  targetId, 
  direction, 
  className = "",
  showImmediately = false
}: ScrollTriggerProps) {
  const [isVisible, setIsVisible] = useState(showImmediately);

  useEffect(() => {
    // If showImmediately is true, show the trigger right away
    if (showImmediately) {
      setIsVisible(true);
      return;
    }

    // For the Hero section's down arrow, we need to wait for the teaser to finish
    if (targetId === "problem-section") {
      // Check if the teaser is still showing
      const checkTeaserInterval = setInterval(() => {
        const heroSection = document.getElementById("hero-section");
        if (heroSection) {
          // Look for the teaser video element
          const teaserVideo = heroSection.querySelector("video");
          if (!teaserVideo) {
            // If no video element is found, the teaser has finished
            setIsVisible(true);
            clearInterval(checkTeaserInterval);
          }
        }
      }, 500);

      return () => clearInterval(checkTeaserInterval);
    } else {
      // For all other sections, show the trigger immediately
      setIsVisible(true);
    }
  }, [targetId, showImmediately]);

  const scrollToSection = () => {
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const arrowPath = direction === "down" 
    ? "M19 14l-7 7m0 0l-7-7m7 7V3" 
    : "M5 10l7-7m0 0l7 7m-7-7v18";

  if (!isVisible) return null;

  return (
    <motion.button
      onClick={scrollToSection}
      className={`absolute ${direction === "down" ? "bottom-8" : "top-8"} left-1/2 transform -translate-x-1/2 z-30 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 backdrop-blur-sm transition-all ${className}`}
      initial={{ opacity: 0, y: direction === "down" ? 20 : -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-6 w-6" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d={arrowPath} 
        />
      </svg>
    </motion.button>
  );
} 