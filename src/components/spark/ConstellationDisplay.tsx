'use client';

import { useMemo } from 'react';

interface Star {
  id: string;
  x: number;
  y: number;
  size: number;
  constellation?: string;
  isHighlight?: boolean;
}

interface ConstellationDisplayProps {
  sparkCount: number;
  className?: string;
}

// Constellation patterns (relative coordinates 0-100)
const CONSTELLATION_PATTERNS = {
  littleDipper: [
    { x: 20, y: 30, isHighlight: true },
    { x: 25, y: 45 },
    { x: 35, y: 55 },
    { x: 45, y: 50 },
    { x: 55, y: 45 },
    { x: 65, y: 40 },
    { x: 75, y: 35, isHighlight: true },
  ],
  bigDipper: [
    { x: 15, y: 70 },
    { x: 25, y: 75 },
    { x: 35, y: 73 },
    { x: 45, y: 68 },
    { x: 55, y: 65 },
    { x: 62, y: 58 },
    { x: 68, y: 50 },
  ],
  orion: [
    // Orion's belt
    { x: 45, y: 40, isHighlight: true },
    { x: 50, y: 42, isHighlight: true },
    { x: 55, y: 44, isHighlight: true },
    // Shoulders and feet
    { x: 35, y: 25 },
    { x: 65, y: 28 },
    { x: 40, y: 60 },
    { x: 60, y: 58 },
  ],
};

function generateRandomStars(count: number, excludePatterns: string[] = []): Star[] {
  const stars: Star[] = [];
  const usedPositions = new Set<string>();
  
  // Add constellation patterns first
  if (count >= 50 && !excludePatterns.includes('littleDipper')) {
    CONSTELLATION_PATTERNS.littleDipper.forEach((pos, index) => {
      stars.push({
        id: `little-dipper-${index}`,
        x: pos.x,
        y: pos.y,
        size: pos.isHighlight ? 3 : 2,
        constellation: 'littleDipper',
        isHighlight: pos.isHighlight,
      });
      usedPositions.add(`${Math.round(pos.x)}-${Math.round(pos.y)}`);
    });
  }
  
  if (count >= 100 && !excludePatterns.includes('bigDipper')) {
    CONSTELLATION_PATTERNS.bigDipper.forEach((pos, index) => {
      stars.push({
        id: `big-dipper-${index}`,
        x: pos.x,
        y: pos.y,
        size: 2.5,
        constellation: 'bigDipper',
      });
      usedPositions.add(`${Math.round(pos.x)}-${Math.round(pos.y)}`);
    });
  }
  
  if (count >= 250 && !excludePatterns.includes('orion')) {
    CONSTELLATION_PATTERNS.orion.forEach((pos, index) => {
      stars.push({
        id: `orion-${index}`,
        x: pos.x,
        y: pos.y,
        size: pos.isHighlight ? 3.5 : 2.5,
        constellation: 'orion',
        isHighlight: pos.isHighlight,
      });
      usedPositions.add(`${Math.round(pos.x)}-${Math.round(pos.y)}`);
    });
  }
  
  // Fill remaining with random stars
  const remainingCount = Math.max(0, count - stars.length);
  for (let i = 0; i < remainingCount; i++) {
    let x: number, y: number, posKey: string;
    let attempts = 0;
    
    // Try to find a position that doesn't overlap
    do {
      x = Math.random() * 90 + 5; // Keep stars away from edges
      y = Math.random() * 80 + 10;
      posKey = `${Math.round(x)}-${Math.round(y)}`;
      attempts++;
    } while (usedPositions.has(posKey) && attempts < 50);
    
    if (!usedPositions.has(posKey)) {
      stars.push({
        id: `random-${i}`,
        x,
        y,
        size: Math.random() * 1.5 + 1, // Size between 1 and 2.5
      });
      usedPositions.add(posKey);
    }
  }
  
  return stars;
}

