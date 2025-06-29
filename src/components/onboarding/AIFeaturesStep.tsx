import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, ArrowRight, MessageSquare, Network, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface AIFeaturesStepProps {
  onNext: () => void;
}

const AIFeaturesStep: React.FC<AIFeaturesStepProps> = ({ onNext }) => {
  const [activeFeature, setActiveFeature] = useState(0);

  const aiFeatures = [
    {
      icon: MessageSquare,
      title: 'Natural Language Queries',
      description: 'Ask questions about your data in plain English',
      details: [
        'No SQL knowledge required',
        'Context-aware conversations',
        'Follow-up questions supported',
        'Automatic visualization generation'
      ],
      color: 'neon-blue'
    },
    {
      icon: TrendingUp,
      title: 'Machine Learning Models',
      description: 'One-click access to powerful ML algorithms',
      details: [
        'Linear regression analysis',
        'K-means clustering',
        'Anomaly detection',
        'Time series forecasting'
      ],
      color: 'neon-purple'
    },
    {
      icon: Network,
      title: 'Knowledge Graph',
      description: 'Discover hidden relationships in your data',
      details: [
        'Automatic entity extraction',
        'Relationship mapping',
        'Visual graph exploration',
        'Pattern discovery'
      ],
      color: 'neon-green'
    },
    {
      icon: Zap,
      title: 'Self-Learning System',
      description: 'AI that improves with your feedback',
      details: [
        'Personalized recommendations',
        'Adaptive query responses',
        'Learning from user interactions',
        'Continuous improvement'
      ],
      color: 'neon-pink'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
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
        <Badge className="bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 border-neon-purple/30 text-neon-purple mb-4">
          Step 4 of 5
        </Badge>
        <h1 className="text-3xl font-bold mb-4">
          <span className="bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">
            AI-Powered Features
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover the intelligent capabilities that make QueryHive AI unique
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-6 mb-8"
      >
        {aiFeatures.map((feature, index) => {
          const Icon = feature.icon;
          const isActive = activeFeature === index;
          
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`cursor-pointer transition-all duration-300 ${
                isActive ? 'order-first md:col-span-2' : ''
              }`}
              onClick={() => setActiveFeature(index)}
            >
              <Card className={`glass-effect border-${feature.color}/20 hover:border-${feature.color}/40 ${
                isActive ? `bg-${feature.color}/5 border-${feature.color}/30` : ''
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg bg-${feature.color}/10 flex-shrink-0`}>
                      <Icon className={`w-6 h-6 text-${feature.color}`} />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isActive ? `text-${feature.color}` : 'text-white'} mb-2`}>
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {feature.description}
                      </p>
                      
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                          className="space-y-2 mt-4"
                        >
                          {feature.details.map((detail, i) => (
                            <div key={i} className="flex items-center text-xs text-gray-400">
                              <div className={`w-1.5 h-1.5 rounded-full bg-${feature.color} mr-2`} />
                              {detail}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mb-8"
      >
        <Card className="glass-effect border-white/10">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-neon-blue/10 flex-shrink-0">
                <Brain className="w-6 h-6 text-neon-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Continuous Learning</h3>
                <p className="text-sm text-muted-foreground">
                  QueryHive AI gets smarter with every interaction. Your feedback helps improve the system for your specific needs, making insights more relevant and accurate over time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="flex justify-end"
      >
        <Button 
          onClick={onNext} 
          className="cyber-button"
        >
          Continue to Final Step
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  );
};

export default AIFeaturesStep;