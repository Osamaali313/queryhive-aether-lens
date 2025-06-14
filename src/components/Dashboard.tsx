
import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';
import { Database, TrendingUp, Users, FileText, Brain, Zap, Upload, Play, Settings } from 'lucide-react';
import { useDatasets } from '@/hooks/useDatasets';
import { useMLModels, MLModelType } from '@/hooks/useMLModels';

interface DashboardProps {
  data?: any[];
}

const Dashboard: React.FC<DashboardProps> = ({ data = [] }) => {
  const [selectedChart, setSelectedChart] = useState<'bar' | 'line' | 'pie' | 'scatter'>('bar');
  const [selectedModel, setSelectedModel] = useState<MLModelType>('linear_regression');
  const { datasets } = useDatasets();
  const { runMLAnalysis, processData, insights, isRunningAnalysis, isProcessingData } = useMLModels();

  // Process real data for different chart types
  const chartData = useMemo(() => {
    if (data.length === 0) {
      return {
        bar: [
          { name: 'Jan', value: 400, category: 'Sales' },
          { name: 'Feb', value: 300, category: 'Marketing' },
          { name: 'Mar', value: 600, category: 'Sales' },
          { name: 'Apr', value: 800, category: 'Development' },
          { name: 'May', value: 500, category: 'Marketing' },
          { name: 'Jun', value: 900, category: 'Sales' },
        ],
        line: [
          { name: 'Week 1', value: 100 },
          { name: 'Week 2', value: 200 },
          { name: 'Week 3', value: 150 },
          { name: 'Week 4', value: 300 },
          { name: 'Week 5', value: 250 },
          { name: 'Week 6', value: 400 },
        ],
        pie: [
          { name: 'Product A', value: 35, color: '#00d4ff' },
          { name: 'Product B', value: 25, color: '#8b5cf6' },
          { name: 'Product C', value: 20, color: '#f472b6' },
          { name: 'Product D', value: 20, color: '#10b981' },
        ],
        scatter: [
          { x: 10, y: 20 }, { x: 20, y: 35 }, { x: 30, y: 45 },
          { x: 40, y: 55 }, { x: 50, y: 70 }, { x: 60, y: 85 }
        ]
      };
    }

    // Process real data for different visualization types
    const processedData = {
      bar: processDataForBar(data),
      line: processDataForLine(data),
      pie: processDataForPie(data),
      scatter: processDataForScatter(data)
    };

    return processedData;
  }, [data]);

  const totalDatasets = datasets.length;
  const totalRecords = datasets.reduce((sum, dataset) => sum + (dataset.row_count || 0), 0);

  const stats = [
    {
      title: 'Total Datasets',
      value: totalDatasets.toLocaleString(),
      icon: Database,
      change: totalDatasets > 0 ? '+100%' : '0%',
      color: 'text-neon-blue'
    },
    {
      title: 'Total Records',
      value: totalRecords.toLocaleString(),
      icon: FileText,
      change: totalRecords > 0 ? `+${Math.min(100, Math.round(totalRecords / 100))}%` : '0%',
      color: 'text-neon-green'
    },
    {
      title: 'AI Insights',
      value: insights.length.toString(),
      icon: Brain,
      change: insights.length > 0 ? '+18.3%' : '0%',
      color: 'text-neon-purple'
    },
    {
      title: 'Models Ready',
      value: totalDatasets > 0 ? '4' : '0',
      icon: Zap,
      change: totalDatasets > 0 ? '+100%' : '0%',
      color: 'text-neon-pink'
    }
  ];

  const handleRunAnalysis = async () => {
    if (datasets.length === 0) {
      return;
    }

    try {
      await runMLAnalysis.mutateAsync({
        datasetId: datasets[0].id,
        modelType: selectedModel,
        parameters: {}
      });
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  const handleProcessData = async () => {
    if (datasets.length === 0) {
      return;
    }

    try {
      await processData.mutateAsync({
        datasetId: datasets[0].id,
        operations: {
          clean: true,
          validate: true,
          transform: true,
          analyze: true
        }
      });
    } catch (error) {
      console.error('Data processing failed:', error);
    }
  };

  const renderChart = () => {
    const currentData = chartData[selectedChart];
    
    switch (selectedChart) {
      case 'bar':
        return (
          <BarChart data={currentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: '8px'
              }} 
            />
            <Bar dataKey="value" fill="#00d4ff" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={currentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: '8px'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#00d4ff', strokeWidth: 2 }}
            />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={currentData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {currentData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color || '#00d4ff'} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: '8px'
              }} 
            />
          </PieChart>
        );
      case 'scatter':
        return (
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis type="number" dataKey="x" stroke="#64748b" />
            <YAxis type="number" dataKey="y" stroke="#64748b" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: '8px'
              }} 
            />
            <Scatter name="Data Points" data={currentData} fill="#f472b6" />
          </ScatterChart>
        );
      default:
        return null;
    }
  };

  if (totalDatasets === 0) {
    return (
      <div className="text-center py-12">
        <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Data Yet</h3>
        <p className="text-muted-foreground mb-6">
          Upload your first dataset to start analyzing your data with AI-powered insights.
        </p>
        <Button className="cyber-button">
          <Upload className="w-4 h-4 mr-2" />
          Upload Data
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            Analytics Dashboard
          </h2>
          <p className="text-muted-foreground">AI-powered data insights and machine learning analytics</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="glass-effect border-neon-green/30"
            onClick={handleProcessData}
            disabled={isProcessingData}
          >
            <Settings className="w-4 h-4 mr-2" />
            {isProcessingData ? 'Processing...' : 'Process Data'}
          </Button>
          <Button 
            className="cyber-button"
            onClick={handleRunAnalysis}
            disabled={isRunningAnalysis}
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunningAnalysis ? 'Running...' : 'Run Analysis'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="data-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <Badge variant="outline" className="mt-2 border-neon-green/30 text-neon-green">
                  {stat.change}
                </Badge>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>

      {/* ML Model Selection */}
      <Card className="glass-effect p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Machine Learning Models</h3>
          <Select value={selectedModel} onValueChange={(value: MLModelType) => setSelectedModel(value)}>
            <SelectTrigger className="w-48 glass-effect">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linear_regression">Linear Regression</SelectItem>
              <SelectItem value="clustering">K-Means Clustering</SelectItem>
              <SelectItem value="anomaly_detection">Anomaly Detection</SelectItem>
              <SelectItem value="time_series">Time Series Analysis</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { type: 'linear_regression', name: 'Linear Regression', desc: 'Find relationships between variables' },
            { type: 'clustering', name: 'K-Means Clustering', desc: 'Discover data groupings' },
            { type: 'anomaly_detection', name: 'Anomaly Detection', desc: 'Identify outliers and anomalies' },
            { type: 'time_series', name: 'Time Series', desc: 'Analyze trends over time' }
          ].map((model) => (
            <Card key={model.type} className={`p-4 cursor-pointer transition-all ${
              selectedModel === model.type ? 'border-neon-blue bg-neon-blue/10' : 'glass-effect hover:border-neon-blue/50'
            }`} onClick={() => setSelectedModel(model.type as MLModelType)}>
              <h4 className="font-medium text-sm">{model.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">{model.desc}</p>
              <Badge className={`mt-2 ${totalDatasets > 0 ? 'bg-neon-green/20 text-neon-green' : 'bg-gray-500/20 text-gray-400'}`}>
                {totalDatasets > 0 ? 'Ready' : 'Pending Data'}
              </Badge>
            </Card>
          ))}
        </div>
      </Card>

      {/* Chart Visualization */}
      <Card className="glass-effect p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Data Visualization</h3>
          <div className="flex gap-2">
            {(['bar', 'line', 'pie', 'scatter'] as const).map((type) => (
              <Button
                key={type}
                variant={selectedChart === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedChart(type)}
                className={selectedChart === type ? "cyber-button" : "glass-effect border-white/20"}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </Card>

      {/* AI Insights */}
      <Card className="glass-effect p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-neon-purple" />
          AI-Generated Insights ({insights.length})
        </h3>
        <div className="space-y-3">
          {insights.length > 0 ? (
            insights.slice(0, 5).map((insight, index) => (
              <div key={insight.id} className={`p-4 rounded-lg border ${getInsightColor(insight.insight_type)}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{insight.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {insight.confidence_score ? `${(insight.confidence_score * 100).toFixed(0)}%` : 'N/A'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            ))
          ) : (
            <div className="p-4 bg-gradient-to-r from-gray-500/10 to-transparent rounded-lg border border-gray-500/20">
              <p className="text-sm">
                <strong>Getting Started:</strong> Run ML analysis on your datasets to generate AI-powered insights.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

// Helper functions for data processing
function processDataForBar(data: any[]) {
  if (data.length === 0) return [];
  
  const keys = Object.keys(data[0]);
  const categoricalKey = keys.find(key => typeof data[0][key] === 'string');
  const numericKey = keys.find(key => typeof data[0][key] === 'number');
  
  if (!categoricalKey || !numericKey) {
    return data.slice(0, 10).map((item, index) => ({
      name: `Item ${index + 1}`,
      value: Math.random() * 1000,
      category: 'Data'
    }));
  }
  
  // Group by categorical and sum numeric values
  const grouped = data.reduce((acc, item) => {
    const key = item[categoricalKey];
    acc[key] = (acc[key] || 0) + (item[numericKey] || 0);
    return acc;
  }, {});
  
  return Object.entries(grouped).slice(0, 10).map(([name, value]) => ({
    name,
    value: value as number,
    category: name
  }));
}

function processDataForLine(data: any[]) {
  if (data.length === 0) return [];
  
  const keys = Object.keys(data[0]);
  const dateKey = keys.find(key => {
    const val = data[0][key];
    return typeof val === 'string' && !isNaN(Date.parse(val));
  });
  const numericKey = keys.find(key => typeof data[0][key] === 'number');
  
  if (!dateKey && !numericKey) {
    return data.slice(0, 10).map((_, index) => ({
      name: `Point ${index + 1}`,
      value: Math.random() * 100
    }));
  }
  
  if (dateKey && numericKey) {
    return data.slice(0, 20)
      .sort((a, b) => new Date(a[dateKey]).getTime() - new Date(b[dateKey]).getTime())
      .map(item => ({
        name: new Date(item[dateKey]).toLocaleDateString(),
        value: item[numericKey]
      }));
  }
  
  return data.slice(0, 10).map((item, index) => ({
    name: `Item ${index + 1}`,
    value: item[numericKey] || Math.random() * 100
  }));
}

function processDataForPie(data: any[]) {
  if (data.length === 0) return [];
  
  const keys = Object.keys(data[0]);
  const categoricalKey = keys.find(key => typeof data[0][key] === 'string');
  
  if (!categoricalKey) {
    return [
      { name: 'Category A', value: 35, color: '#00d4ff' },
      { name: 'Category B', value: 25, color: '#8b5cf6' },
      { name: 'Category C', value: 20, color: '#f472b6' },
      { name: 'Category D', value: 20, color: '#10b981' },
    ];
  }
  
  const counts = data.reduce((acc, item) => {
    const key = item[categoricalKey];
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  
  const colors = ['#00d4ff', '#8b5cf6', '#f472b6', '#10b981', '#f59e0b', '#ef4444'];
  return Object.entries(counts).slice(0, 6).map(([name, value], index) => ({
    name,
    value: value as number,
    color: colors[index % colors.length]
  }));
}

function processDataForScatter(data: any[]) {
  if (data.length === 0) return [];
  
  const keys = Object.keys(data[0]);
  const numericKeys = keys.filter(key => typeof data[0][key] === 'number');
  
  if (numericKeys.length < 2) {
    return Array.from({ length: 20 }, (_, i) => ({
      x: i * 5,
      y: Math.random() * 100
    }));
  }
  
  const xKey = numericKeys[0];
  const yKey = numericKeys[1];
  
  return data.slice(0, 50)
    .filter(item => item[xKey] != null && item[yKey] != null)
    .map(item => ({
      x: item[xKey],
      y: item[yKey]
    }));
}

function getInsightColor(type: string) {
  switch (type) {
    case 'linear_regression':
      return 'bg-gradient-to-r from-neon-blue/10 to-transparent border-neon-blue/20';
    case 'clustering':
      return 'bg-gradient-to-r from-neon-purple/10 to-transparent border-neon-purple/20';
    case 'anomaly_detection':
      return 'bg-gradient-to-r from-neon-pink/10 to-transparent border-neon-pink/20';
    case 'time_series':
      return 'bg-gradient-to-r from-neon-green/10 to-transparent border-neon-green/20';
    default:
      return 'bg-gradient-to-r from-gray-500/10 to-transparent border-gray-500/20';
  }
}

export default Dashboard;