export default function ConstellationDisplay({ sparkCount, className = '' }: ConstellationDisplayProps) {
  const stars = useMemo(() => generateRandomStars(sparkCount), [sparkCount]);
  
  const getStarColor = (star: Star, index: number) => {
    if (star.constellation) {
      return star.isHighlight ? '#9cc5a1' : '#49a078'; // WCN Accent 2 and 1
    }
    return index < sparkCount ? '#49a078' : '#374151'; // WCN Accent 1 or dim gray
  };
  
  const getStarOpacity = (star: Star, index: number) => {
    if (star.constellation) {
      return star.isHighlight ? 1 : 0.8;
    }
    return index < sparkCount ? 0.7 : 0.3;
  };

  return (
    <div className={`relative w-full h-64 md:h-80 ${className}`}>
      {/* Constellation SVG */}
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background gradient */}
        <defs>
          <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Render constellation connection lines first */}
        {sparkCount >= 50 && (
          <g className="constellation-lines" opacity="0.3">
            {/* Little Dipper connections */}
            <path
              d="M20,30 L25,45 L35,55 L45,50 L55,45 L65,40 L75,35"
              stroke="#49a078"
              strokeWidth="0.2"
              fill="none"
              className="animate-fade-in"
              style={{ animationDelay: '1s' }}
            />
          </g>
        )}
        
        {sparkCount >= 100 && (
          <g className="constellation-lines" opacity="0.3">
            {/* Big Dipper connections */}
            <path
              d="M15,70 L25,75 L35,73 L45,68 M45,68 L55,65 L62,58 L68,50"
              stroke="#49a078"
              strokeWidth="0.2"
              fill="none"
              className="animate-fade-in"
              style={{ animationDelay: '2s' }}
            />
          </g>
        )}
        
        {sparkCount >= 250 && (
          <g className="constellation-lines" opacity="0.3">
            {/* Orion's belt */}
            <path
              d="M45,40 L50,42 L55,44"
              stroke="#9cc5a1"
              strokeWidth="0.3"
              fill="none"
              className="animate-fade-in"
              style={{ animationDelay: '3s' }}
            />
            {/* Orion outline */}
            <path
              d="M35,25 L45,40 M55,44 L65,28 M45,40 L40,60 M55,44 L60,58"
              stroke="#9cc5a1"
              strokeWidth="0.2"
              fill="none"
              className="animate-fade-in"
              style={{ animationDelay: '3.5s' }}
            />
          </g>
        )}
        
        {/* Render stars */}
        {stars.map((star, index) => (
          <circle
            key={star.id}
            cx={star.x}
            cy={star.y}
            r={star.size}
            fill={getStarColor(star, index)}
            opacity={getStarOpacity(star, index)}
            filter={star.isHighlight ? "url(#glow)" : undefined}
            className={`transition-all duration-300 ${
              index < sparkCount 
                ? 'animate-fade-in' 
                : 'opacity-20'
            }`}
            style={{
              animationDelay: `${Math.min(index * 100, 3000)}ms`,
            }}
          >
            {/* Add subtle pulsing for highlight stars */}
            {star.isHighlight && index < sparkCount && (
              <animate
                attributeName="opacity"
                values="0.8;1;0.8"
                dur="3s"
                repeatCount="indefinite"
              />
            )}
          </circle>
        ))}
      </svg>
      
      {/* Progress counter overlay */}
      <div className="absolute top-4 right-4 text-right">
        <div className="text-4xl font-bold text-wcn-text">
          {sparkCount}
        </div>
        <div className="text-lg text-wcn-text/60">
          / 1000
        </div>
      </div>
      
      {/* Milestone celebrations */}
      {sparkCount === 50 && (
        <div className="absolute bottom-4 left-4 text-wcn-accent2 animate-fade-in">
          <div className="text-sm font-medium">🌟 Little Dipper Complete!</div>
        </div>
      )}
      
      {sparkCount === 100 && (
        <div className="absolute bottom-4 left-4 text-wcn-accent2 animate-fade-in">
          <div className="text-sm font-medium">✨ Big Dipper Unlocked!</div>
        </div>
      )}
      
      {sparkCount === 250 && (
        <div className="absolute bottom-4 left-4 text-wcn-accent2 animate-fade-in">
          <div className="text-sm font-medium">🌌 Orion Rises!</div>
        </div>
      )}
      
      {sparkCount === 500 && (
        <div className="absolute bottom-4 left-4 text-wcn-accent2 animate-fade-in">
          <div className="text-sm font-medium">🌠 Winter Sky Complete!</div>
        </div>
      )}
      
      {sparkCount === 1000 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-wcn-accent2 animate-fade-in">
            <div className="text-2xl font-bold mb-2">🌌 GALAXY MASTER! 🌌</div>
            <div className="text-lg">1000 Sparks Complete!</div>
          </div>
        </div>
      )}
    </div>
  );
}