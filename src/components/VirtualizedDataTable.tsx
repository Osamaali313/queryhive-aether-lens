import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface VirtualizedDataTableProps {
  data: Record<string, any>[];
  height?: number;
  itemHeight?: number;
  className?: string;
}

interface RowProps {
  index: number;
  style: React.CSSProperties;
  data: {
    items: Record<string, any>[];
    columns: string[];
  };
}

const Row: React.FC<RowProps> = ({ index, style, data }) => {
  const { items, columns } = data;
  const item = items[index];

  return (
    <div
      style={style}
      className={cn(
        "flex items-center border-b border-white/10 px-4",
        index % 2 === 0 ? "bg-gray-800/20" : "bg-gray-800/10"
      )}
    >
      {columns.map((column, colIndex) => (
        <div
          key={column}
          className={cn(
            "flex-1 text-sm truncate",
            colIndex === 0 ? "font-medium text-white" : "text-gray-300"
          )}
        >
          {typeof item[column] === 'number' ? (
            <Badge variant="outline" className="text-neon-blue border-neon-blue/30">
              {item[column].toLocaleString()}
            </Badge>
          ) : typeof item[column] === 'boolean' ? (
            <Badge 
              variant="outline" 
              className={item[column] ? "text-neon-green border-neon-green/30" : "text-red-400 border-red-400/30"}
            >
              {item[column] ? 'Yes' : 'No'}
            </Badge>
          ) : (
            String(item[column] || '-')
          )}
        </div>
      ))}
    </div>
  );
};

const VirtualizedDataTable: React.FC<VirtualizedDataTableProps> = ({
  data,
  height = 400,
  itemHeight = 50,
  className
}) => {
  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  const itemData = useMemo(() => ({
    items: data,
    columns
  }), [data, columns]);

  if (data.length === 0) {
    return (
      <Card className={cn("glass-effect p-8 text-center", className)}>
        <p className="text-muted-foreground">No data available</p>
      </Card>
    );
  }

  return (
    <Card className={cn("glass-effect overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center bg-gray-800/50 border-b border-white/10 px-4 py-3">
        {columns.map((column, index) => (
          <div
            key={column}
            className={cn(
              "flex-1 text-sm font-semibold text-white",
              index === 0 ? "text-neon-blue" : ""
            )}
          >
            {column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </div>
        ))}
      </div>

      {/* Virtualized List */}
      <List
        height={height}
        itemCount={data.length}
        itemSize={itemHeight}
        itemData={itemData}
        className="scrollbar-thin scrollbar-thumb-neon-blue/50 scrollbar-track-gray-800/20"
      >
        {Row}
      </List>

      {/* Footer */}
      <div className="flex items-center justify-between bg-gray-800/30 border-t border-white/10 px-4 py-2">
        <p className="text-xs text-muted-foreground">
          Showing {data.length.toLocaleString()} rows
        </p>
        <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue/30">
          Virtualized
        </Badge>
      </div>
    </Card>
  );
};

export default VirtualizedDataTable;