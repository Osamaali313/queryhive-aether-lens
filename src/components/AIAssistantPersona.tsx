import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Lightbulb, X, MessageSquare, Sparkles } from 'lucide-react';
import { useLearningSystem } from '@/hooks/useLearningSystem';
import { useDatasets } from '@/hooks/useDatasets';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface AIAssistantPersonaProps {
  onSuggestionClick?: (suggestion: string) => void;
  className?: string;
}

const AIAssistantPersona: React.FC<AIAssistantPersonaProps> = ({
  onSuggestionClick,
  className
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [personalizedTip, setPersonalizedTip] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const { getPersonalizedRecommendations, patterns } = useLearningSystem();
  const { datasets } = useDatasets();
  const { profile } = useAuth();
  
  // Generate personalized suggestions based on user data and patterns
  useEffect(() => {
    const generateSuggestions = async () => {
      try {
        // Only generate suggestions if we have datasets
        if (datasets.length === 0) {
          setSuggestions([
            "Upload your first dataset to get started",
            "Try our sample dataset to explore features",
            "Learn about our AI capabilities"
          ]);
          return;
        }
        
        // Get personalized recommendations if we have learning patterns
        if (patterns.length > 0) {
          const result = await getPersonalizedRecommendations.mutateAsync({
            context: {
              datasets: datasets.map(d => d.name),
              recentActivity: 'viewing_dashboard',
              userPreferences: patterns
            }
          });
          
          if (result.recommendations.length > 0) {
            // Convert recommendations to suggestions
            const newSuggestions = result.recommendations
              .slice(0, 3)
              .map(rec => rec.title);
            
            setSuggestions(newSuggestions);
            
            // Set a personalized tip from one of the recommendations
            if (result.recommendations[0].description) {
              setPersonalizedTip(result.recommendations[0].description);
            }
            
            return;
          }
        }
        
        // Fallback suggestions based on dataset
        const datasetName = datasets[0]?.name || 'your data';
        setSuggestions([
          `Analyze trends in ${datasetName}`,
          `Find anomalies in ${datasetName}`,
          `Run clustering analysis on ${datasetName}`
        ]);
        
      } catch (error) {
        console.error('Error generating suggestions:', error);
        // Fallback suggestions
        setSuggestions([
          "Ask me about your data",
          "Try running a machine learning model",
          "Explore data visualization options"
        ]);
      }
    };
    
    generateSuggestions();
  }, [datasets, patterns, getPersonalizedRecommendations]);
  
  // Generate greeting based on time of day and user profile
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = profile?.first_name || 'there';
    
    let greeting = '';
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 18) greeting = 'Good afternoon';
    else greeting = 'Good evening';
    
    return `${greeting}, ${name}!`;
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    }
    setHasInteracted(true);
  };
  
  const handleClose = () => {
    setIsVisible(false);
  };
  
  if (!isVisible) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={cn("w-full", className)}
      >
        <Card className="glass-effect border-neon-purple/30 overflow-hidden">
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-neon-purple/20 flex items-center justify-center mr-3">
                <Brain className="w-4 h-4 text-neon-purple" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">{getGreeting()}</h3>
                <p className="text-xs text-muted-foreground">How can I assist you today?</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
              aria-label="Close assistant"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-4">
            {/* Personalized tip */}
            {personalizedTip && !hasInteracted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="mb-4 p-3 bg-neon-purple/10 rounded-lg border border-neon-purple/20"
              >
                <div className="flex items-start">
                  <Lightbulb className="w-4 h-4 text-neon-purple mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-xs text-gray-300">{personalizedTip}</p>
                </div>
              </motion.div>
            )}
            
            {/* Suggestions */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground mb-2 flex items-center">
                <Sparkles className="w-3 h-3 mr-1 text-neon-yellow" />
                Suggested queries:
              </p>
              
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left mb-2 glass-effect border-white/20 hover:border-neon-purple/50 hover:bg-neon-purple/10"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <MessageSquare className="w-3 h-3 mr-2 text-neon-purple" />
                    <span className="text-xs truncate">{suggestion}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIAssistantPersona;