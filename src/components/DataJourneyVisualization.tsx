import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Database, Brain, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import lottie from 'lottie-web';
import { useReducedMotion } from '@/hooks/use-mobile';

export type DataJourneyStage = 'upload' | 'process' | 'analyze' | 'insights' | 'complete' | null;

interface DataJourneyVisualizationProps {
  activeStage: DataJourneyStage;
  progress?: number;
  isVisible?: boolean;
  onComplete?: () => void;
  className?: string;
}

const stages = [
  { 
    id: 'upload', 
    title: 'Data Upload', 
    description: 'Uploading and validating your data',
    icon: Upload,
    color: 'neon-blue'
  },
  { 
    id: 'process', 
    title: 'Data Processing', 
    description: 'Cleaning and preparing your data',
    icon: Database,
    color: 'neon-purple'
  },
  { 
    id: 'analyze', 
    title: 'AI Analysis', 
    description: 'Running machine learning models',
    icon: Brain,
    color: 'neon-green'
  },
  { 
    id: 'insights', 
    title: 'Generating Insights', 
    description: 'Discovering patterns and insights',
    icon: Zap,
    color: 'neon-pink'
  },
  { 
    id: 'complete', 
    title: 'Complete', 
    description: 'Your data is ready for exploration',
    icon: CheckCircle,
    color: 'neon-green'
  }
];

const DataJourneyVisualization: React.FC<DataJourneyVisualizationProps> = ({
  activeStage,
  progress = 0,
  isVisible = true,
  onComplete,
  className
}) => {
  const [completedStages, setCompletedStages] = useState<string[]>([]);
  const prefersReducedMotion = useReducedMotion();
  const lottieContainerRef = useRef<HTMLDivElement>(null);
  const lottieInstanceRef = useRef<any>(null);

  // Update completed stages when active stage changes
  useEffect(() => {
    if (!activeStage) return;
    
    const currentStageIndex = stages.findIndex(stage => stage.id === activeStage);
    if (currentStageIndex === -1) return;
    
    // Mark all previous stages as completed
    const newCompletedStages = stages
      .slice(0, currentStageIndex)
      .map(stage => stage.id);
    
    setCompletedStages(newCompletedStages);
    
    // If the active stage is 'complete', trigger onComplete callback
    if (activeStage === 'complete' && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [activeStage, onComplete]);

  // Load and play the completion animation when journey is complete
  useEffect(() => {
    if (activeStage === 'complete' && lottieContainerRef.current && !prefersReducedMotion) {
      // Clean up any existing animation
      if (lottieInstanceRef.current) {
        lottieInstanceRef.current.destroy();
      }
      
      // Load the completion animation
      import('../assets/data-complete-animation.json').then((animationData) => {
        lottieInstanceRef.current = lottie.loadAnimation({
          container: lottieContainerRef.current!,
          renderer: 'svg',
          loop: false,
          autoplay: true,
          animationData: animationData.default,
        });
      }).catch(err => {
        console.error('Failed to load animation:', err);
      });
      
      return () => {
        if (lottieInstanceRef.current) {
          lottieInstanceRef.current.destroy();
          lottieInstanceRef.current = null;
        }
      };
    }
  }, [activeStage, prefersReducedMotion]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className={cn("w-full", className)}
        >
          <Card className="glass-effect border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <h3 className="text-lg font-semibold flex items-center">
                <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                  Data Journey
                </span>
                {activeStage && (
                  <Badge className="ml-2 bg-neon-blue/20 text-neon-blue border-neon-blue/30">
                    {stages.find(stage => stage.id === activeStage)?.title || 'Processing'}
                  </Badge>
                )}
              </h3>
              <p className="text-sm text-muted-foreground">
                Watch your data transform into intelligence
              </p>
            </div>
            
            <div className="p-6">
              {/* Journey visualization */}
              <div className="relative">
                {/* Connection lines */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-700 -translate-y-1/2 z-0"></div>
                
                {/* Stages */}
                <div className="relative z-10 flex justify-between">
                  {stages.map((stage, index) => {
                    const StageIcon = stage.icon;
                    const isActive = activeStage === stage.id;
                    const isCompleted = completedStages.includes(stage.id);
                    
                    return (
                      <div key={stage.id} className="flex flex-col items-center">
                        {/* Stage indicator */}
                        <motion.div
                          className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                            isActive ? `bg-${stage.color}/20 border-2 border-${stage.color}` : 
                            isCompleted ? `bg-${stage.color}/10 border border-${stage.color}/50` : 
                            "bg-gray-800/50 border border-white/10"
                          )}
                          animate={{
                            scale: isActive ? [1, 1.1, 1] : 1,
                            boxShadow: isActive ? [
                              `0 0 0 rgba(0, 0, 0, 0)`,
                              `0 0 20px rgba(var(--${stage.color}-rgb), 0.5)`,
                              `0 0 0 rgba(0, 0, 0, 0)`
                            ] : 'none'
                          }}
                          transition={{
                            scale: { repeat: isActive ? Infinity : 0, duration: 2 },
                            boxShadow: { repeat: isActive ? Infinity : 0, duration: 2 }
                          }}
                        >
                          <StageIcon 
                            className={cn(
                              "w-5 h-5",
                              isActive ? `text-${stage.color}` : 
                              isCompleted ? `text-${stage.color}/70` : 
                              "text-gray-400"
                            )} 
                          />
                        </motion.div>
                        
                        {/* Stage label */}
                        <div className="text-center">
                          <p className={cn(
                            "text-xs font-medium",
                            isActive ? `text-${stage.color}` : 
                            isCompleted ? "text-white" : 
                            "text-gray-400"
                          )}>
                            {stage.title}
                          </p>
                          {isActive && (
                            <p className="text-xs text-muted-foreground mt-1 max-w-[100px] text-center">
                              {stage.description}
                            </p>
                          )}
                        </div>
                        
                        {/* Arrow to next stage */}
                        {index < stages.length - 1 && (
                          <div className="absolute top-1/2 -translate-y-1/2" style={{ left: `${(index + 0.5) * 100 / (stages.length - 1)}%` }}>
                            <ArrowRight className={cn(
                              "w-4 h-4",
                              (isActive || isCompleted) ? "text-neon-blue" : "text-gray-700"
                            )} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Progress indicator for current stage */}
              {activeStage && activeStage !== 'complete' && (
                <div className="mt-6">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{stages.find(stage => stage.id === activeStage)?.description}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r from-neon-blue to-neon-purple`}
                      initial={{ width: '0%' }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )}
              
              {/* Completion animation */}
              {activeStage === 'complete' && (
                <div className="mt-4 flex justify-center">
                  <div 
                    ref={lottieContainerRef} 
                    className="w-32 h-32"
                    aria-label="Data processing complete animation"
                  />
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DataJourneyVisualization;