import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ArrowUpDown, Search, Filter, Download, X, ChevronLeft, ChevronRight, Settings, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useA11y } from './a11y/A11yProvider';

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
    visibleColumns: string[];
    sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
    onRowClick?: (row: Record<string, any>) => void;
  };
}

interface ColumnResizeData {
  columnIndex: number;
  startX: number;
  startWidth: number;
}

const Row: React.FC<RowProps> = ({ index, style, data }) => {
  const { items, columns, visibleColumns, sortConfig, onRowClick } = data;
  const item = items[index];

  return (
    <motion.div
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '0 16px',
        backgroundColor: index % 2 === 0 ? 'rgba(31, 41, 55, 0.2)' : 'rgba(31, 41, 55, 0.1)',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.01 }}
      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
      onClick={() => onRowClick && onRowClick(item)}
      role="row"
      aria-rowindex={index + 2} // +2 because of header row and 1-based indexing
    >
      {visibleColumns.map((column, colIndex) => (
        <div
          key={column}
          className={cn(
            "flex-1 text-sm truncate px-2",
            colIndex === 0 ? "font-medium text-white" : "text-gray-300",
            sortConfig?.key === column ? "text-neon-blue" : ""
          )}
          role="cell"
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [resizingColumn, setResizingColumn] = useState<ColumnResizeData | null>(null);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [selectedRow, setSelectedRow] = useState<Record<string, any> | null>(null);
  
  const headerRef = useRef<HTMLDivElement>(null);
  const { announce } = useA11y();

  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  // Initialize visible columns and column widths
  useEffect(() => {
    if (columns.length > 0 && visibleColumns.length === 0) {
      setVisibleColumns([...columns]);
      
      // Initialize column widths
      const initialWidths: Record<string, number> = {};
      columns.forEach(col => {
        initialWidths[col] = 150; // Default width
      });
      setColumnWidths(initialWidths);
    }
  }, [columns, visibleColumns.length]);

  const handleSort = useCallback((key: string) => {
    setSortConfig(prevSortConfig => {
      if (prevSortConfig?.key === key) {
        return prevSortConfig.direction === 'asc'
          ? { key, direction: 'desc' }
          : null;
      }
      return { key, direction: 'asc' };
    });
    announce(`Sorted by ${key} ${sortConfig?.key === key && sortConfig?.direction === 'asc' ? 'descending' : 'ascending'}`, "polite");
  }, [sortConfig, announce]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
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
    setCurrentPage(1); // Reset to first page on filter change
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setSearchTerm('');
    setCurrentPage(1);
    announce("Filters cleared", "polite");
  }, [announce]);

  const handleExportCSV = useCallback(() => {
    if (data.length === 0) return;
    
    // Convert data to CSV
    const headers = visibleColumns.join(',');
    const rows = filteredAndSortedData.map(row => 
      visibleColumns.map(col => {
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
    
    announce("CSV file exported", "polite");
  }, [data, visibleColumns, filteredAndSortedData, announce]);

  // Column resizing handlers
  const handleResizeStart = useCallback((e: React.MouseEvent, columnIndex: number) => {
    e.preventDefault();
    
    const column = visibleColumns[columnIndex];
    const startWidth = columnWidths[column] || 150;
    
    setResizingColumn({
      columnIndex,
      startX: e.clientX,
      startWidth
    });
    
    // Add event listeners for resize
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  }, [visibleColumns, columnWidths]);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!resizingColumn) return;
    
    const { columnIndex, startX, startWidth } = resizingColumn;
    const column = visibleColumns[columnIndex];
    const diff = e.clientX - startX;
    const newWidth = Math.max(50, startWidth + diff); // Minimum width of 50px
    
    setColumnWidths(prev => ({
      ...prev,
      [column]: newWidth
    }));
  }, [resizingColumn, visibleColumns]);

  const handleResizeEnd = useCallback(() => {
    setResizingColumn(null);
    
    // Remove event listeners
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  }, [handleResizeMove]);

  // Column visibility toggle
  const toggleColumnVisibility = useCallback((column: string) => {
    setVisibleColumns(prev => {
      if (prev.includes(column)) {
        // Don't allow hiding all columns
        if (prev.length <= 1) return prev;
        return prev.filter(col => col !== column);
      } else {
        return [...prev, column];
      }
    });
    announce(`Column ${column} ${visibleColumns.includes(column) ? 'hidden' : 'shown'}`, "polite");
  }, [visibleColumns, announce]);

  // Apply search and filters
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Apply search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = Object.entries(item).some(([key, value]) => 
          visibleColumns.includes(key) && 
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
  }, [data, searchTerm, filters, visibleColumns]);

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

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedData.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedData, currentPage, pageSize]);

  const totalPages = useMemo(() => 
    Math.max(1, Math.ceil(filteredAndSortedData.length / pageSize))
  , [filteredAndSortedData.length, pageSize]);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    announce(`Page ${newPage} of ${totalPages}`, "polite");
  }, [totalPages, announce]);

  const handleRowClick = useCallback((row: Record<string, any>) => {
    setSelectedRow(row);
    announce("Row details opened", "polite");
  }, [announce]);

  const itemData = useMemo(() => ({
    items: paginatedData,
    columns,
    visibleColumns,
    sortConfig,
    onRowClick: handleRowClick
  }), [paginatedData, columns, visibleColumns, sortConfig, handleRowClick]);

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
              aria-label="Search data"
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
            aria-expanded={showFilters}
            aria-controls="filter-panel"
          >
            <Filter className="h-4 w-4 mr-1" />
            Filters
            {Object.keys(filters).length > 0 && (
              <Badge className="ml-1 bg-neon-blue/20 text-neon-blue border-neon-blue/30">
                {Object.keys(filters).length}
              </Badge>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowColumnSettings(!showColumnSettings)}
            className={cn(
              "border-white/20",
              showColumnSettings && "bg-neon-purple/10 text-neon-purple border-neon-purple/30"
            )}
            aria-expanded={showColumnSettings}
            aria-controls="column-settings-panel"
          >
            <Settings className="h-4 w-4 mr-1" />
            Columns
          </Button>
          {(searchTerm || Object.keys(filters).length > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-muted-foreground hover:text-white"
              aria-label="Clear all filters and search"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">
            {filteredAndSortedData.length} rows
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="border-white/20"
            aria-label="Export as CSV"
          >
            <Download className="h-4 w-4 mr-1" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            id="filter-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 border-b border-white/10 bg-gray-800/20 flex flex-wrap gap-2">
              {visibleColumns.slice(0, 5).map(column => (
                <div key={column} className="flex-1 min-w-[150px]">
                  <p className="text-xs text-muted-foreground mb-1">{column}</p>
                  <Input
                    placeholder={`Filter ${column}...`}
                    value={filters[column] || ''}
                    onChange={(e) => handleFilterChange(column, e.target.value)}
                    className="h-8 text-xs glass-effect border-white/20"
                    aria-label={`Filter by ${column}`}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Column Settings */}
      <AnimatePresence>
        {showColumnSettings && (
          <motion.div
            id="column-settings-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 border-b border-white/10 bg-gray-800/20">
              <p className="text-xs text-muted-foreground mb-2">Toggle column visibility:</p>
              <div className="flex flex-wrap gap-2">
                {columns.map(column => (
                  <Button
                    key={column}
                    variant="outline"
                    size="sm"
                    onClick={() => toggleColumnVisibility(column)}
                    className={cn(
                      "text-xs h-7 px-2",
                      visibleColumns.includes(column)
                        ? "bg-neon-purple/10 text-neon-purple border-neon-purple/30"
                        : "bg-gray-800/30 text-gray-400 border-gray-700"
                    )}
                  >
                    {visibleColumns.includes(column) ? (
                      <Eye className="h-3 w-3 mr-1" />
                    ) : (
                      <EyeOff className="h-3 w-3 mr-1" />
                    )}
                    {column}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div 
        className="flex items-center bg-gray-800/50 border-b border-white/10 px-4 py-3"
        ref={headerRef}
        role="row"
        aria-rowindex={1}
      >
        {visibleColumns.map((column, index) => (
          <div
            key={column}
            className={cn(
              "flex-1 text-sm font-semibold text-white px-2 cursor-pointer select-none relative",
              index === 0 ? "text-neon-blue" : "",
              sortConfig?.key === column ? "text-neon-blue" : ""
            )}
            onClick={() => handleSort(column)}
            style={{ width: columnWidths[column] || 150 }}
            role="columnheader"
            aria-sort={
              sortConfig?.key === column
                ? sortConfig.direction === 'asc'
                  ? 'ascending'
                  : 'descending'
                : 'none'
            }
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
            
            {/* Resize handle */}
            <div
              className="absolute right-0 top-0 h-full w-2 cursor-col-resize hover:bg-neon-blue/30"
              onMouseDown={(e) => handleResizeStart(e, index)}
              onClick={(e) => e.stopPropagation()} // Prevent sort when clicking resize handle
            />
          </div>
        ))}
      </div>

      {/* Virtualized List */}
      <List
        height={height}
        itemCount={paginatedData.length}
        itemSize={itemHeight}
        itemData={itemData}
        className="scrollbar-thin scrollbar-thumb-neon-blue/50 scrollbar-track-gray-800/20"
        width="100%"
        role="grid"
        aria-rowcount={filteredAndSortedData.length + 1} // +1 for header
        aria-colcount={visibleColumns.length}
      >
        {Row}
      </List>

      {/* Pagination */}
      <div className="flex items-center justify-between bg-gray-800/30 border-t border-white/10 px-4 py-2">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0 border-white/20"
            aria-label="First page"
          >
            <ChevronLeft className="h-4 w-4" />
            <ChevronLeft className="h-4 w-4 -ml-2" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0 border-white/20"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0 border-white/20"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0 border-white/20"
            aria-label="Last page"
          >
            <ChevronRight className="h-4 w-4" />
            <ChevronRight className="h-4 w-4 -ml-2" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">
            Showing {paginatedData.length} of {filteredAndSortedData.length} rows
          </span>
          <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue/30">
            Virtualized
          </Badge>
        </div>
      </div>

      {/* Row Detail Modal */}
      <AnimatePresence>
        {selectedRow && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRow(null)}
          >
            <motion.div
              className="bg-gray-900 border border-white/10 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-label="Row details"
            >
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Row Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRow(null)}
                  className="h-8 w-8 p-0"
                  aria-label="Close details"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 space-y-2">
                {Object.entries(selectedRow).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-3 gap-4 py-2 border-b border-white/5">
                    <div className="text-sm font-medium text-gray-300">{key}</div>
                    <div className="col-span-2 text-sm text-white break-words">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-white/10 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setSelectedRow(null)}
                  className="border-white/20"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default VirtualizedDataTable;