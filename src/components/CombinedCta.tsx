import { deckContent } from "@/content/deckContent";
import SectionWrapper from "./SectionWrapper";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function CombinedCta() {
  const { 
    heading, 
    paragraphs, 
    buttonText, 
    socialProof, 
    finalEncouragement,
    products,
    socialMedia
  } = deckContent.combinedCta;
  
  const [showPulse, setShowPulse] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  
  // Start the pulse animation after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPulse(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Function to render social media icon
  const renderSocialIcon = (iconName: string) => {
    switch (iconName) {
      case 'instagram':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        );
      case 'threads':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
            <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"></path>
          </svg>
        );
      case 'facebook':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
          </svg>
        );
      case 'bluesky':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <SectionWrapper bgColor="bg-wcn-black" textColor="text-white">
      <div className="relative">
        {/* Completion indicator - subtle checkmark that appears */}
        <motion.div 
          className="absolute -top-16 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="w-16 h-16 rounded-full bg-wcn-mid flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </motion.div>
        
        <div className="space-y-6 text-center">
          <motion.h2 
            className="text-4xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {heading}
          </motion.h2>
          
          {paragraphs.map((p, i) => (
            <motion.p 
              key={i} 
              className="text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * (i + 1), duration: 0.5 }}
            >
              {p}
            </motion.p>
          ))}
          
          {/* Social proof element */}
          {socialProof && (
            <motion.div 
              className="text-sm text-wcn-gray mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              {socialProof}
            </motion.div>
          )}
          
          {/* Main CTA button with pulse effect */}
          <motion.div
            className="relative inline-block mt-8"
            animate={showPulse ? { scale: [1, 1.05, 1] } : {}}
            transition={{ 
              repeat: Infinity, 
              repeatType: "reverse", 
              duration: 2,
              ease: "easeInOut"
            }}
          >
            <button
              onClick={() => setShowProducts(true)}
              className="inline-block px-8 py-4 bg-wcn-light text-black font-bold text-lg rounded-xl hover:bg-wcn-mid transition-all shadow-lg hover:shadow-xl"
            >
              {buttonText}
            </button>
          </motion.div>
          
          {/* Product tiers */}
          {showProducts && (
            <motion.div 
              className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {products.map((product, i) => (
                <motion.a
                  key={i}
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-wcn-darker rounded-lg hover:bg-wcn-dark transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                >
                  <h3 className="text-lg font-bold">{product.name}</h3>
                  <p className="text-wcn-light">{product.price}</p>
                </motion.a>
              ))}
            </motion.div>
          )}
          
          {/* Social media links */}
          <motion.div 
            className="flex justify-center space-x-6 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            {socialMedia && socialMedia.map((social, i) => (
              <motion.a
                key={i}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-wcn-gray hover:text-white transition-colors"
                whileHover={{ scale: 1.2 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 + (0.1 * i), duration: 0.5 }}
              >
                {renderSocialIcon(social.icon)}
                <span className="sr-only">{social.name}</span>
              </motion.a>
            ))}
          </motion.div>
          
          {/* Final encouragement */}
          {finalEncouragement && (
            <motion.p 
              className="text-sm text-wcn-gray mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5, duration: 0.5 }}
            >
              {finalEncouragement}
            </motion.p>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
} 