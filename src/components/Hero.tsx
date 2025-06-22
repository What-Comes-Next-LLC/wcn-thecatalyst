import { deckContent } from "@/content/deckContent";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import ScrollTrigger from "./ScrollTrigger";
import SectionWrapper from "./SectionWrapper";

export default function Hero() {
  const { title, subtitle, video } = deckContent.hero;
  const [showTeaser, setShowTeaser] = useState(true);

  useEffect(() => {
    // Set a timeout to hide the teaser after a few seconds
    // You can adjust this timing or trigger it based on video completion
    const timer = setTimeout(() => {
      setShowTeaser(false);
    }, 15000); // 15 seconds, adjust as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white relative flex items-center justify-center">
      <AnimatePresence>
        {showTeaser && video && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black"
          >
            <video
              src={video}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
              onEnded={() => setShowTeaser(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="container-wide z-10 relative text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showTeaser ? 0 : 1, y: showTeaser ? 20 : 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">{title}</h1>
        <p className="text-xl md:text-2xl leading-relaxed text-slate-200">{subtitle}</p>
      </motion.div>

      {/* Scroll trigger button - only down arrow for Hero section */}
      <ScrollTrigger 
        targetId="problem-section" 
        direction="down" 
        className="z-30"
      />
    </div>
  );
}