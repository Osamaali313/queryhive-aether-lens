import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, ArrowRight, BarChart2, Network, AlertTriangle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { MLModelType } from '@/types';

interface MLModelsStepProps {
  onNext: () => void;
  onSkip: () => void;
}

const MLModelsStep: React.FC<MLModelsStepProps> = ({ onNext, onSkip }) => {
  const [selectedModel, setSelectedModel] = useState<MLModelType | null>(null);

  const mlModels = [
    {
      type: 'linear_regression' as MLModelType,
      icon: TrendingUp,
      title: 'Linear Regression',
      description: 'Find relationships between variables and predict outcomes',
      details: [
        'Identify correlations between variables',
        'Predict continuous values',
        'Understand key drivers of outcomes',
        'Quantify relationship strength'
      ],
      color: 'neon-blue',
      complexity: 'Beginner'
    },
    {
      type: 'clustering' as MLModelType,
      icon: Network,
      title: 'K-Means Clustering',
      description: 'Discover natural groupings and segments in your data',
      details: [
        'Customer segmentation',
        'Behavioral analysis',
        'Pattern discovery',
        'Group similar data points'
      ],
      color: 'neon-purple',
      complexity: 'Intermediate'
    },
    {
      type: 'anomaly_detection' as MLModelType,
      icon: AlertTriangle,
      title: 'Anomaly Detection',
      description: 'Identify outliers and unusual patterns automatically',
      details: [
        'Fraud detection',
        'Quality control',
        'System monitoring',
        'Unusual behavior identification'
      ],
      color: 'neon-green',
      complexity: 'Intermediate'
    },
    {
      type: 'time_series' as MLModelType,
      icon: Clock,
      title: 'Time Series Analysis',
      description: 'Analyze trends over time and forecast future values',
      details: [
        'Sales forecasting',
        'Trend analysis',
        'Seasonal pattern detection',
        'Future value prediction'
      ],
      color: 'neon-pink',
      complexity: 'Advanced'
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
        <Badge className="bg-gradient-to-r from-neon-blue/20 to-neon-green/20 border-neon-blue/30 text-neon-blue mb-4">
          Step 4 of 5
        </Badge>
        <h1 className="text-3xl font-bold mb-4">
          <span className="bg-gradient-to-r from-neon-blue to-neon-green bg-clip-text text-transparent">
            Machine Learning Models
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore the powerful ML models available at your fingertips
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
      >
        {mlModels.map((model, index) => {
          const Icon = model.icon;
          const isSelected = selectedModel === model.type;
          
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              className="cursor-pointer"
              onClick={() => setSelectedModel(model.type)}
            >
              <Card className={`glass-effect transition-all duration-300 ${
                isSelected 
                  ? `border-${model.color}/50 bg-${model.color}/5 scale-105` 
                  : `border-${model.color}/20 hover:border-${model.color}/30`
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg bg-${model.color}/10 flex-shrink-0`}>
                      <Icon className={`w-6 h-6 text-${model.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className={`font-semibold ${isSelected ? `text-${model.color}` : 'text-white'} mb-1`}>
                          {model.title}
                        </h3>
                        <Badge className={`bg-${model.color}/20 text-${model.color} border-${model.color}/30 text-xs`}>
                          {model.complexity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {model.description}
                      </p>
                      
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                          className="space-y-2 mt-4"
                        >
                          {model.details.map((detail, i) => (
                            <div key={i} className="flex items-center text-xs text-gray-400">
                              <div className={`w-1.5 h-1.5 rounded-full bg-${model.color} mr-2`} />
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
                <BarChart2 className="w-6 h-6 text-neon-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">One-Click Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  QueryHive AI makes machine learning accessible to everyone. Simply select a model, and our AI will automatically configure parameters, run the analysis, and explain the results in plain language.
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
        className="flex justify-between"
      >
        <Button 
          variant="outline" 
          onClick={onSkip}
          className="border-white/20"
        >
          Skip for now
        </Button>
        
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

export default MLModelsStep;