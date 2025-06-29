import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import LoadingSpinner from '@/components/LoadingSpinner';
import InteractiveTour from '@/components/landing/InteractiveTour';
import WelcomeStep from '@/components/onboarding/WelcomeStep';
import DataUploadStep from '@/components/onboarding/DataUploadStep';
import AIQueryStep from '@/components/onboarding/AIQueryStep';
import MLModelsStep from '@/components/onboarding/MLModelsStep';
import AIFeaturesStep from '@/components/onboarding/AIFeaturesStep';
import CompletionStep from '@/components/onboarding/CompletionStep';
import { OnboardingStep } from '@/types';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTour, setShowTour] = useState(false);
  const { user, profile, loading, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Define onboarding steps
  const steps: OnboardingStep[] = [
    {
      id: 0,
      title: 'Welcome',
      description: 'Welcome to QueryHive AI',
      component: WelcomeStep,
      nextButtonText: 'Let\'s Get Started',
    },
    {
      id: 1,
      title: 'Data Upload',
      description: 'Upload your first dataset',
      component: DataUploadStep,
      nextButtonText: 'Continue',
      skipButtonText: 'Skip for now',
      isOptional: true,
    },
    {
      id: 2,
      title: 'AI Query',
      description: 'Ask your first question',
      component: AIQueryStep,
      nextButtonText: 'Continue',
      skipButtonText: 'Skip for now',
      isOptional: true,
    },
    {
      id: 3,
      title: 'ML Models',
      description: 'Explore ML models',
      component: MLModelsStep,
      nextButtonText: 'Continue',
      skipButtonText: 'Skip for now',
      isOptional: true,
    },
    {
      id: 4,
      title: 'AI Features',
      description: 'Discover AI capabilities',
      component: AIFeaturesStep,
      nextButtonText: 'Continue to Final Step',
    },
    {
      id: 5,
      title: 'Completion',
      description: 'Setup complete',
      component: CompletionStep,
      nextButtonText: 'Finish',
    },
  ];

  // Check if user is authenticated and redirect if needed
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (profile?.onboarding_complete) {
        navigate('/app');
      } else if (profile?.onboarding_step > 0) {
        // Resume from last step
        setCurrentStep(profile.onboarding_step);
      }
    }
  }, [user, profile, loading, navigate]);

  // Update onboarding step in database
  const updateOnboardingStep = async (step: number) => {
    if (user) {
      await updateProfile({
        onboarding_step: step
      });
    }
  };

  const handleNext = async () => {
    const nextStep = currentStep + 1;
    
    if (nextStep < steps.length) {
      setCurrentStep(nextStep);
      await updateOnboardingStep(nextStep);
    } else {
      // Onboarding complete
      await updateProfile({
        onboarding_complete: true,
        onboarding_step: steps.length - 1
      });
      navigate('/app');
    }
  };

  const handleSkip = async () => {
    const nextStep = currentStep + 1;
    
    if (nextStep < steps.length) {
      setCurrentStep(nextStep);
      await updateOnboardingStep(nextStep);
    }
  };

  const handleStartTour = () => {
    setShowTour(true);
  };

  // Calculate progress percentage
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading your workspace..." />
      </div>
    );
  }

  // Get current step component
  const CurrentStepComponent = steps[currentStep]?.component;

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Animated background grid */}
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none"></div>
      
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Progress value={progressPercentage} className="h-1 bg-gray-800" />
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {CurrentStepComponent && (
              <CurrentStepComponent 
                onNext={handleNext} 
                onSkip={handleSkip}
                onStartTour={handleStartTour}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Step indicators */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center">
        <div className="flex space-x-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentStep 
                  ? 'bg-neon-blue w-4' 
                  : index < currentStep 
                    ? 'bg-neon-green' 
                    : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Interactive Tour */}
      <InteractiveTour isOpen={showTour} onClose={() => {
        setShowTour(false);
        navigate('/app');
      }} />
    </div>
  );
};

export default Onboarding;