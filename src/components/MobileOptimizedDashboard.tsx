import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Database, 
  Brain, 
  Activity, 
  TrendingUp, 
  BarChart3, 
  Users, 
  Target,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useDatasets } from '@/hooks/useDatasets';
import { useMLModels } from '@/hooks/useMLModels';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { useLearningSystem } from '@/hooks/useLearningSystem';
import { cn } from '@/lib/utils';

const MobileOptimizedDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { datasets } = useDatasets();
  const { insights, isLoadingInsights } = useMLModels();
  const { entries: knowledgeEntries } = useKnowledgeBase();
  const { patterns } = useLearningSystem();

  const stats = [
    { 
      label: 'Datasets', 
      value: datasets.length, 
      icon: Database, 
      color: 'text-neon-blue',
      bgColor: 'bg-neon-blue/10'
    },
    { 
      label: 'AI Insights', 
      value: insights.length, 
      icon: Brain, 
      color: 'text-neon-purple',
      bgColor: 'bg-neon-purple/10'
    },
    { 
      label: 'Knowledge Base', 
      value: knowledgeEntries.length, 
      icon: Target, 
      color: 'text-neon-green',
      bgColor: 'bg-neon-green/10'
    },
    { 
      label: 'Learning Patterns', 
      value: patterns.length, 
      icon: Activity, 
      color: 'text-neon-pink',
      bgColor: 'bg-neon-pink/10'
    },
  ];

  const quickActions = [
    { label: 'Upload Data', icon: Database, action: () => setActiveTab('upload') },
    { label: 'AI Chat', icon: Brain, action: () => setActiveTab('chat') },
    { label: 'View Insights', icon: TrendingUp, action: () => setActiveTab('insights') },
    { label: 'Analytics', icon: BarChart3, action: () => setActiveTab('analytics') },
  ];

  const recentActivity = [
    { type: 'insight', message: 'Generated clustering analysis', time: '2m ago', icon: Brain },
    { type: 'data', message: 'Uploaded sales_data.csv', time: '5m ago', icon: Database },
    { type: 'pattern', message: 'New learning pattern detected', time: '8m ago', icon: Activity },
    { type: 'knowledge', message: 'Added insight to knowledge base', time: '12m ago', icon: Target },
  ];

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-cyber-dark/95 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            QueryHive AI
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Mobile Sidebar */}
        <div className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-cyber-dark border-r border-white/10 transform transition-transform lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-4 space-y-4">
            <div className="hidden lg:block">
              <h2 className="text-lg font-semibold text-white">Dashboard</h2>
            </div>
            
            <nav className="space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'datasets', label: 'Datasets', icon: Database },
                { id: 'insights', label: 'Insights', icon: Brain },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp },
                { id: 'knowledge', label: 'Knowledge', icon: Target },
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
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <Card key={index} className="glass-effect p-4">
                    <div className="flex items-center space-x-3">
                      <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                        <stat.icon className={cn("w-5 h-5", stat.color)} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-muted-foreground truncate">{stat.label}</p>
                        <p className="text-xl font-bold">{stat.value}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Quick Actions */}
              <Card className="glass-effect p-4">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center space-y-2 glass-effect border-white/20 hover:border-neon-blue/50"
                      onClick={action.action}
                    >
                      <action.icon className="w-6 h-6 text-neon-blue" />
                      <span className="text-xs text-center">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className="glass-effect p-4">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5">
                        <div className="p-2 rounded-full bg-neon-blue/10">
                          <activity.icon className="w-4 h-4 text-neon-blue" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            </TabsContent>

            <TabsContent value="datasets" className="space-y-4">
              <Card className="glass-effect p-4">
                <h3 className="text-lg font-semibold mb-4">Your Datasets</h3>
                {datasets.length === 0 ? (
                  <div className="text-center py-8">
                    <Database className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400">No datasets found</p>
                    <p className="text-sm text-gray-500">Upload your first dataset to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {datasets.slice(0, 5).map((dataset) => (
                      <div key={dataset.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white truncate">{dataset.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {dataset.row_count?.toLocaleString() || 0} rows
                          </p>
                        </div>
                        <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">
                          Active
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <Card className="glass-effect p-4">
                <h3 className="text-lg font-semibold mb-4">AI Insights</h3>
                {isLoadingInsights ? (
                  <div className="flex items-center justify-center h-32">
                    <Activity className="w-8 h-8 animate-spin text-neon-purple" />
                  </div>
                ) : insights.length > 0 ? (
                  <div className="space-y-3">
                    {insights.slice(0, 5).map((insight) => (
                      <div key={insight.id} className="p-3 rounded-lg bg-gray-800/30">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-neon-blue text-sm">{insight.title}</h4>
                          <Badge className="bg-neon-purple/20 text-neon-purple border-neon-purple/30 text-xs">
                            {insight.insight_type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-300 line-clamp-2">{insight.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(insight.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Brain className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400">No insights generated yet</p>
                    <p className="text-sm text-gray-500">Upload data and run analysis to see insights</p>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MobileOptimizedDashboard;