import React, { useMemo, Suspense, lazy } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDatasets } from '@/hooks/useDatasets';
import { useMLModels } from '@/hooks/useMLModels';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { useLearningSystem } from '@/hooks/useLearningSystem';
import { Database, Brain, Activity, TrendingUp, Users, Target, AlertTriangle, Clock, BookOpen, Network, Star, Lightbulb } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import KnowledgeGraphViewer from './KnowledgeGraphViewer';
import { useIsMobile } from '@/hooks/use-mobile';

// Lazy load heavy components
const PerformanceOptimizedChart = lazy(() => import('./PerformanceOptimizedChart'));

const Dashboard = () => {
  const { datasets } = useDatasets();
  const { insights, isLoadingInsights } = useMLModels();
  const { entries: knowledgeEntries } = useKnowledgeBase();
  const { patterns } = useLearningSystem();
  const isMobile = useIsMobile();

  // Memoize data to prevent unnecessary recalculations
  const analyticsData = useMemo(() => [
    { name: 'Jan', insights: 12, accuracy: 85, knowledge: 45 },
    { name: 'Feb', insights: 19, accuracy: 88, knowledge: 52 },
    { name: 'Mar', insights: 25, accuracy: 92, knowledge: 61 },
    { name: 'Apr', insights: 32, accuracy: 89, knowledge: 68 },
    { name: 'May', insights: 28, accuracy: 94, knowledge: 75 },
    { name: 'Jun', insights: 35, accuracy: 91, knowledge: 82 },
  ], []);

  const modelPerformance = useMemo(() => [
    { name: 'Linear Regression', accuracy: 94, usage: 45 },
    { name: 'Clustering', accuracy: 87, usage: 32 },
    { name: 'Anomaly Detection', accuracy: 91, usage: 28 },
    { name: 'Time Series', accuracy: 89, usage: 22 },
  ], []);

  const insightCategories = useMemo(() => [
    { name: 'ML Analysis', value: 35, color: '#8b5cf6' },
    { name: 'Data Quality', value: 25, color: '#10b981' },
    { name: 'Trends', value: 20, color: '#f59e0b' },
    { name: 'Anomalies', value: 12, color: '#ef4444' },
    { name: 'Predictions', value: 8, color: '#00f5ff' },
  ], []);

  const learningMetrics = useMemo(() => [
    { metric: 'Personalization Score', value: 87, max: 100, color: '#8b5cf6' },
    { metric: 'Knowledge Retention', value: 92, max: 100, color: '#10b981' },
    { metric: 'Response Accuracy', value: 89, max: 100, color: '#f59e0b' },
    { metric: 'User Satisfaction', value: 94, max: 100, color: '#00f5ff' },
  ], []);

  const recentActivity = useMemo(() => [
    { type: 'insight', action: 'Generated clustering analysis for Sales Data', time: '2 minutes ago', icon: Brain },
    { type: 'knowledge', action: 'Added new pattern: User prefers visual data representations', time: '5 minutes ago', icon: Lightbulb },
    { type: 'feedback', action: 'Received positive feedback on anomaly detection', time: '8 minutes ago', icon: Star },
    { type: 'graph', action: 'Built knowledge graph with 127 entities', time: '12 minutes ago', icon: Network },
    { type: 'learning', action: 'Updated model preferences based on usage patterns', time: '15 minutes ago', icon: Target },
  ], []);

  // Responsive layout adjustments
  const gridCols = isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5';
  const chartHeight = isMobile ? 250 : 300;

  return (
    <div className="space-y-6 p-6" aria-label="Dashboard">
      {/* Enhanced Header Stats */}
      <div className={`grid ${gridCols} gap-4`} aria-label="Key metrics">
        <Card className="glass-effect p-4">
          <div className="flex items-center space-x-3">
            <Database className="w-8 h-8 text-neon-blue" aria-hidden="true" />
            <div>
              <p className="text-sm text-muted-foreground">Datasets</p>
              <p className="text-2xl font-bold">{datasets.length}</p>
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-4">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-neon-purple" aria-hidden="true" />
            <div>
              <p className="text-sm text-muted-foreground">AI Insights</p>
              <p className="text-2xl font-bold">{insights.length}</p>
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-4">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-neon-green" aria-hidden="true" />
            <div>
              <p className="text-sm text-muted-foreground">Knowledge Base</p>
              <p className="text-2xl font-bold">{knowledgeEntries.length}</p>
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-4">
          <div className="flex items-center space-x-3">
            <Network className="w-8 h-8 text-neon-yellow" aria-hidden="true" />
            <div>
              <p className="text-sm text-muted-foreground">Learning Patterns</p>
              <p className="text-2xl font-bold">{patterns.length}</p>
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-4">
          <div className="flex items-center space-x-3">
            <Star className="w-8 h-8 text-neon-orange" aria-hidden="true" />
            <div>
              <p className="text-sm text-muted-foreground">AI Accuracy</p>
              <p className="text-2xl font-bold">92%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Knowledge Graph Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" aria-label="Knowledge graph and learning metrics">
        <KnowledgeGraphViewer />
        
        <Card className="glass-effect">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-lg font-semibold flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-neon-yellow" aria-hidden="true" />
              Learning System Metrics
            </h3>
          </div>
          <div className="p-4 space-y-4">
            {learningMetrics.map((metric, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{metric.metric}</span>
                  <span style={{ color: metric.color }}>{metric.value}%</span>
                </div>
                <div 
                  className="w-full bg-gray-700 rounded-full h-2"
                  role="progressbar"
                  aria-valuenow={metric.value}
                  aria-valuemin={0}
                  aria-valuemax={metric.max}
                  aria-label={`${metric.metric}: ${metric.value}%`}
                >
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(metric.value / metric.max) * 100}%`,
                      backgroundColor: metric.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" aria-label="Analytics charts">
        <Suspense fallback={<Card className="glass-effect p-6"><LoadingSpinner size="lg" message="Loading chart..." /></Card>}>
          <PerformanceOptimizedChart
            title="Enhanced Analytics Trends"
            data={analyticsData}
            type="area"
            dataKey="insights"
            color="#8b5cf6"
            height={chartHeight}
          />
        </Suspense>

        <Suspense fallback={<Card className="glass-effect p-6"><LoadingSpinner size="lg" message="Loading chart..." /></Card>}>
          <PerformanceOptimizedChart
            title="ML Model Performance"
            data={modelPerformance}
            type="bar"
            dataKey="accuracy"
            color="#10b981"
            height={chartHeight}
          />
        </Suspense>
      </div>

      {/* Enhanced Insights and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" aria-label="Insights and activity">
        <Card className="glass-effect lg:col-span-2">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-lg font-semibold flex items-center">
              <Brain className="w-5 h-5 mr-2 text-neon-purple" aria-hidden="true" />
              Recent AI Insights
            </h3>
          </div>
          <div className="p-4">
            {isLoadingInsights ? (
              <div className="flex items-center justify-center h-48">
                <LoadingSpinner size="lg" message="Loading insights..." />
              </div>
            ) : insights.length > 0 ? (
              <div className="space-y-4">
                {insights.slice(0, 6).map((insight) => (
                  <div key={insight.id} className="border border-white/10 rounded-lg p-4 bg-gray-800/30">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-neon-blue">{insight.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {insight.confidence_score ? `${(insight.confidence_score * 100).toFixed(0)}% confidence` : 'N/A'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-neon-purple/20 text-neon-purple px-2 py-1 rounded">
                        {insight.insight_type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(insight.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {insight.metadata && (
                      <div className="mt-2 text-xs text-gray-400">
                        <strong>Details:</strong> {
                          typeof insight.metadata === 'object' 
                            ? Object.entries(insight.metadata).slice(0, 2).map(([key, value]) => 
                                `${key}: ${value}`
                              ).join(', ')
                            : String(insight.metadata).substring(0, 100)
                        }
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Brain className="w-12 h-12 text-gray-500 mx-auto mb-3" aria-hidden="true" />
                <p className="text-gray-400">No insights generated yet</p>
                <p className="text-sm text-gray-500">Upload data and run ML analysis to see insights</p>
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          {/* Insight Categories */}
          <Card className="glass-effect">
            <div className="p-4 border-b border-white/10">
              <h3 className="text-lg font-semibold">Insight Distribution</h3>
            </div>
            <div className="p-4">
              <div className="h-[200px] flex items-center justify-center">
                <Suspense fallback={<LoadingSpinner size="md" message="Loading chart..." />}>
                  <PerformanceOptimizedChart
                    data={insightCategories.map(cat => ({ name: cat.name, value: cat.value }))}
                    type="bar"
                    dataKey="value"
                    color="#8b5cf6"
                    height={200}
                    showTrend={false}
                  />
                </Suspense>
              </div>
              <div className="mt-4 space-y-2">
                {insightCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                        aria-hidden="true"
                      />
                      <span>{category.name}</span>
                    </div>
                    <span>{category.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="glass-effect">
            <div className="p-4 border-b border-white/10">
              <h3 className="text-lg font-semibold flex items-center">
                <Clock className="w-5 h-5 mr-2 text-neon-orange" aria-hidden="true" />
                System Activity
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-2 rounded-lg bg-gray-800/30">
                  <activity.icon className="w-4 h-4 mt-1 text-neon-blue flex-shrink-0" aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-300">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;