import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Database, TrendingUp, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  const { profile } = useAuth();
  const firstName = profile?.first_name || 'there';

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Ask questions in plain English and get intelligent insights',
      color: 'neon-blue'
    },
    {
      icon: Database,
      title: 'Data Management',
      description: 'Upload, clean, and organize your data with ease',
      color: 'neon-green'
    },
    {
      icon: TrendingUp,
      title: 'ML Models',
      description: 'Access powerful machine learning models with one click',
      color: 'neon-purple'
    },
    {
      icon: Zap,
      title: 'Real-time Insights',
      description: 'Get instant analytics and visualizations',
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
        className="text-center mb-12"
      >
        <Badge className="bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border-neon-blue/30 text-neon-blue mb-4">
          Welcome to QueryHive AI
        </Badge>
        <h1 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            Hello, {firstName}!
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Let's set up your intelligent analytics workspace in just a few steps.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
      >
        {features.map((feature, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="glass-effect border-white/10 hover:border-white/20 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg bg-${feature.color}/10 flex-shrink-0`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-center"
      >
        <p className="text-muted-foreground mb-6">
          This quick setup will help you get the most out of QueryHive AI. It only takes about 2 minutes.
        </p>
        <Button onClick={onNext} className="cyber-button" size="lg">
          Let's Get Started
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  );
};

export default WelcomeStep;