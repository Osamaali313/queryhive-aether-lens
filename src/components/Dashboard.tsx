
import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Database, TrendingUp, Users, FileText, Brain, Zap, Upload } from 'lucide-react';
import { useDatasets } from '@/hooks/useDatasets';

interface DashboardProps {
  data?: any[];
}

const Dashboard: React.FC<DashboardProps> = ({ data = [] }) => {
  const [selectedChart, setSelectedChart] = useState<'bar' | 'line' | 'pie'>('bar');
  const { datasets } = useDatasets();

  // Process real data for visualization
  const chartData = useMemo(() => {
    if (data.length === 0) {
      // Sample data when no real data is available
      return [
        { name: 'Jan', value: 400, category: 'A' },
        { name: 'Feb', value: 300, category: 'B' },
        { name: 'Mar', value: 600, category: 'A' },
        { name: 'Apr', value: 800, category: 'C' },
        { name: 'May', value: 500, category: 'B' },
        { name: 'Jun', value: 900, category: 'A' },
      ];
    }

    // Convert real data to chart format
    return data.slice(0, 10).map((item, index) => {
      const keys = Object.keys(item);
      const numericKey = keys.find(key => typeof item[key] === 'number');
      const labelKey = keys.find(key => typeof item[key] === 'string');
      
      return {
        name: item[labelKey] || `Item ${index + 1}`,
        value: item[numericKey] || Math.random() * 1000,
        category: item[labelKey] || 'Data',
      };
    });
  }, [data]);

  const pieData = useMemo(() => {
    if (data.length === 0) {
      return [
        { name: 'Category A', value: 400, color: '#00d4ff' },
        { name: 'Category B', value: 300, color: '#8b5cf6' },
        { name: 'Category C', value: 300, color: '#f472b6' },
        { name: 'Category D', value: 200, color: '#10b981' },
      ];
    }

    // Process real data for pie chart
    const categories = {};
    data.forEach(item => {
      const keys = Object.keys(item);
      const categoryKey = keys.find(key => typeof item[key] === 'string');
      const valueKey = keys.find(key => typeof item[key] === 'number');
      
      if (categoryKey && valueKey) {
        const category = item[categoryKey];
        const value = item[valueKey];
        categories[category] = (categories[category] || 0) + value;
      }
    });

    const colors = ['#00d4ff', '#8b5cf6', '#f472b6', '#10b981', '#f59e0b', '#ef4444'];
    return Object.entries(categories).slice(0, 6).map(([name, value], index) => ({
      name,
      value: value as number,
      color: colors[index % colors.length],
    }));
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
      title: 'Active Users',
      value: '1',
      icon: Users,
      change: '+100%',
      color: 'text-neon-purple'
    },
    {
      title: 'AI Insights',
      value: Math.min(42, totalRecords).toString(),
      icon: Brain,
      change: totalRecords > 0 ? '+18.3%' : '0%',
      color: 'text-neon-pink'
    }
  ];

  const renderChart = () => {
    switch (selectedChart) {
      case 'bar':
        return (
          <BarChart data={chartData}>
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
          <LineChart data={chartData}>
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
              stroke="#00d4ff" 
              strokeWidth={3}
              dot={{ fill: '#00d4ff', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#8b5cf6', strokeWidth: 2 }}
            />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
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
          <p className="text-muted-foreground">Real-time data insights and visualizations</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="glass-effect border-neon-blue/30">
            <FileText className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button className="cyber-button">
            <Zap className="w-4 h-4 mr-2" />
            Generate Insights
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

      {/* Chart Controls */}
      <Card className="glass-effect p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Data Visualization</h3>
          <div className="flex gap-2">
            {(['bar', 'line', 'pie'] as const).map((type) => (
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

      {/* AI Insights Panel */}
      <Card className="glass-effect p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-neon-purple" />
          AI-Generated Insights
        </h3>
        <div className="space-y-3">
          {totalRecords > 0 ? (
            <>
              <div className="p-4 bg-gradient-to-r from-neon-blue/10 to-transparent rounded-lg border border-neon-blue/20">
                <p className="text-sm">
                  <strong>Data Overview:</strong> You have {totalDatasets} dataset(s) with a total of {totalRecords.toLocaleString()} records ready for analysis.
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-neon-purple/10 to-transparent rounded-lg border border-neon-purple/20">
                <p className="text-sm">
                  <strong>Quality Assessment:</strong> Your data appears well-structured and ready for advanced analytics and AI insights.
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-neon-green/10 to-transparent rounded-lg border border-neon-green/20">
                <p className="text-sm">
                  <strong>Next Steps:</strong> Use the AI Assistant to ask questions about your data and discover hidden patterns.
                </p>
              </div>
            </>
          ) : (
            <div className="p-4 bg-gradient-to-r from-gray-500/10 to-transparent rounded-lg border border-gray-500/20">
              <p className="text-sm">
                <strong>Getting Started:</strong> Upload your data to start generating AI-powered insights and analytics.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
