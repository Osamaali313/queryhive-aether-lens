
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Database, TrendingUp, Users, FileText, Brain, Zap } from 'lucide-react';

interface DashboardProps {
  data?: any[];
}

const Dashboard: React.FC<DashboardProps> = ({ data = [] }) => {
  const [selectedChart, setSelectedChart] = useState<'bar' | 'line' | 'pie'>('bar');

  // Sample data for demonstration
  const sampleData = data.length > 0 ? data.slice(0, 10) : [
    { name: 'Jan', value: 400, category: 'A' },
    { name: 'Feb', value: 300, category: 'B' },
    { name: 'Mar', value: 600, category: 'A' },
    { name: 'Apr', value: 800, category: 'C' },
    { name: 'May', value: 500, category: 'B' },
    { name: 'Jun', value: 900, category: 'A' },
  ];

  const pieData = [
    { name: 'Category A', value: 400, color: '#00d4ff' },
    { name: 'Category B', value: 300, color: '#8b5cf6' },
    { name: 'Category C', value: 300, color: '#f472b6' },
    { name: 'Category D', value: 200, color: '#10b981' },
  ];

  const stats = [
    {
      title: 'Total Records',
      value: data.length > 0 ? data.length.toLocaleString() : '1,234',
      icon: Database,
      change: '+12.5%',
      color: 'text-neon-blue'
    },
    {
      title: 'Growth Rate',
      value: '23.8%',
      icon: TrendingUp,
      change: '+5.2%',
      color: 'text-neon-green'
    },
    {
      title: 'Active Users',
      value: '856',
      icon: Users,
      change: '+8.1%',
      color: 'text-neon-purple'
    },
    {
      title: 'AI Insights',
      value: '42',
      icon: Brain,
      change: '+18.3%',
      color: 'text-neon-pink'
    }
  ];

  const renderChart = () => {
    switch (selectedChart) {
      case 'bar':
        return (
          <BarChart data={sampleData}>
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
          <LineChart data={sampleData}>
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
          <div className="p-4 bg-gradient-to-r from-neon-blue/10 to-transparent rounded-lg border border-neon-blue/20">
            <p className="text-sm">
              <strong>Trend Analysis:</strong> Your data shows a consistent upward trend with 23.8% growth over the last period.
            </p>
          </div>
          <div className="p-4 bg-gradient-to-r from-neon-purple/10 to-transparent rounded-lg border border-neon-purple/20">
            <p className="text-sm">
              <strong>Anomaly Detection:</strong> Unusual spike detected in Category A during March - investigate for potential opportunities.
            </p>
          </div>
          <div className="p-4 bg-gradient-to-r from-neon-green/10 to-transparent rounded-lg border border-neon-green/20">
            <p className="text-sm">
              <strong>Prediction:</strong> Based on current patterns, expect 15-20% growth in the next quarter.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
