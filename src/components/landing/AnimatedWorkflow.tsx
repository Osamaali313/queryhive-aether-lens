import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Brain, BarChart3, Lightbulb, ArrowRight, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  details: string[];
}

const workflowSteps: WorkflowStep[] = [
  {
    id: 'upload',
    title: 'Data Upload',
    description: 'Upload your CSV files with drag-and-drop simplicity',
    icon: Upload,
    color: 'neon-blue',
    details: [
      'Automatic data type detection',
      'Data quality validation',
      'Smart column mapping',
      'Preview and confirmation'
    ]
  },
  {
    id: 'process',
    title: 'AI Processing',
    description: 'Our AI analyzes and prepares your data for insights',
    icon: Brain,
    color: 'neon-purple',
    details: [
      'Data cleaning and normalization',
      'Pattern recognition',
      'Relationship mapping',
      'Context understanding'
    ]
  },
  {
    id: 'analyze',
    title: 'Smart Analysis',
    description: 'Advanced ML models generate deep insights',
    icon: BarChart3,
    color: 'neon-green',
    details: [
      'Regression analysis',
      'Clustering algorithms',
      'Anomaly detection',
      'Time series forecasting'
    ]
  },
  {
    id: 'insights',
    title: 'Actionable Insights',
    description: 'Get clear, actionable recommendations',
    icon: Lightbulb,
    color: 'neon-pink',
    details: [
      'Natural language explanations',
      'Visual dashboards',
      'Predictive recommendations',
      'Automated reports'
    ]
  }
];

const AnimatedWorkflow: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setActiveStep(prev => (prev + 1) % workflowSteps.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="relative">
      {/* Workflow Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {workflowSteps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === activeStep;
          
          return (
            <Card 
              key={step.id}
              className={cn(
                "relative overflow-hidden transition-all duration-500 cursor-pointer group",
                isActive 
                  ? `border-${step.color}/50 bg-${step.color}/5 scale-105 shadow-2xl shadow-${step.color}/20` 
                  : "border-white/10 hover:border-white/20"
              )}
              onClick={() => setActiveStep(index)}
            >
              <div className="p-6">
                {/* Step Number */}
                <div className={cn(
                  "absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                  isActive 
                    ? `bg-${step.color}/20 text-${step.color} border border-${step.color}/30` 
                    : "bg-gray-700 text-gray-400"
                )}>
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-300",
                  isActive 
                    ? `bg-${step.color}/20 text-${step.color}` 
                    : "bg-gray-800 text-gray-400 group-hover:bg-gray-700"
                )}>
                  <Icon className={cn(
                    "w-6 h-6 transition-all duration-300",
                    isActive && "animate-pulse"
                  )} />
                </div>

                {/* Content */}
                <h3 className={cn(
                  "text-lg font-semibold mb-2 transition-colors duration-300",
                  isActive ? `text-${step.color}` : "text-white"
                )}>
                  {step.title}
                </h3>
                
                <p className="text-gray-400 text-sm mb-4">
                  {step.description}
                </p>

                {/* Details */}
                <div className={cn(
                  "space-y-1 transition-all duration-300",
                  isActive ? "opacity-100 max-h-32" : "opacity-60 max-h-0 overflow-hidden"
                )}>
                  {step.details.map((detail, i) => (
                    <div key={i} className="flex items-center text-xs text-gray-500">
                      <div className={cn(
                        "w-1 h-1 rounded-full mr-2",
                        isActive ? `bg-${step.color}` : "bg-gray-600"
                      )} />
                      {detail}
                    </div>
                  ))}
                </div>

                {/* Active Indicator */}
                {isActive && (
                  <div className={cn(
                    "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r",
                    `from-${step.color} to-${step.color}/50`
                  )} />
                )}
              </div>

              {/* Animated Background */}
              {isActive && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className={cn(
                    "absolute inset-0 opacity-10 animate-pulse",
                    `bg-gradient-to-br from-${step.color}/20 to-transparent`
                  )} />
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Connection Lines */}
      <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-blue via-neon-purple via-neon-green to-neon-pink opacity-30 -translate-y-1/2 pointer-events-none" />
      
      {/* Animated Dots */}
      <div className="hidden lg:block absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-neon-blue rounded-full animate-pulse"
            style={{
              left: `${25 + (i * 25)}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center mt-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="border-white/20"
          >
            {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isPlaying ? 'Pause' : 'Play'} Animation
          </Button>
          
          <div className="flex space-x-2">
            {workflowSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === activeStep 
                    ? "bg-neon-blue scale-125" 
                    : "bg-gray-600 hover:bg-gray-500"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedWorkflow;