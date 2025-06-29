import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowRight, Play, Rocket, Star, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import confetti from '@/lib/confetti';

interface CompletionStepProps {
  onStartTour: () => void;
}

const CompletionStep: React.FC<CompletionStepProps> = ({ onStartTour }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateProfile, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleComplete = async (startTour: boolean) => {
    setIsUpdating(true);
    
    try {
      // Trigger confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Update user profile to mark onboarding as complete
      const { error } = await updateProfile({
        onboarding_complete: true,
        onboarding_step: 5
      });
      
      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Failed to update your profile. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Onboarding Complete!",
          description: "Welcome to QueryHive AI. Your workspace is ready.",
        });
        
        // Navigate to app or start tour
        if (startTour) {
          onStartTour();
        } else {
          navigate('/app');
        }
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <Badge className="bg-gradient-to-r from-neon-green/20 to-neon-blue/20 border-neon-green/30 text-neon-green mb-4">
          Step 5 of 5
        </Badge>
        <h1 className="text-3xl font-bold mb-4">
          <span className="bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent">
            Setup Complete!
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          You're all set to start exploring the power of QueryHive AI
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-12 text-center"
      >
        <div className="inline-block p-4 rounded-full bg-gradient-to-r from-neon-green/20 to-neon-blue/20 border border-neon-green/30 mb-6">
          <CheckCircle className="w-16 h-16 text-neon-green" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">
          Your AI Analytics Workspace is Ready
        </h2>
        
        <p className="text-muted-foreground max-w-lg mx-auto mb-8">
          You've successfully set up your QueryHive AI workspace. Now you can start analyzing your data, generating insights, and making data-driven decisions.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
      >
        <Card className="glass-effect border-neon-blue/20 hover:border-neon-blue/40 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-neon-blue/10 flex-shrink-0">
                <Play className="w-6 h-6 text-neon-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Take an Interactive Tour</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get a guided walkthrough of all features and capabilities to make the most of QueryHive AI.
                </p>
                <Button 
                  variant="outline" 
                  className="border-neon-blue/30 text-neon-blue"
                  onClick={() => handleComplete(true)}
                  disabled={isUpdating}
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Start Tour
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-neon-green/20 hover:border-neon-green/40 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-neon-green/10 flex-shrink-0">
                <Rocket className="w-6 h-6 text-neon-green" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Jump Right In</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Skip the tour and start exploring the platform on your own. You can always access the tour later.
                </p>
                <Button 
                  variant="outline" 
                  className="border-neon-green/30 text-neon-green"
                  onClick={() => handleComplete(false)}
                  disabled={isUpdating}
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-center"
      >
        <div className="flex items-center justify-center space-x-1 mb-4">
          {[1, 2, 3, 4, 5].map(star => (
            <Star key={star} className="w-6 h-6 text-neon-yellow fill-neon-yellow" />
          ))}
        </div>
        <p className="text-muted-foreground">
          Thank you for choosing QueryHive AI for your data analytics needs!
        </p>
      </motion.div>
    </div>
  );
};

export default CompletionStep;