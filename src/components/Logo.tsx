
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple opacity-30 animate-pulse-neon"></div>
      
      {/* Main logo container */}
      <div className="relative w-full h-full rounded-full bg-gradient-to-br from-neon-blue via-neon-purple to-neon-pink p-0.5 animate-glow">
        <div className="w-full h-full rounded-full bg-cyber-dark flex items-center justify-center">
          {/* Hexagon pattern */}
          <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 text-neon-blue">
            {/* Central hexagon */}
            <polygon
              points="50,10 85,30 85,70 50,90 15,70 15,30"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="animate-pulse-neon"
            />
            
            {/* Inner neural network pattern */}
            <g className="text-neon-purple opacity-80">
              <circle cx="30" cy="35" r="2" fill="currentColor" className="animate-pulse" style={{animationDelay: '0.2s'}} />
              <circle cx="70" cy="35" r="2" fill="currentColor" className="animate-pulse" style={{animationDelay: '0.4s'}} />
              <circle cx="50" cy="50" r="3" fill="currentColor" className="animate-pulse" style={{animationDelay: '0.6s'}} />
              <circle cx="30" cy="65" r="2" fill="currentColor" className="animate-pulse" style={{animationDelay: '0.8s'}} />
              <circle cx="70" cy="65" r="2" fill="currentColor" className="animate-pulse" style={{animationDelay: '1s'}} />
              
              {/* Connecting lines */}
              <line x1="30" y1="35" x2="50" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.6" />
              <line x1="70" y1="35" x2="50" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.6" />
              <line x1="50" y1="50" x2="30" y2="65" stroke="currentColor" strokeWidth="1" opacity="0.6" />
              <line x1="50" y1="50" x2="70" y2="65" stroke="currentColor" strokeWidth="1" opacity="0.6" />
            </g>
            
            {/* Central "Q" for QueryHive */}
            <text x="50" y="58" textAnchor="middle" className="text-lg font-bold fill-neon-blue" fontSize="20">Q</text>
          </svg>
        </div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-neon-pink rounded-full animate-float opacity-60" style={{animationDelay: '0.5s'}}></div>
      <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-neon-blue rounded-full animate-float opacity-60" style={{animationDelay: '1.5s'}}></div>
    </div>
  );
};

export default Logo;
