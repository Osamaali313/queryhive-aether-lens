import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
  iconClassName?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
  iconClassName,
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center py-12 px-4",
      className
    )}>
      <div className={cn(
        "w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mb-6",
        iconClassName
      )}>
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      
      <p className="text-muted-foreground max-w-md mb-6">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button 
          onClick={onAction}
          className="cyber-button mb-2"
        >
          {actionLabel}
        </Button>
      )}
      
      {secondaryActionLabel && onSecondaryAction && (
        <Button 
          variant="outline" 
          onClick={onSecondaryAction}
          className="border-white/20 mt-2"
        >
          {secondaryActionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;