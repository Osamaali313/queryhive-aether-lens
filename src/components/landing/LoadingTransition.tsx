
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Database, Zap, TrendingUp } from 'lucide-react';

const LoadingTransition: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/auth');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const steps = [
    { icon: Database, text: "Connecting to data sources", delay: 0 },
    { icon: Brain, text: "Initializing AI models", delay: 500 },
    { icon: Zap, text: "Preparing analytics engine", delay: 1000 },
    { icon: TrendingUp, text: "Loading your workspace", delay: 1500 }
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-cyber-dark via-cyber-darker to-cyber-dark flex items-center justify-center z-50">
      {/* Animated background grid */}
      <div className="absolute inset-0 cyber-grid opacity-20 animate-pulse"></div>
      
      <div className="text-center space-y-12 relative z-10">
        {/* Central loading animation */}
        <div className="relative">
          <div className="w-32 h-32 mx-auto relative">
            {/* Spinning rings */}
            <div className="absolute inset-0 border-4 border-neon-blue/30 rounded-full animate-spin"></div>
            <div className="absolute inset-4 border-4 border-neon-purple/30 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
            <div className="absolute inset-8 border-4 border-neon-pink/30 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
            
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="w-12 h-12 text-neon-blue animate-pulse" />
            </div>
          </div>
        </div>

        {/* Progress steps */}
        <div className="space-y-6 max-w-md mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="flex items-center space-x-4 animate-fade-in"
              style={{ animationDelay: `${step.delay}ms` }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 flex items-center justify-center border border-neon-blue/30">
                <step.icon className="w-5 h-5 text-neon-blue" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-white font-medium">{step.text}</div>
                <div className="w-full bg-cyber-light/20 rounded-full h-1 mt-2">
                  <div 
                    className="h-full bg-gradient-to-r from-neon-blue to-neon-purple rounded-full animate-pulse"
                    style={{
                      width: '100%',
                      animationDelay: `${step.delay}ms`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main title */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            Preparing Your Analytics Workspace
          </h2>
          <p className="text-muted-foreground">
            Setting up AI models and data processing pipelines...
          </p>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${4 + Math.random() * 2}s`
              }}
            >
              <div className="w-2 h-2 bg-neon-blue/60 rounded-full animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingTransition;
