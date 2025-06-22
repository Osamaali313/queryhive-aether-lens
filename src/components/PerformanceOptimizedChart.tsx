import React, { useMemo, memo } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

interface PerformanceOptimizedChartProps {
  data: ChartDataPoint[];
  type?: 'line' | 'area' | 'bar';
  title?: string;
  dataKey?: string;
  color?: string;
  height?: number;
  showTrend?: boolean;
  className?: string;
}

// Memoized custom tooltip component
const CustomTooltip = memo(({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-lg p-3 shadow-xl">
        <p className="text-sm text-white font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value.toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
});

CustomTooltip.displayName = 'CustomTooltip';

const PerformanceOptimizedChart: React.FC<PerformanceOptimizedChartProps> = memo(({
  data,
  type = 'line',
  title,
  dataKey = 'value',
  color = '#00d4ff',
  height = 300,
  showTrend = true,
  className
}) => {
  // Memoize trend calculation
  const trendData = useMemo(() => {
    if (!showTrend || data.length < 2) return null;
    
    const firstValue = data[0][dataKey];
    const lastValue = data[data.length - 1][dataKey];
    const change = lastValue - firstValue;
    const percentChange = ((change / firstValue) * 100);
    
    return {
      change,
      percentChange,
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
    };
  }, [data, dataKey, showTrend]);

  // Memoize chart component to prevent unnecessary re-renders
  const ChartComponent = useMemo(() => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (type) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              fill={color}
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        );
      
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
            />
          </LineChart>
        );
    }
  }, [data, type, dataKey, color]);

  if (!data || data.length === 0) {
    return (
      <Card className={cn("glass-effect p-6", className)}>
        <div className="text-center text-muted-foreground">
          No data available for chart
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("glass-effect", className)}>
      {(title || showTrend) && (
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            {title && (
              <h3 className="text-lg font-semibold text-white">{title}</h3>
            )}
            {showTrend && trendData && (
              <div className="flex items-center space-x-2">
                {trendData.direction === 'up' && (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                )}
                {trendData.direction === 'down' && (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                {trendData.direction === 'neutral' && (
                  <Minus className="w-4 h-4 text-gray-500" />
                )}
                <Badge
                  className={cn(
                    "text-xs",
                    trendData.direction === 'up' && "bg-green-500/20 text-green-400 border-green-500/30",
                    trendData.direction === 'down' && "bg-red-500/20 text-red-400 border-red-500/30",
                    trendData.direction === 'neutral' && "bg-gray-500/20 text-gray-400 border-gray-500/30"
                  )}
                >
                  {trendData.percentChange > 0 ? '+' : ''}{trendData.percentChange.toFixed(1)}%
                </Badge>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="p-4">
        <ResponsiveContainer width="100%" height={height}>
          {ChartComponent}
        </ResponsiveContainer>
      </div>
      
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{data.length} data points</span>
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </Card>
  );
});

PerformanceOptimizedChart.displayName = 'PerformanceOptimizedChart';

export default PerformanceOptimizedChart;