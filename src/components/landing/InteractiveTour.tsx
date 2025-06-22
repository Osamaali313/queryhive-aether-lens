import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, ArrowRight, ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  animation?: string;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to QueryHive AI! 🚀',
    description: 'Let\'s take a quick tour to show you how our AI-powered analytics platform can transform your data into actionable insights.',
    target: 'body',
    position: 'center'
  },
  {
    id: 'upload',
    title: 'Upload Your Data 📊',
    description: 'Start by uploading CSV files. Our AI automatically detects data types, cleans the data, and prepares it for analysis.',
    target: '[data-tour="upload"]',
    position: 'bottom',
    animation: 'bounce'
  },
  {
    id: 'ai-chat',
    title: 'AI Assistant 🤖',
    description: 'Ask questions in natural language! Our AI understands your data and provides intelligent insights, visualizations, and recommendations.',
    target: '[data-tour="ai-chat"]',
    position: 'left',
    animation: 'pulse'
  },
  {
    id: 'ml-models',
    title: 'Machine Learning Models 🧠',
    description: 'Run advanced ML analysis including regression, clustering, anomaly detection, and time series forecasting with just one click.',
    target: '[data-tour="ml-models"]',
    position: 'top',
    animation: 'glow'
  },
  {
    id: 'dashboard',
    title: 'Interactive Dashboard 📈',
    description: 'View real-time analytics, AI insights, and performance metrics. Everything updates automatically as you work with your data.',
    target: '[data-tour="dashboard"]',
    position: 'right',
    animation: 'float'
  },
  {
    id: 'knowledge',
    title: 'Knowledge Base 📚',
    description: 'Our AI learns from your interactions and builds a personalized knowledge base, making future analysis even smarter.',
    target: '[data-tour="knowledge"]',
    position: 'bottom',
    animation: 'shimmer'
  }
];

interface InteractiveTourProps {
  isOpen: boolean;
  onClose: () => void;
}

const InteractiveTour: React.FC<InteractiveTourProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const step = tourSteps[currentStep];
    let element: HTMLElement | null = null;

    // Find the target element
    if (step.target === 'body') {
      element = document.body;
    } else {
      element = document.querySelector(step.target) as HTMLElement;
    }
    
    if (element) {
      setHighlightedElement(element);
      
      // Scroll element into view
      if (element !== document.body) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'center'
        });
      }
      
      // Add highlight and animation classes
      element.classList.add('tour-highlight');
      if (step.animation) {
        element.classList.add(`tour-${step.animation}`);
      }

      // Calculate tooltip position
      setTimeout(() => {
        calculateTooltipPosition(element!, step.position);
      }, 100);
    }

    return () => {
      if (element) {
        element.classList.remove(
          'tour-highlight', 
          'tour-bounce', 
          'tour-pulse', 
          'tour-glow', 
          'tour-float', 
          'tour-shimmer'
        );
      }
    };
  }, [currentStep, isOpen]);

  const calculateTooltipPosition = (element: HTMLElement, position: string) => {
    if (!tooltipRef.current) return;

    const elementRect = element.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = elementRect.top - tooltipRect.height - 20;
        left = elementRect.left + (elementRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = elementRect.bottom + 20;
        left = elementRect.left + (elementRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = elementRect.top + (elementRect.height - tooltipRect.height) / 2;
        left = elementRect.left - tooltipRect.width - 20;
        break;
      case 'right':
        top = elementRect.top + (elementRect.height - tooltipRect.height) / 2;
        left = elementRect.right + 20;
        break;
      case 'center':
      default:
        top = (viewportHeight - tooltipRect.height) / 2;
        left = (viewportWidth - tooltipRect.width) / 2;
        break;
    }

    // Ensure tooltip stays within viewport
    if (left < 20) left = 20;
    if (left + tooltipRect.width > viewportWidth - 20) {
      left = viewportWidth - tooltipRect.width - 20;
    }
    if (top < 20) top = 20;
    if (top + tooltipRect.height > viewportHeight - 20) {
      top = viewportHeight - tooltipRect.height - 20;
    }

    setTooltipPosition({ top, left });
  };

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentStep < tourSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [currentStep, isPlaying]);

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleClose = () => {
    // Clean up any remaining highlights
    document.querySelectorAll('.tour-highlight').forEach(el => {
      el.classList.remove(
        'tour-highlight', 
        'tour-bounce', 
        'tour-pulse', 
        'tour-glow', 
        'tour-float', 
        'tour-shimmer'
      );
    });
    onClose();
  };

  if (!isOpen) return null;

  const currentTourStep = tourSteps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 z-50 pointer-events-auto" 
        onClick={handleClose}
      />
      
      {/* Tour Card */}
      <Card 
        ref={tooltipRef}
        className="fixed z-[60] glass-effect border-neon-blue/50 shadow-2xl shadow-neon-blue/20 max-w-sm animate-in fade-in-0 zoom-in-95 pointer-events-auto"
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
        }}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue/30">
              Step {currentStep + 1} of {tourSteps.length}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <h3 className="text-lg font-semibold text-white mb-2">
            {currentTourStep.title}
          </h3>
          
          <p className="text-gray-300 text-sm mb-6">
            {currentTourStep.description}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-neon-blue to-neon-purple h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="border-white/20"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="border-white/20"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={restart}
                className="border-white/20"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            <Button
              onClick={currentStep === tourSteps.length - 1 ? handleClose : nextStep}
              className="cyber-button"
              size="sm"
            >
              {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Spotlight Effect for highlighted element */}
      {highlightedElement && highlightedElement !== document.body && (
        <div 
          className="fixed pointer-events-none z-[55] border-4 border-neon-blue rounded-lg shadow-2xl shadow-neon-blue/50 animate-pulse"
          style={{
            top: highlightedElement.getBoundingClientRect().top - 8,
            left: highlightedElement.getBoundingClientRect().left - 8,
            width: highlightedElement.getBoundingClientRect().width + 16,
            height: highlightedElement.getBoundingClientRect().height + 16,
          }}
        />
      )}
    </>
  );
};

export default InteractiveTour;