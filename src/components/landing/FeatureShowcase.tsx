import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Database, 
  Zap, 
  TrendingUp, 
  Users, 
  Target, 
  MessageSquare,
  BarChart3,
  Network,
  Shield,
  Rocket,
  Sparkles
} from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  benefits: string[];
  demo?: string;
}

const features: Feature[] = [
  {
    id: 'ai-chat',
    title: 'Natural Language Queries',
    description: 'Ask questions about your data in plain English and get intelligent responses',
    icon: MessageSquare,
    color: 'neon-blue',
    benefits: [
      'No SQL knowledge required',
      'Context-aware responses',
      'Multi-turn conversations',
      'Smart suggestions'
    ],
    demo: 'Try: "What are the sales trends for the last quarter?"'
  },
  {
    id: 'ml-models',
    title: 'Built-in ML Models',
    description: 'Advanced machine learning algorithms ready to analyze your data',
    icon: Brain,
    color: 'neon-purple',
    benefits: [
      'Linear regression analysis',
      'K-means clustering',
      'Anomaly detection',
      'Time series forecasting'
    ],
    demo: 'One-click ML analysis with detailed explanations'
  },
  {
    id: 'real-time',
    title: 'Real-time Analytics',
    description: 'Live dashboards that update as your data changes',
    icon: Zap,
    color: 'neon-green',
    benefits: [
      'Instant data processing',
      'Live visualizations',
      'Automated alerts',
      'Performance monitoring'
    ],
    demo: 'Watch your metrics update in real-time'
  },
  {
    id: 'collaboration',
    title: 'Team Collaboration',
    description: 'Share insights and work together on data analysis',
    icon: Users,
    color: 'neon-pink',
    benefits: [
      'Shared workspaces',
      'Comment system',
      'Export capabilities',
      'Access controls'
    ],
    demo: 'Collaborate with your team seamlessly'
  },
  {
    id: 'knowledge-graph',
    title: 'Knowledge Graph',
    description: 'Discover hidden relationships in your data automatically',
    icon: Network,
    color: 'neon-yellow',
    benefits: [
      'Relationship mapping',
      'Entity recognition',
      'Pattern discovery',
      'Visual exploration'
    ],
    demo: 'Explore data connections visually'
  },
  {
    id: 'security',
    title: 'Enterprise Security',
    description: 'Bank-level security with complete data isolation',
    icon: Shield,
    color: 'neon-orange',
    benefits: [
      'Row-level security',
      'Data encryption',
      'Audit logging',
      'Compliance ready'
    ],
    demo: 'Your data stays completely private'
  }
];

const FeatureShowcase: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(features[0]);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          const isActive = activeFeature.id === feature.id;
          const isHovered = hoveredFeature === feature.id;
          
          return (
            <Card
              key={feature.id}
              className={`relative overflow-hidden transition-all duration-300 cursor-pointer group ${
                isActive 
                  ? `border-${feature.color}/50 bg-${feature.color}/5 scale-105 shadow-2xl shadow-${feature.color}/20` 
                  : 'border-white/10 hover:border-white/20 hover:scale-102'
              }`}
              onClick={() => setActiveFeature(feature)}
              onMouseEnter={() => setHoveredFeature(feature.id)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isActive || isHovered
                      ? `bg-${feature.color}/20 text-${feature.color}` 
                      : 'bg-gray-800 text-gray-400'
                  }`}>
                    <Icon className={`w-6 h-6 ${(isActive || isHovered) && 'animate-pulse'}`} />
                  </div>
                  {isActive && (
                    <Badge className={`bg-${feature.color}/20 text-${feature.color} border-${feature.color}/30`}>
                      Active
                    </Badge>
                  )}
                </div>
                <CardTitle className={`text-lg transition-colors duration-300 ${
                  isActive ? `text-${feature.color}` : 'text-white'
                }`}>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">
                  {feature.description}
                </p>
                
                {/* Benefits */}
                <div className="space-y-2">
                  {feature.benefits.slice(0, isActive ? 4 : 2).map((benefit, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-500">
                      <Sparkles className={`w-3 h-3 mr-2 ${
                        isActive ? `text-${feature.color}` : 'text-gray-600'
                      }`} />
                      {benefit}
                    </div>
                  ))}
                </div>

                {/* Demo Text */}
                {feature.demo && isActive && (
                  <div className={`mt-4 p-3 rounded-lg bg-${feature.color}/10 border border-${feature.color}/20`}>
                    <p className={`text-xs text-${feature.color} font-medium`}>
                      💡 {feature.demo}
                    </p>
                  </div>
                )}
              </CardContent>

              {/* Animated Background */}
              {(isActive || isHovered) && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className={`absolute inset-0 opacity-5 animate-pulse bg-gradient-to-br from-${feature.color}/20 to-transparent`} />
                  {isActive && (
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${feature.color} to-${feature.color}/50`} />
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Detailed Feature View */}
      <Card className="glass-effect border-white/10">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-xl bg-${activeFeature.color}/20 flex items-center justify-center`}>
              <activeFeature.icon className={`w-8 h-8 text-${activeFeature.color}`} />
            </div>
            <div>
              <CardTitle className="text-2xl text-white">{activeFeature.title}</CardTitle>
              <p className="text-gray-400 mt-1">{activeFeature.description}</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="benefits" className="w-full">
            <TabsList className="grid w-full grid-cols-3 glass-effect">
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="demo">Live Demo</TabsTrigger>
              <TabsTrigger value="integration">Integration</TabsTrigger>
            </TabsList>
            
            <TabsContent value="benefits" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeFeature.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/30">
                    <div className={`w-2 h-2 rounded-full bg-${activeFeature.color}`} />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="demo" className="mt-6">
              <div className={`p-6 rounded-lg bg-${activeFeature.color}/5 border border-${activeFeature.color}/20`}>
                <div className="flex items-center space-x-2 mb-4">
                  <Rocket className={`w-5 h-5 text-${activeFeature.color}`} />
                  <span className={`text-${activeFeature.color} font-medium`}>Interactive Demo</span>
                </div>
                <p className="text-gray-300 mb-4">
                  {activeFeature.demo || 'Experience this feature in our interactive demo environment.'}
                </p>
                <Button className={`bg-${activeFeature.color}/20 hover:bg-${activeFeature.color}/30 border border-${activeFeature.color}/50`}>
                  Try Live Demo
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="integration" className="mt-6">
              <div className="space-y-4">
                <p className="text-gray-300">
                  This feature integrates seamlessly with your existing workflow:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-gray-800/30 text-center">
                    <Database className="w-8 h-8 text-neon-blue mx-auto mb-2" />
                    <p className="text-sm text-gray-300">Data Sources</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-800/30 text-center">
                    <BarChart3 className="w-8 h-8 text-neon-green mx-auto mb-2" />
                    <p className="text-sm text-gray-300">Analytics Tools</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-800/30 text-center">
                    <TrendingUp className="w-8 h-8 text-neon-purple mx-auto mb-2" />
                    <p className="text-sm text-gray-300">Business Intelligence</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureShowcase;