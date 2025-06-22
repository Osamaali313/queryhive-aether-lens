import React, { useState, lazy, Suspense } from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import FileUpload from '@/components/FileUpload';
import AIChat from '@/components/AIChat';
import DatasetManager from '@/components/DatasetManager';
import LoadingSpinner from '@/components/LoadingSpinner';
import InteractiveTour from '@/components/landing/InteractiveTour';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, Brain, Upload, BarChart3, Zap, Menu, X, HelpCircle } from 'lucide-react';
import { useDatasets } from '@/hooks/useDatasets';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

// Lazy load heavy components for better performance
const MobileOptimizedDashboard = lazy(() => import('@/components/MobileOptimizedDashboard'));
const VirtualizedDataTable = lazy(() => import('@/components/VirtualizedDataTable'));

const Index = () => {
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const { datasets } = useDatasets();
  const isMobile = useIsMobile();

  const handleFileUpload = (file: any) => {
    if (file.data) {
      setUploadedData(prev => [...prev, ...file.data]);
    }
  };

  // Skip link for accessibility
  const SkipLink = () => (
    <a 
      href="#main-content" 
      className="skip-link"
      onFocus={(e) => e.target.classList.add('focus:top-4')}
      onBlur={(e) => e.target.classList.remove('focus:top-4')}
    >
      Skip to main content
    </a>
  );

  // If mobile, use the optimized mobile dashboard
  if (isMobile) {
    return (
      <div className="min-h-screen bg-cyber-dark">
        <SkipLink />
        <Header />
        <main id="main-content" className="pt-20">
          <Suspense fallback={<LoadingSpinner size="lg" message="Loading mobile interface..." />}>
            <MobileOptimizedDashboard />
          </Suspense>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-dark">
      <SkipLink />
      
      {/* Animated background grid */}
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none" aria-hidden="true"></div>
      
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main id="main-content" className="pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Tour Button */}
          <div className="fixed bottom-6 right-6 z-40">
            <Button
              onClick={() => setShowTour(true)}
              className="cyber-button shadow-2xl shadow-neon-blue/20"
              size="lg"
            >
              <HelpCircle className="w-5 h-5 mr-2" />
              Take Tour
            </Button>
          </div>

          {/* Main Interface */}
          <section className="w-full">
            <Tabs 
              defaultValue="dashboard" 
              className="space-y-6"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 glass-effect">
                <TabsTrigger 
                  value="dashboard" 
                  className="data-tab"
                  aria-controls="dashboard-tab"
                  data-tour="dashboard"
                >
                  <BarChart3 className="w-4 h-4 mr-2" aria-hidden="true" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger 
                  value="upload" 
                  className="data-tab"
                  aria-controls="upload-tab"
                  data-tour="upload"
                >
                  <Upload className="w-4 h-4 mr-2" aria-hidden="true" />
                  Data Upload
                </TabsTrigger>
                <TabsTrigger 
                  value="ai-chat" 
                  className="data-tab"
                  aria-controls="ai-chat-tab"
                  data-tour="ai-chat"
                >
                  <Brain className="w-4 h-4 mr-2" aria-hidden="true" />
                  AI Assistant
                </TabsTrigger>
                <TabsTrigger 
                  value="insights" 
                  className="data-tab"
                  aria-controls="insights-tab"
                  data-tour="knowledge"
                >
                  <Zap className="w-4 h-4 mr-2" aria-hidden="true" />
                  Insights
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" id="dashboard-tab" className="space-y-6">
                <Dashboard />
              </TabsContent>

              <TabsContent value="upload" id="upload-tab" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <FileUpload onFileUpload={handleFileUpload} />
                    <DatasetManager />
                  </div>
                  <div>
                    <Card className="glass-effect p-6" data-tour="ml-models">
                      <h3 className="text-lg font-semibold mb-4">Data Processing</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Datasets</span>
                          <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">
                            {datasets.length}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Records Processed</span>
                          <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue/30">
                            {datasets.reduce((sum, d) => sum + (d.row_count || 0), 0).toLocaleString()}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">AI Models Ready</span>
                          <Badge className="bg-neon-purple/20 text-neon-purple border-neon-purple/30">
                            {datasets.length > 0 ? '4 Active' : 'Pending'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Processing Status</span>
                          <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">
                            Ready
                          </Badge>
                        </div>
                      </div>
                    </Card>

                    {uploadedData.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-4">Data Preview</h3>
                        <Suspense fallback={<LoadingSpinner size="md" message="Loading data preview..." />}>
                          <VirtualizedDataTable 
                            data={uploadedData.slice(0, 100)} 
                            height={300}
                          />
                        </Suspense>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ai-chat" id="ai-chat-tab" className="space-y-6">
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

              <TabsContent value="insights" id="insights-tab" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="data-card">
                    <h3 className="text-lg font-semibold mb-4 text-neon-blue">Machine Learning Models</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Linear Regression</span>
                        <Badge className={datasets.length > 0 ? "bg-neon-green/20 text-neon-green" : "bg-gray-500/20 text-gray-400"}>
                          {datasets.length > 0 ? 'Active' : 'Pending'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">K-Means Clustering</span>
                        <Badge className={datasets.length > 0 ? "bg-neon-green/20 text-neon-green" : "bg-gray-500/20 text-gray-400"}>
                          {datasets.length > 0 ? 'Active' : 'Pending'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Anomaly Detection</span>
                        <Badge className={datasets.length > 0 ? "bg-neon-green/20 text-neon-green" : "bg-gray-500/20 text-gray-400"}>
                          {datasets.length > 0 ? 'Active' : 'Pending'}
                        </Badge>
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
                        <Badge className="bg-neon-green/20 text-neon-green">
                          {datasets.length > 0 ? '98%' : 'N/A'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Accuracy</span>
                        <Badge className="bg-neon-green/20 text-neon-green">
                          {datasets.length > 0 ? '95%' : 'N/A'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Consistency</span>
                        <Badge className="bg-neon-blue/20 text-neon-blue">
                          {datasets.length > 0 ? '92%' : 'N/A'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Outliers</span>
                        <Badge className="bg-neon-pink/20 text-neon-pink">
                          {datasets.length > 0 ? Math.floor(Math.random() * 5) + ' Found' : 'N/A'}
                        </Badge>
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
                        <Badge className="bg-neon-green/20 text-neon-green">
                          {datasets.length > 0 ? '94.2%' : 'N/A'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Processing Rate</span>
                        <Badge className="bg-neon-blue/20 text-neon-blue">
                          {datasets.length > 0 ? '1.2M/s' : 'N/A'}
                        </Badge>
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
          </section>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className={cn(
            "fixed inset-0 bg-black/50 z-30 lg:hidden",
            sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-cyber-dark border-r border-white/10 transform transition-transform lg:hidden",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Navigation</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'upload', label: 'Data Upload', icon: Upload },
              { id: 'ai-chat', label: 'AI Assistant', icon: Brain },
              { id: 'insights', label: 'Insights', icon: Zap },
            ].map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  activeTab === item.id && "bg-neon-blue/20 text-neon-blue"
                )}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
              >
                <item.icon className="w-4 h-4 mr-2" aria-hidden="true" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      </div>

      {/* Interactive Tour */}
      <InteractiveTour isOpen={showTour} onClose={() => setShowTour(false)} />
    </div>
  );
};

export default Index;