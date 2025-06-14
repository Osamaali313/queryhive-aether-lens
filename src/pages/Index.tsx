
import React, { useState } from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import FileUpload from '@/components/FileUpload';
import AIChat from '@/components/AIChat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, Brain, Upload, BarChart3, Zap, Github } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [user, setUser] = useState(null);
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const { toast } = useToast();

  const handleLogin = () => {
    toast({
      title: "Authentication Required",
      description: "Please connect to Supabase to enable user authentication",
    });
  };

  const handleLogout = () => {
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const handleFileUpload = (file: any) => {
    if (file.data) {
      setUploadedData(prev => [...prev, ...file.data]);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Animated background grid */}
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none"></div>
      
      {/* Header */}
      <Header user={user} onLogin={handleLogin} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center py-12 mb-8">
            <div className="mb-6">
              <Badge className="bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border-neon-blue/30 text-neon-blue mb-4">
                🚀 Next-Gen Analytics Platform
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
              QueryHive AI
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Transform your data into actionable insights with AI-powered analytics, 
              machine learning models, and natural language queries
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button className="cyber-button text-lg px-8 py-3">
                <Database className="w-5 h-5 mr-2" />
                Connect to Supabase
              </Button>
              <Button variant="outline" className="glass-effect border-neon-purple/30 text-lg px-8 py-3">
                <Github className="w-5 h-5 mr-2" />
                View Demo
              </Button>
            </div>

            {/* Feature highlights */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {[
                { icon: Brain, text: 'AI-Powered Analytics' },
                { icon: Upload, text: 'CSV Data Import' },
                { icon: BarChart3, text: 'Dynamic Dashboards' },
                { icon: Zap, text: 'Real-time Insights' }
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 glass-effect px-4 py-2 rounded-full">
                  <feature.icon className="w-4 h-4 text-neon-blue" />
                  <span className="text-sm">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Interface */}
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 glass-effect">
                <TabsTrigger value="dashboard" className="data-tab">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="upload" className="data-tab">
                  <Upload className="w-4 h-4 mr-2" />
                  Data Upload
                </TabsTrigger>
                <TabsTrigger value="ai-chat" className="data-tab">
                  <Brain className="w-4 h-4 mr-2" />
                  AI Assistant
                </TabsTrigger>
                <TabsTrigger value="insights" className="data-tab">
                  <Zap className="w-4 h-4 mr-2" />
                  Insights
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-6" data-section="dashboard">
                <div data-section="analytics">
                  <Dashboard data={uploadedData} />
                </div>
              </TabsContent>

              <TabsContent value="upload" className="space-y-6" data-section="reports">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <FileUpload onFileUpload={handleFileUpload} />
                  </div>
                  <div>
                    <Card className="glass-effect p-6">
                      <h3 className="text-lg font-semibold mb-4">Data Processing</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Records Processed</span>
                          <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">
                            {uploadedData.length.toLocaleString()}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">AI Models Ready</span>
                          <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue/30">
                            4 Active
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Processing Status</span>
                          <Badge className="bg-neon-purple/20 text-neon-purple border-neon-purple/30">
                            Ready
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ai-chat" className="space-y-6" data-section="ai-chat">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <AIChat />
                  </div>
                  <div className="space-y-4">
                    <Card className="glass-effect p-6">
                      <h3 className="text-lg font-semibold mb-4 text-neon-purple">AI Capabilities</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-gradient-to-r from-neon-blue/10 to-transparent rounded-lg">
                          <h4 className="font-medium text-sm">Natural Language Queries</h4>
                          <p className="text-xs text-muted-foreground">Ask questions in plain English</p>
                        </div>
                        <div className="p-3 bg-gradient-to-r from-neon-purple/10 to-transparent rounded-lg">
                          <h4 className="font-medium text-sm">Predictive Analytics</h4>
                          <p className="text-xs text-muted-foreground">ML-powered forecasting</p>
                        </div>
                        <div className="p-3 bg-gradient-to-r from-neon-green/10 to-transparent rounded-lg">
                          <h4 className="font-medium text-sm">Anomaly Detection</h4>
                          <p className="text-xs text-muted-foreground">Identify data outliers</p>
                        </div>
                        <div className="p-3 bg-gradient-to-r from-neon-pink/10 to-transparent rounded-lg">
                          <h4 className="font-medium text-sm">Report Generation</h4>
                          <p className="text-xs text-muted-foreground">Automated insights</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="insights" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="data-card">
                    <h3 className="text-lg font-semibold mb-4 text-neon-blue">Machine Learning Models</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Linear Regression</span>
                        <Badge className="bg-neon-green/20 text-neon-green">Active</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">K-Means Clustering</span>
                        <Badge className="bg-neon-green/20 text-neon-green">Active</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Anomaly Detection</span>
                        <Badge className="bg-neon-green/20 text-neon-green">Active</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Time Series</span>
                        <Badge className="bg-gray-500/20 text-gray-400">Pending</Badge>
                      </div>
                    </div>
                  </Card>

                  <Card className="data-card">
                    <h3 className="text-lg font-semibold mb-4 text-neon-purple">Data Quality</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Completeness</span>
                        <Badge className="bg-neon-green/20 text-neon-green">98%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Accuracy</span>
                        <Badge className="bg-neon-green/20 text-neon-green">95%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Consistency</span>
                        <Badge className="bg-neon-blue/20 text-neon-blue">92%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Outliers</span>
                        <Badge className="bg-neon-pink/20 text-neon-pink">3 Found</Badge>
                      </div>
                    </div>
                  </Card>

                  <Card className="data-card">
                    <h3 className="text-lg font-semibold mb-4 text-neon-green">Performance</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Query Speed</span>
                        <Badge className="bg-neon-green/20 text-neon-green">45ms</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Model Accuracy</span>
                        <Badge className="bg-neon-green/20 text-neon-green">94.2%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Processing Rate</span>
                        <Badge className="bg-neon-blue/20 text-neon-blue">1.2M/s</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Uptime</span>
                        <Badge className="bg-neon-green/20 text-neon-green">99.9%</Badge>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
