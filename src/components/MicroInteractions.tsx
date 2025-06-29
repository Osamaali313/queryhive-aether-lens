import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/use-mobile';

interface SuccessAnimationProps {
  show: boolean;
  onComplete?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  duration?: number;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  show,
  onComplete,
  className,
  size = 'md',
  duration = 1500
}) => {
  const prefersReducedMotion = useReducedMotion();
  
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, onComplete, duration]);
  
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };
  
  if (prefersReducedMotion) {
    return show ? (
      <div className={cn("flex items-center justify-center", className)}>
        <CheckCircle className="text-neon-green w-8 h-8" />
      </div>
    ) : null;
  }
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={cn("relative flex items-center justify-center", className)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          {/* Outer ring */}
          <motion.div
            className={cn(
              "absolute rounded-full border-4 border-neon-green",
              sizeClasses[size]
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 0.8, 0], scale: [0.8, 1.2, 1.5] }}
            transition={{ 
              duration: 1.2,
              times: [0, 0.3, 1],
              repeat: Infinity,
              repeatDelay: 0.5
            }}
          />
          
          {/* Middle ring */}
          <motion.div
            className={cn(
              "absolute rounded-full border-2 border-neon-green/70",
              sizeClasses[size]
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 0.6, 0], scale: [0.8, 1.1, 1.3] }}
            transition={{ 
              duration: 1,
              times: [0, 0.3, 1],
              repeat: Infinity,
              repeatDelay: 0.3,
              delay: 0.2
            }}
          />
          
          {/* Center icon */}
          <motion.div
            className={cn(
              "bg-neon-green/20 rounded-full flex items-center justify-center",
              size === 'sm' ? 'w-10 h-10' : size === 'md' ? 'w-16 h-16' : 'w-20 h-20'
            )}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            <CheckCircle className={cn(
              "text-neon-green",
              size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-8 h-8' : 'w-10 h-10'
            )} />
          </motion.div>
          
          {/* Particles */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-neon-green rounded-full"
              initial={{ 
                x: 0, 
                y: 0, 
                opacity: 0 
              }}
              animate={{ 
                x: Math.cos(i * Math.PI / 4) * (size === 'sm' ? 20 : size === 'md' ? 30 : 40), 
                y: Math.sin(i * Math.PI / 4) * (size === 'sm' ? 20 : size === 'md' ? 30 : 40), 
                opacity: [0, 1, 0] 
              }}
              transition={{ 
                duration: 0.8,
                times: [0, 0.2, 1],
                delay: 0.1 + i * 0.05,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface SparkleEffectProps {
  show: boolean;
  color?: 'blue' | 'purple' | 'green' | 'pink' | 'yellow';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  duration?: number;
  onComplete?: () => void;
}

export const SparkleEffect: React.FC<SparkleEffectProps> = ({
  show,
  color = 'blue',
  className,
  size = 'md',
  duration = 1500,
  onComplete
}) => {
  const prefersReducedMotion = useReducedMotion();
  
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, onComplete, duration]);
  
  const colorClasses = {
    blue: 'text-neon-blue',
    purple: 'text-neon-purple',
    green: 'text-neon-green',
    pink: 'text-neon-pink',
    yellow: 'text-neon-yellow'
  };
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };
  
  if (prefersReducedMotion) {
    return show ? (
      <div className={cn("flex items-center justify-center", className)}>
        <Sparkles className={cn(colorClasses[color], sizeClasses[size])} />
      </div>
    ) : null;
  }
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={cn("relative", className)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Center sparkle */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <Sparkles className={cn(colorClasses[color], sizeClasses[size])} />
          </motion.div>
          
          {/* Particles */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                "absolute w-1 h-1 rounded-full",
                color === 'blue' ? 'bg-neon-blue' :
                color === 'purple' ? 'bg-neon-purple' :
                color === 'green' ? 'bg-neon-green' :
                color === 'pink' ? 'bg-neon-pink' :
                'bg-neon-yellow'
              )}
              style={{
                top: '50%',
                left: '50%',
                transformOrigin: 'center'
              }}
              initial={{ 
                x: 0, 
                y: 0, 
                scale: 0,
                opacity: 0 
              }}
              animate={{ 
                x: Math.cos(i * Math.PI / 6) * (size === 'sm' ? 15 : size === 'md' ? 25 : 35), 
                y: Math.sin(i * Math.PI / 6) * (size === 'sm' ? 15 : size === 'md' ? 25 : 35), 
                scale: [0, 1, 0],
                opacity: [0, 1, 0] 
              }}
              transition={{ 
                duration: 0.8,
                times: [0, 0.2, 1],
                delay: i * 0.03,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface EnergyPulseProps {
  show: boolean;
  color?: 'blue' | 'purple' | 'green' | 'pink' | 'yellow';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  duration?: number;
  onComplete?: () => void;
}

export const EnergyPulse: React.FC<EnergyPulseProps> = ({
  show,
  color = 'blue',
  className,
  size = 'md',
  duration = 1500,
  onComplete
}) => {
  const prefersReducedMotion = useReducedMotion();
  
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, onComplete, duration]);
  
  const colorClasses = {
    blue: 'text-neon-blue',
    purple: 'text-neon-purple',
    green: 'text-neon-green',
    pink: 'text-neon-pink',
    yellow: 'text-neon-yellow'
  };
  
  const bgColorClasses = {
    blue: 'bg-neon-blue',
    purple: 'bg-neon-purple',
    green: 'bg-neon-green',
    pink: 'bg-neon-pink',
    yellow: 'bg-neon-yellow'
  };
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };
  
  if (prefersReducedMotion) {
    return show ? (
      <div className={cn("flex items-center justify-center", className)}>
        <Zap className={cn(colorClasses[color], sizeClasses[size])} />
      </div>
    ) : null;
  }
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={cn("relative flex items-center justify-center", className)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Pulse rings */}
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className={cn(
                "absolute rounded-full opacity-30",
                size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-12 h-12' : 'w-16 h-16',
                color === 'blue' ? 'border-neon-blue' :
                color === 'purple' ? 'border-neon-purple' :
                color === 'green' ? 'border-neon-green' :
                color === 'pink' ? 'border-neon-pink' :
                'border-neon-yellow'
              )}
              style={{
                border: `2px solid`,
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: [0.8, 1.5, 2], 
                opacity: [0, 0.5, 0] 
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: ring * 0.3,
                repeatDelay: 0.5
              }}
            />
          ))}
          
          {/* Center icon */}
          <motion.div
            className="relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <Zap className={cn(colorClasses[color], sizeClasses[size])} />
            
            {/* Energy particles */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className={cn(
                  "absolute w-1 h-1 rounded-full",
                  bgColorClasses[color]
                )}
                style={{
                  top: '50%',
                  left: '50%',
                }}
                initial={{ 
                  x: 0, 
                  y: 0,
                  opacity: 0 
                }}
                animate={{ 
                  x: Math.cos(i * Math.PI / 4) * (size === 'sm' ? 10 : size === 'md' ? 15 : 20), 
                  y: Math.sin(i * Math.PI / 4) * (size === 'sm' ? 10 : size === 'md' ? 15 : 20), 
                  opacity: [0, 1, 0] 
                }}
                transition={{ 
                  duration: 0.8,
                  times: [0, 0.2, 1],
                  repeat: Infinity,
                  repeatDelay: 0.5,
                  delay: i * 0.05,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};