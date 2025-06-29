import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'neon' | 'pulse';
  className?: string;
  messages?: string[];
  messageChangeInterval?: number;
  showProgress?: boolean;
  progress?: number;
}

const EnhancedLoadingSpinner: React.FC<EnhancedLoadingSpinnerProps> = ({ 
  size = 'md', 
  variant = 'default',
  className,
  messages = ['Loading...'],
  messageChangeInterval = 3000,
  showProgress = false,
  progress = 0
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedMessage, setDisplayedMessage] = useState(messages[0]);
  const [isChanging, setIsChanging] = useState(false);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const variantClasses = {
    default: 'text-neon-blue',
    neon: 'text-neon-purple animate-pulse',
    pulse: 'text-neon-green'
  };

  // Cycle through messages if more than one is provided
  useEffect(() => {
    if (messages.length <= 1) return;
    
    const intervalId = setInterval(() => {
      setIsChanging(true);
      
      // Wait for exit animation to complete
      setTimeout(() => {
        setCurrentMessageIndex(prev => (prev + 1) % messages.length);
        setDisplayedMessage(messages[(currentMessageIndex + 1) % messages.length]);
        setIsChanging(false);
      }, 300);
    }, messageChangeInterval);
    
    return () => clearInterval(intervalId);
  }, [messages, messageChangeInterval, currentMessageIndex]);

  return (
    <div 
      className={cn("flex flex-col items-center justify-center", className)}
      role="status"
      aria-live="polite"
    >
      <div className="relative">
        <Loader2 
          className={cn(
            "animate-spin",
            sizeClasses[size],
            variantClasses[variant]
          )} 
          aria-hidden="true"
        />
        
        {/* Animated glow effect */}
        <div className={cn(
          "absolute inset-0 rounded-full animate-pulse",
          variant === 'default' ? 'bg-neon-blue/10' : 
          variant === 'neon' ? 'bg-neon-purple/10' : 
          'bg-neon-green/10'
        )} style={{ filter: 'blur(8px)' }}></div>
      </div>
      
      {messages.length > 0 && (
        <div className="mt-3 min-h-6 text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={displayedMessage}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-muted-foreground"
            >
              {displayedMessage}
            </motion.p>
          </AnimatePresence>
        </div>
      )}
      
      {showProgress && (
        <div className="w-full max-w-xs mt-3">
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-neon-blue to-neon-purple"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-right mt-1">
            {Math.round(progress)}%
          </p>
        </div>
      )}
      
      <span className="sr-only">{displayedMessage}</span>
    </div>
  );
};

export default EnhancedLoadingSpinner;