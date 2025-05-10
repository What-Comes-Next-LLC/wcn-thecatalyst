import React, { ReactNode } from 'react';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  bgColor?: string;
  textColor?: string;
  twoColumn?: boolean;
  imagePosition?: 'left' | 'right';
}

export default function SectionWrapper({ 
  children, 
  className = "", 
  bgColor = "bg-white", 
  textColor = "text-black",
  twoColumn = false,
  imagePosition = 'right'
}: SectionWrapperProps) {
  const childrenArray = React.Children.toArray(children);
  
  return (
    <div className={`w-full h-full flex items-center justify-center overflow-hidden ${bgColor} ${textColor} ${className}`}>
      <div className={`w-full max-w-5xl mx-auto px-6 py-12 overflow-y-auto max-h-full ${twoColumn ? 'flex flex-col md:flex-row gap-8 items-center' : ''}`}>
        {twoColumn && childrenArray.length >= 2 ? (
          <>
            {imagePosition === 'left' ? (
              <>
                <div className="w-full md:w-1/2 flex-shrink-0">{childrenArray[1]}</div>
                <div className="w-full md:w-1/2">{childrenArray[0]}</div>
              </>
            ) : (
              <>
                <div className="w-full md:w-1/2">{childrenArray[0]}</div>
                <div className="w-full md:w-1/2 flex-shrink-0">{childrenArray[1]}</div>
              </>
            )}
          </>
        ) : (
          children
        )}
      </div>
    </div>
  );
} 