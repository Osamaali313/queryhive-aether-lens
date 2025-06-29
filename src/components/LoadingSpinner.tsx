import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  className?: string;
  variant?: 'default' | 'neon' | 'pulse';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  message, 
  className,
  variant = 'default'
}) => {
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

  return (
    <div 
      className={cn("flex flex-col items-center justify-center", className)}
      role="status"
      aria-live="polite"
    >
      <Loader2 
        className={cn(
          "animate-spin",
          sizeClasses[size],
          variantClasses[variant]
        )} 
        aria-hidden="true"
      />
      {message && (
        <p className="mt-2 text-sm text-muted-foreground text-center">
          {message}
        </p>
      )}
      <span className="sr-only">{message || 'Loading...'}</span>
    </div>
  );
};

export default LoadingSpinner;