
import React, { useEffect, useState } from 'react';
import Logo from '@/components/Logo';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-cyber-darker via-cyber-dark to-cyber-darker flex items-center justify-center z-50">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <div className="w-1 h-1 bg-neon-blue rounded-full opacity-60"></div>
          </div>
        ))}
      </div>

      <div className="text-center space-y-8 relative z-10">
        {/* Logo with enhanced animation */}
        <div className="flex justify-center">
          <div className="relative">
            <Logo size="xl" className="animate-glow" />
            <div className="absolute inset-0 animate-pulse">
              <div className="w-full h-full rounded-full bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 blur-xl"></div>
            </div>
          </div>
        </div>

        {/* Company name with typewriter effect */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent animate-slide-up">
            QueryHive AI
          </h1>
          <p className="text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: '0.5s' }}>
            Intelligent Data Analytics Platform
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-80 mx-auto space-y-4">
          <div className="w-full bg-cyber-light/20 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-neon-blue to-neon-purple rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Initializing AI Models...</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Loading text with dots animation */}
        <div className="text-neon-blue animate-pulse">
          <span className="text-lg">Loading</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.1s' }}>.</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.3s' }}>.</span>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
