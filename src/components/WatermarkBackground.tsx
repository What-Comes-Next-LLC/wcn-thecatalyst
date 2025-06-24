import React, { ReactNode } from 'react';
import Image from 'next/image';

interface WatermarkBackgroundProps {
  children: ReactNode;
  className?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export default function WatermarkBackground({ 
  children, 
  className = "",
  gradientFrom = "from-wcn-primary",
  gradientTo = "to-wcn-accent1"
}: WatermarkBackgroundProps) {
  return (
    <main className={`min-h-screen bg-wcn-gradient ${gradientFrom} ${gradientTo} relative overflow-hidden ${className}`}>
      {/* Watermark Logo */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute inset-0 bg-wcn-primary/5"></div>
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/logo-official.png"
            alt="What Comes Next Logo"
            fill
            className="object-contain opacity-[0.15] mix-blend-overlay"
            priority
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        {children}
      </div>
    </main>
  );
}