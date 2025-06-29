import React, { useMemo, useState, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ArrowUpDown, Search, Filter, Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  };
}

const Row: React.FC<RowProps> = ({ index, style, data }) => {
  const { items, columns, sortConfig } = data;
  const item = items[index];

  return (
    <motion.div
      style={style}
      className={cn(
        "flex items-center border-b border-white/10 px-4 py-2",
        index % 2 === 0 ? "bg-gray-800/20" : "bg-gray-800/10"
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.01 }}
      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
    >
      {columns.map((column, colIndex) => (
        <div
          key={column}
          className={cn(
            "flex-1 text-sm truncate px-2",
            colIndex === 0 ? "font-medium text-white" : "text-gray-300",
            sortConfig?.key === column ? "text-neon-blue" : ""
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
    </motion.div>
  );
};

const VirtualizedDataTable: React.FC<VirtualizedDataTableProps> = ({
  data,
  height = 400,
  itemHeight = 50,
  className
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  const handleSort = useCallback((key: string) => {
    setSortConfig(prevSortConfig => {
      if (prevSortConfig?.key === key) {
        return prevSortConfig.direction === 'asc'
          ? { key, direction: 'desc' }
          : null;
      }
      return { key, direction: 'asc' };
    });
  }, []);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleFilterChange = useCallback((column: string, value: string) => {
    setFilters(prev => {
      if (value === '') {
        const newFilters = { ...prev };
        delete newFilters[column];
        return newFilters;
      }
      return { ...prev, [column]: value };
    });
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setSearchTerm('');
  }, []);

  const handleExportCSV = useCallback(() => {
    if (data.length === 0) return;
    
    // Convert data to CSV
    const headers = columns.join(',');
    const rows = filteredAndSortedData.map(row => 
      columns.map(col => {
        const value = row[col];
        // Handle values that might contain commas
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'data_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [data, columns, filteredAndSortedData]);

  // Apply search and filters
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Apply search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = Object.values(item).some(value => 
          String(value).toLowerCase().includes(searchLower)
        );
        if (!matchesSearch) return false;
      }
      
      // Apply column filters
      for (const [column, filterValue] of Object.entries(filters)) {
        if (filterValue && !String(item[column]).toLowerCase().includes(filterValue.toLowerCase())) {
          return false;
        }
      }
      
      return true;
    });
  }, [data, searchTerm, filters]);

  // Apply sorting
  const filteredAndSortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortConfig]);

  const itemData = useMemo(() => ({
    items: filteredAndSortedData,
    columns,
    sortConfig
  }), [filteredAndSortedData, columns, sortConfig]);

  if (data.length === 0) {
    return (
      <Card className={cn("glass-effect p-8 text-center", className)}>
        <p className="text-muted-foreground">No data available</p>
      </Card>
    );
  }

  return (
    <Card className={cn("glass-effect overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="p-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-9 h-9 w-[200px] glass-effect border-white/20"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "border-white/20",
              showFilters && "bg-neon-blue/10 text-neon-blue border-neon-blue/30"
            )}
          >
            <Filter className="h-4 w-4 mr-1" />
            Filters
            {Object.keys(filters).length > 0 && (
              <Badge className="ml-1 bg-neon-blue/20 text-neon-blue border-neon-blue/30">
                {Object.keys(filters).length}
              </Badge>
            )}
          </Button>
          {(searchTerm || Object.keys(filters).length > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-muted-foreground hover:text-white"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCSV}
          className="border-white/20"
        >
          <Download className="h-4 w-4 mr-1" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 border-b border-white/10 bg-gray-800/20 flex flex-wrap gap-2">
              {columns.slice(0, 5).map(column => (
                <div key={column} className="flex-1 min-w-[150px]">
                  <p className="text-xs text-muted-foreground mb-1">{column}</p>
                  <Input
                    placeholder={`Filter ${column}...`}
                    value={filters[column] || ''}
                    onChange={(e) => handleFilterChange(column, e.target.value)}
                    className="h-8 text-xs glass-effect border-white/20"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center bg-gray-800/50 border-b border-white/10 px-4 py-3">
        {columns.map((column, index) => (
          <div
            key={column}
            className={cn(
              "flex-1 text-sm font-semibold text-white px-2 cursor-pointer select-none",
              index === 0 ? "text-neon-blue" : "",
              sortConfig?.key === column ? "text-neon-blue" : ""
            )}
            onClick={() => handleSort(column)}
          >
            <div className="flex items-center">
              {column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              {sortConfig?.key === column && (
                <ArrowUpDown className={cn(
                  "ml-1 h-4 w-4",
                  sortConfig.direction === 'desc' && "rotate-180"
                )} />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Virtualized List */}
      <List
        height={height}
        itemCount={filteredAndSortedData.length}
        itemSize={itemHeight}
        itemData={itemData}
        className="scrollbar-thin scrollbar-thumb-neon-blue/50 scrollbar-track-gray-800/20"
        width="100%"
      >
        {Row}
      </List>

      {/* Footer */}
      <div className="flex items-center justify-between bg-gray-800/30 border-t border-white/10 px-4 py-2">
        <p className="text-xs text-muted-foreground">
          Showing {filteredAndSortedData.length} of {data.length} rows
        </p>
        <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue/30">
          Virtualized
        </Badge>
      </div>
    </Card>
  );
};

export default VirtualizedDataTable;