import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, ArrowRight, Database, Brain, Activity, TrendingUp, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardStepProps {
  onNext: () => void;
}

const DashboardStep: React.FC<DashboardStepProps> = ({ onNext }) => {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  const dashboardFeatures = [
    {
      icon: Database,
      title: 'Dataset Management',
      description: 'Upload, manage, and explore your datasets',
      color: 'neon-blue'
    },
    {
      icon: Brain,
      title: 'AI Insights',
      description: 'Automatically generated insights from your data',
      color: 'neon-purple'
    },
    {
      icon: Activity,
      title: 'Real-time Analytics',
      description: 'Live metrics and performance indicators',
      color: 'neon-green'
    },
    {
      icon: TrendingUp,
      title: 'ML Models',
      description: 'One-click machine learning analysis',
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
        <Badge className="bg-gradient-to-r from-neon-green/20 to-neon-pink/20 border-neon-green/30 text-neon-green mb-4">
          Step 3 of 5
        </Badge>
        <h1 className="text-3xl font-bold mb-4">
          <span className="bg-gradient-to-r from-neon-green to-neon-pink bg-clip-text text-transparent">
            Your Analytics Dashboard
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore your personalized dashboard with real-time insights
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8 relative"
      >
        <Card className="glass-effect border-white/10 overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              {/* Dashboard Preview Image */}
              <div className="w-full h-[400px] bg-gradient-to-br from-cyber-dark via-cyber-light/10 to-cyber-dark p-6">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {dashboardFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                      className={`glass-effect p-4 border border-${feature.color}/30 rounded-lg cursor-pointer transition-all duration-300 ${
                        activeFeature === index ? `bg-${feature.color}/10 scale-105` : ''
                      }`}
                      onClick={() => setActiveFeature(index)}
                    >
                      <div className="flex items-center space-x-3">
                        <feature.icon className={`w-5 h-5 text-${feature.color}`} />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {feature.title}
                          </p>
                          <p className="text-lg font-bold">
                            {index === 0 ? '3' : index === 1 ? '12' : index === 2 ? '94%' : '4'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Mock Charts */}
                <div className="grid grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="glass-effect rounded-lg p-4 h-48 border border-neon-blue/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium">Performance Trends</h3>
                      <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue/30">
                        +12.3%
                      </Badge>
                    </div>
                    <div className="h-28 flex items-end space-x-1">
                      {[35, 45, 30, 60, 75, 50, 65, 70, 85, 90].map((height, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: 0.8 + i * 0.05, duration: 0.5 }}
                          className="flex-1 bg-gradient-to-t from-neon-blue to-neon-purple rounded-t"
                        />
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    className="glass-effect rounded-lg p-4 h-48 border border-neon-purple/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium">AI Insights</h3>
                      <Badge className="bg-neon-purple/20 text-neon-purple border-neon-purple/30">
                        New
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {[
                        "Sales increased by 23% in North region",
                        "Customer retention improved to 87%",
                        "Top product: Laptop Pro (127 units)"
                      ].map((insight, i) => (
                        <motion.div
                          key={i}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
                          className="flex items-center space-x-2 text-xs p-2 rounded bg-gray-800/30"
                        >
                          <Lightbulb className="w-3 h-3 text-neon-yellow" />
                          <span className="text-gray-300">{insight}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Overlay with "Coming Soon" */}
              <div className="absolute inset-0 bg-cyber-dark/70 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-neon-blue mx-auto mb-4 animate-pulse" />
                  <h3 className="text-2xl font-bold text-white mb-2">Your Dashboard Awaits</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-4">
                    Complete the onboarding to unlock your personalized analytics dashboard
                  </p>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-neon-blue animate-pulse"></div>
                    <div className="w-3 h-3 rounded-full bg-neon-purple animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 rounded-full bg-neon-green animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <Card className="glass-effect border-white/10">
          <CardContent className="p-6">
            <h3 className="font-semibold text-white mb-4">Dashboard Features</h3>
            <div className="space-y-3">
              {[
                "Real-time metrics and KPIs",
                "Interactive data visualizations",
                "AI-generated insights and recommendations",
                "One-click ML model execution",
                "Customizable layout and widgets"
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-center space-x-3"
                >
                  <Check className="w-5 h-5 text-neon-green" />
                  <span className="text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex justify-end"
      >
        <Button 
          onClick={onNext} 
          className="cyber-button"
        >
          Continue to Next Step
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  );
};

// Add Lightbulb component for the insights
const Lightbulb = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 18h6"></path>
    <path d="M10 22h4"></path>
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path>
  </svg>
);

export default DashboardStep;