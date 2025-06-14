
import React from 'react';
import { Brain, Database, Zap, TrendingUp, Users, Target } from 'lucide-react';

const AnimatedCharacters: React.FC = () => {
  return (
    <div className="relative w-full h-96 overflow-hidden">
      {/* Main AI Character - Data Analyst */}
      <div className="absolute top-8 left-8 animate-float">
        <div className="relative">
          {/* Character body */}
          <div className="w-20 h-24 bg-gradient-to-b from-neon-blue to-neon-purple rounded-2xl relative shadow-2xl">
            {/* Face */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-white to-gray-100 rounded-full shadow-lg">
              {/* Eyes */}
              <div className="absolute top-4 left-3 w-2 h-2 bg-neon-blue rounded-full animate-pulse"></div>
              <div className="absolute top-4 right-3 w-2 h-2 bg-neon-blue rounded-full animate-pulse"></div>
              {/* Smile */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-6 h-3 border-b-2 border-neon-blue rounded-full"></div>
            </div>
            
            {/* AI brain glow */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <Brain className="w-6 h-6 text-neon-blue animate-pulse" />
            </div>
          </div>
          
          {/* Floating data points */}
          <div className="absolute -top-4 -right-2 animate-bounce" style={{ animationDelay: '0.5s' }}>
            <div className="w-3 h-3 bg-neon-green rounded-full opacity-80"></div>
          </div>
          <div className="absolute -bottom-2 -left-4 animate-bounce" style={{ animationDelay: '1s' }}>
            <div className="w-2 h-2 bg-neon-pink rounded-full opacity-80"></div>
          </div>
        </div>
      </div>

      {/* Database Character */}
      <div className="absolute top-16 right-12 animate-float" style={{ animationDelay: '1s' }}>
        <div className="relative">
          <div className="w-16 h-20 bg-gradient-to-b from-neon-green to-neon-blue rounded-2xl relative shadow-xl">
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-white to-gray-100 rounded-full shadow-md">
              <div className="absolute top-3 left-2 w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse"></div>
              <div className="absolute top-3 right-2 w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse"></div>
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-4 h-2 border-b-2 border-neon-green rounded-full"></div>
            </div>
            
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
              <Database className="w-5 h-5 text-neon-green animate-pulse" />
            </div>
          </div>
          
          {/* Data streams */}
          <div className="absolute top-0 -left-6 space-y-1">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-1 h-1 bg-neon-green rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
            ))}
          </div>
        </div>
      </div>

      {/* ML Model Character */}
      <div className="absolute bottom-12 left-16 animate-float" style={{ animationDelay: '2s' }}>
        <div className="relative">
          <div className="w-18 h-22 bg-gradient-to-b from-neon-purple to-neon-pink rounded-2xl relative shadow-xl">
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-gradient-to-br from-white to-gray-100 rounded-full shadow-md">
              <div className="absolute top-3 left-2 w-1.5 h-1.5 bg-neon-purple rounded-full animate-pulse"></div>
              <div className="absolute top-3 right-2 w-1.5 h-1.5 bg-neon-purple rounded-full animate-pulse"></div>
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-4 h-2 border-b-2 border-neon-purple rounded-full"></div>
            </div>
            
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
              <TrendingUp className="w-5 h-5 text-neon-purple animate-pulse" />
            </div>
          </div>
          
          {/* Neural network connections */}
          <div className="absolute -right-4 top-4">
            <div className="w-6 h-6 relative">
              <div className="absolute top-0 left-0 w-1 h-1 bg-neon-purple rounded-full animate-pulse"></div>
              <div className="absolute top-2 left-2 w-1 h-1 bg-neon-purple rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
              <div className="absolute top-4 left-0 w-1 h-1 bg-neon-purple rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Character */}
      <div className="absolute bottom-8 right-8 animate-float" style={{ animationDelay: '1.5s' }}>
        <div className="relative">
          <div className="w-16 h-20 bg-gradient-to-b from-neon-pink to-neon-blue rounded-2xl relative shadow-xl">
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-white to-gray-100 rounded-full shadow-md">
              <div className="absolute top-3 left-2 w-1.5 h-1.5 bg-neon-pink rounded-full animate-pulse"></div>
              <div className="absolute top-3 right-2 w-1.5 h-1.5 bg-neon-pink rounded-full animate-pulse"></div>
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-4 h-2 border-b-2 border-neon-pink rounded-full"></div>
            </div>
            
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
              <Zap className="w-5 h-5 text-neon-pink animate-pulse" />
            </div>
          </div>
          
          {/* Insight bubbles */}
          <div className="absolute -top-6 -left-8 space-x-2 flex">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 bg-neon-pink rounded-full animate-bounce" style={{ animationDelay: `${i * 0.3}s` }}></div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Collaboration Character */}
      <div className="absolute top-32 left-32 animate-float" style={{ animationDelay: '2.5s' }}>
        <div className="relative">
          <div className="w-14 h-18 bg-gradient-to-b from-neon-green to-neon-purple rounded-2xl relative shadow-lg">
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-white to-gray-100 rounded-full shadow-sm">
              <div className="absolute top-2 left-1.5 w-1 h-1 bg-neon-green rounded-full animate-pulse"></div>
              <div className="absolute top-2 right-1.5 w-1 h-1 bg-neon-green rounded-full animate-pulse"></div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-1 border-b border-neon-green rounded-full"></div>
            </div>
            
            <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2">
              <Users className="w-4 h-4 text-neon-green animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Character */}
      <div className="absolute top-24 right-32 animate-float" style={{ animationDelay: '3s' }}>
        <div className="relative">
          <div className="w-14 h-18 bg-gradient-to-b from-neon-blue to-neon-green rounded-2xl relative shadow-lg">
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-white to-gray-100 rounded-full shadow-sm">
              <div className="absolute top-2 left-1.5 w-1 h-1 bg-neon-blue rounded-full animate-pulse"></div>
              <div className="absolute top-2 right-1.5 w-1 h-1 bg-neon-blue rounded-full animate-pulse"></div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-1 border-b border-neon-blue rounded-full"></div>
            </div>
            
            <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2">
              <Target className="w-4 h-4 text-neon-blue animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating data particles connecting characters */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random()}s`
            }}
          >
            <div className="w-1 h-1 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full opacity-60"></div>
          </div>
        ))}
      </div>

      {/* Connection lines between characters */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#00d4ff', stopOpacity: 0.6 }} />
            <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.6 }} />
          </linearGradient>
        </defs>
        <path
          d="M 80 100 Q 200 150 300 120"
          stroke="url(#connectionGradient)"
          strokeWidth="1"
          fill="none"
          className="animate-pulse"
        />
        <path
          d="M 150 200 Q 250 180 320 220"
          stroke="url(#connectionGradient)"
          strokeWidth="1"
          fill="none"
          className="animate-pulse"
          style={{ animationDelay: '0.5s' }}
        />
        <path
          d="M 200 280 Q 280 260 350 300"
          stroke="url(#connectionGradient)"
          strokeWidth="1"
          fill="none"
          className="animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </svg>
    </div>
  );
};

export default AnimatedCharacters;
