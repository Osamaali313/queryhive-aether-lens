import React, { useMemo, Suspense, lazy, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDatasets } from '@/hooks/useDatasets';
import { useMLModels } from '@/hooks/useMLModels';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { useLearningSystem } from '@/hooks/useLearningSystem';
import { Database, Brain, Activity, TrendingUp, Users, Target, AlertTriangle, Clock, BookOpen, Network, Star, Lightbulb, MoreHorizontal, Maximize2, Minimize2, X, Save, Settings } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import KnowledgeGraphViewer from './KnowledgeGraphViewer';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useA11y } from './a11y/A11yProvider';

// Lazy load heavy components
const PerformanceOptimizedChart = lazy(() => import('./PerformanceOptimizedChart'));

// Widget interface
interface Widget {
  id: string;
  title: string;
  description?: string;
  component: React.ReactNode;
  size: 'small' | 'medium' | 'large';
  position: { x: number, y: number };
  minimized?: boolean;
  removable?: boolean;
}

const Dashboard = () => {
  const { datasets } = useDatasets();
  const { insights, isLoadingInsights } = useMLModels();
  const { entries: knowledgeEntries } = useKnowledgeBase();
  const { patterns } = useLearningSystem();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { successToast, errorToast } = useToast();
  const { announce } = useA11y();
  
  // State for widget management
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [isLayoutSaving, setIsLayoutSaving] = useState(false);
  const [isLayoutLoaded, setIsLayoutLoaded] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Default widgets configuration
  const defaultWidgets: Widget[] = [
    {
      id: 'metrics',
      title: 'Key Metrics',
      component: <KeyMetricsWidget />,
      size: 'large',
      position: { x: 0, y: 0 },
      removable: false,
    },
    {
      id: 'knowledge-graph',
      title: 'Knowledge Graph',
      component: <KnowledgeGraphViewer />,
      size: 'medium',
      position: { x: 0, y: 1 },
      removable: true,
    },
    {
      id: 'learning-metrics',
      title: 'Learning System Metrics',
      component: <LearningMetricsWidget />,
      size: 'medium',
      position: { x: 1, y: 1 },
      removable: true,
    },
    {
      id: 'analytics-trends',
      title: 'Analytics Trends',
      component: <AnalyticsTrendsWidget />,
      size: 'medium',
      position: { x: 0, y: 2 },
      removable: true,
    },
    {
      id: 'model-performance',
      title: 'ML Model Performance',
      component: <ModelPerformanceWidget />,
      size: 'medium',
      position: { x: 1, y: 2 },
      removable: true,
    },
    {
      id: 'recent-insights',
      title: 'Recent AI Insights',
      component: <RecentInsightsWidget insights={insights} isLoading={isLoadingInsights} />,
      size: 'large',
      position: { x: 0, y: 3 },
      removable: true,
    },
  ];

  // Load dashboard layout from database
  useEffect(() => {
    const loadDashboardLayout = async () => {
      if (!user || isLayoutLoaded) return;
      
      try {
        const { data, error } = await supabase
          .from('dashboards')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();
        
        if (error) {
          if (error.code === 'PGRST116') {
            // No rows returned, use default layout
            setWidgets(defaultWidgets);
          } else {
            console.error('Error loading dashboard layout:', error);
            // If there's an error, use default layout
            setWidgets(defaultWidgets);
          }
        } else if (data && data.layout) {
          // Use saved layout
          setWidgets(data.layout as Widget[]);
        } else {
          // No saved layout found, use default
          setWidgets(defaultWidgets);
        }
      } catch (error) {
        console.error('Error loading dashboard layout:', error);
        setWidgets(defaultWidgets);
      } finally {
        setIsLayoutLoaded(true);
      }
    };
    
    loadDashboardLayout();
  }, [user, isLayoutLoaded, defaultWidgets]);

  // Save dashboard layout to database
  const saveDashboardLayout = async () => {
    if (!user) return;
    
    setIsLayoutSaving(true);
    
    try {
      const { data, error } = await supabase
        .from('dashboards')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Update existing dashboard
        const { error: updateError } = await supabase
          .from('dashboards')
          .update({
            layout: widgets,
            updated_at: new Date().toISOString()
          })
          .eq('id', data[0].id);
        
        if (updateError) throw updateError;
      } else {
        // Create new dashboard
        const { error: insertError } = await supabase
          .from('dashboards')
          .insert({
            user_id: user.id,
            name: 'Main Dashboard',
            description: 'Primary analytics dashboard',
            layout: widgets,
            is_public: false
          });
        
        if (insertError) throw insertError;
      }
      
      successToast(
        "Dashboard Saved",
        "Your dashboard layout has been saved successfully."
      );
      announce("Dashboard layout saved successfully", "polite");
    } catch (error) {
      console.error('Error saving dashboard layout:', error);
      errorToast(
        "Save Failed",
        "Failed to save dashboard layout. Please try again."
      );
      announce("Failed to save dashboard layout", "assertive");
    } finally {
      setIsLayoutSaving(false);
    }
  };

  // Handle widget minimization/maximization
  const toggleWidgetMinimize = (id: string) => {
    setWidgets(prev => 
      prev.map(widget => 
        widget.id === id 
          ? { ...widget, minimized: !widget.minimized } 
          : widget
      )
    );
    announce(`Widget ${widgets.find(w => w.id === id)?.title} ${widgets.find(w => w.id === id)?.minimized ? 'maximized' : 'minimized'}`, "polite");
  };

  // Handle widget removal
  const removeWidget = (id: string) => {
    setWidgets(prev => prev.filter(widget => widget.id !== id));
    announce(`Widget ${widgets.find(w => w.id === id)?.title} removed`, "polite");
  };

  // Handle drag end for widgets
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setWidgets(items);
    announce("Widget position updated", "polite");
  };

  // Responsive layout adjustments
  const gridCols = isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5';
  const chartHeight = isMobile ? 250 : 300;

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

  // If mobile, use a simplified layout
  if (isMobile) {
    return (
      <div className="space-y-6 p-6" aria-label="Dashboard">
        <KeyMetricsWidget />
        <RecentInsightsWidget insights={insights} isLoading={isLoadingInsights} />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6" aria-label="Dashboard">
      {/* Dashboard Controls */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
          Analytics Dashboard
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditMode(!isEditMode)}
            className={`border-white/20 ${isEditMode ? 'bg-neon-blue/10 text-neon-blue' : ''}`}
          >
            <Settings className="w-4 h-4 mr-2" />
            {isEditMode ? 'Exit Edit Mode' : 'Customize'}
          </Button>
          {isEditMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={saveDashboardLayout}
              disabled={isLayoutSaving}
              className="border-neon-green/30 text-neon-green"
            >
              {isLayoutSaving ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Layout
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dashboard-widgets" direction="vertical">
          {(provided) => (
            <div 
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-6"
            >
              {widgets.map((widget, index) => (
                <Draggable 
                  key={widget.id} 
                  draggableId={widget.id} 
                  index={index}
                  isDragDisabled={!isEditMode}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`${widget.size === 'large' ? 'col-span-2' : ''}`}
                      >
                        <Card className={`glass-effect overflow-hidden ${isEditMode ? 'border-dashed border-white/30' : ''}`}>
                          <div 
                            className="p-4 border-b border-white/10 flex items-center justify-between" 
                            {...(isEditMode ? provided.dragHandleProps : {})}
                          >
                            <h3 className="text-lg font-semibold flex items-center">
                              {widget.title}
                            </h3>
                            <div className="flex items-center space-x-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => toggleWidgetMinimize(widget.id)}
                                aria-label={widget.minimized ? "Maximize" : "Minimize"}
                              >
                                {widget.minimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                              </Button>
                              {isEditMode && widget.removable && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 hover:bg-red-500/10 hover:text-red-400"
                                  onClick={() => removeWidget(widget.id)}
                                  aria-label="Remove widget"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                              {!isEditMode && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  aria-label="Widget options"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <AnimatePresence>
                            {!widget.minimized && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                {widget.component}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Card>
                      </motion.div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add Widget Button (visible only in edit mode) */}
      {isEditMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          <Card className="glass-effect border-dashed border-white/30">
            <div className="p-8 flex flex-col items-center justify-center">
              <Button 
                variant="outline" 
                className="border-neon-blue/30 text-neon-blue"
                onClick={() => {
                  // Add a new widget (for demo, we'll add a pre-configured widget)
                  const newWidget: Widget = {
                    id: `widget-${Date.now()}`,
                    title: 'New Widget',
                    component: <div className="p-6 text-center text-muted-foreground">Widget content goes here</div>,
                    size: 'medium',
                    position: { x: 0, y: widgets.length },
                    removable: true,
                  };
                  setWidgets([...widgets, newWidget]);
                  announce("New widget added", "polite");
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Widget
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

// Widget Components
const KeyMetricsWidget = () => {
  const { datasets } = useDatasets();
  const { insights } = useMLModels();
  const { entries: knowledgeEntries } = useKnowledgeBase();
  const { patterns } = useLearningSystem();

  const metrics = [
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
      icon: BookOpen,
      color: 'text-neon-green',
      bgColor: 'bg-neon-green/10'
    },
    {
      label: 'Learning Patterns',
      value: patterns.length,
      icon: Network,
      color: 'text-neon-yellow',
      bgColor: 'bg-neon-yellow/10'
    },
    {
      label: 'AI Accuracy',
      value: '92%',
      icon: Star,
      color: 'text-neon-orange',
      bgColor: 'bg-neon-orange/10'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4" aria-label="Key metrics">
      {metrics.map((metric, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
        >
          <Card className="glass-effect p-4 hover:bg-white/10 transition-colors duration-300">
            <div className="flex items-center space-x-3">
              <metric.icon className={`w-8 h-8 ${metric.color}`} aria-hidden="true" />
              <div>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="text-2xl font-bold">{metric.value}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

const LearningMetricsWidget = () => {
  const learningMetrics = [
    { metric: 'Personalization Score', value: 87, max: 100, color: '#8b5cf6' },
    { metric: 'Knowledge Retention', value: 92, max: 100, color: '#10b981' },
    { metric: 'Response Accuracy', value: 89, max: 100, color: '#f59e0b' },
    { metric: 'User Satisfaction', value: 94, max: 100, color: '#00f5ff' },
  ];

  return (
    <div className="p-4 space-y-4">
      {learningMetrics.map((metric, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
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
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(metric.value / metric.max) * 100}%` }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-2 rounded-full"
              style={{ backgroundColor: metric.color }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const AnalyticsTrendsWidget = () => {
  const analyticsData = [
    { name: 'Jan', insights: 12, accuracy: 85, knowledge: 45 },
    { name: 'Feb', insights: 19, accuracy: 88, knowledge: 52 },
    { name: 'Mar', insights: 25, accuracy: 92, knowledge: 61 },
    { name: 'Apr', insights: 32, accuracy: 89, knowledge: 68 },
    { name: 'May', insights: 28, accuracy: 94, knowledge: 75 },
    { name: 'Jun', insights: 35, accuracy: 91, knowledge: 82 },
  ];

  return (
    <div className="p-4">
      <Suspense fallback={<LoadingSpinner size="lg" message="Loading chart..." />}>
        <PerformanceOptimizedChart
          title="Enhanced Analytics Trends"
          data={analyticsData}
          type="area"
          dataKey="insights"
          color="#8b5cf6"
          height={250}
        />
      </Suspense>
    </div>
  );
};

const ModelPerformanceWidget = () => {
  const modelPerformance = [
    { name: 'Linear Regression', accuracy: 94, usage: 45 },
    { name: 'Clustering', accuracy: 87, usage: 32 },
    { name: 'Anomaly Detection', accuracy: 91, usage: 28 },
    { name: 'Time Series', accuracy: 89, usage: 22 },
  ];

  return (
    <div className="p-4">
      <Suspense fallback={<LoadingSpinner size="lg" message="Loading chart..." />}>
        <PerformanceOptimizedChart
          title="ML Model Performance"
          data={modelPerformance}
          type="bar"
          dataKey="accuracy"
          color="#10b981"
          height={250}
        />
      </Suspense>
    </div>
  );
};

interface RecentInsightsWidgetProps {
  insights: any[];
  isLoading: boolean;
}

const RecentInsightsWidget: React.FC<RecentInsightsWidgetProps> = ({ insights, isLoading }) => {
  return (
    <div className="p-4">
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <LoadingSpinner size="lg" message="Loading insights..." />
        </div>
      ) : insights.length > 0 ? (
        <div className="space-y-4">
          {insights.slice(0, 6).map((insight, index) => (
            <motion.div 
              key={insight.id} 
              className="border border-white/10 rounded-lg p-4 bg-gray-800/30 hover:bg-gray-800/50 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
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
            </motion.div>
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
  );
};

// Plus icon component
const Plus = ({ className }: { className?: string }) => (
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
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default Dashboard;