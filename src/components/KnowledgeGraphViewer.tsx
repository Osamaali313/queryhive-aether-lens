import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Network, Clock, ZoomIn, ZoomOut, RotateCcw, Download, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { useDatasets } from '@/hooks/useDatasets';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from './LoadingSpinner';
import { ForceGraph2D } from 'react-force-graph';

interface GraphNode {
  id: string;
  name: string;
  type: string;
  val: number;
  color: string;
}

interface GraphLink {
  source: string;
  target: string;
  label: string;
  value: number;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

const KnowledgeGraphViewer: React.FC = () => {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [entityTypeFilter, setEntityTypeFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isGeneratingGraph, setIsGeneratingGraph] = useState(false);
  
  const graphRef = useRef<any>(null);
  const { datasets } = useDatasets();
  const { successToast, errorToast } = useToast();

  // Generate node colors based on entity type
  const getNodeColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'person':
        return '#00d4ff'; // neon-blue
      case 'product':
        return '#8b5cf6'; // neon-purple
      case 'organization':
        return '#10b981'; // neon-green
      case 'location':
        return '#f472b6'; // neon-pink
      case 'event':
        return '#f59e0b'; // neon-yellow
      case 'concept':
        return '#ef4444'; // neon-red
      default:
        return '#9ca3af'; // gray
    }
  };

  // Load knowledge graph data
  const loadGraphData = useCallback(async () => {
    if (!selectedDataset) return;
    
    setIsLoading(true);
    
    try {
      // Fetch nodes
      const { data: nodes, error: nodesError } = await supabase
        .from('knowledge_nodes')
        .select('*')
        .eq('dataset_id', selectedDataset);
      
      if (nodesError) throw nodesError;
      
      // Fetch edges
      const { data: edges, error: edgesError } = await supabase
        .from('knowledge_edges')
        .select('*')
        .in('source_node_id', nodes.map(n => n.id));
      
      if (edgesError) throw edgesError;
      
      // Format data for force graph
      const graphNodes: GraphNode[] = nodes.map(node => ({
        id: node.id,
        name: node.entity_name,
        type: node.entity_type,
        val: node.properties?.importance || 1,
        color: getNodeColor(node.entity_type)
      }));
      
      const graphLinks: GraphLink[] = edges.map(edge => ({
        source: edge.source_node_id,
        target: edge.target_node_id,
        label: edge.relationship_type,
        value: edge.weight || 0.5
      }));
      
      setGraphData({ nodes: graphNodes, links: graphLinks });
      
      if (graphNodes.length === 0) {
        // No graph data yet
        setIsGeneratingGraph(true);
      }
    } catch (error) {
      console.error('Error loading graph data:', error);
      errorToast(
        "Graph Loading Failed",
        "Failed to load knowledge graph data. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [selectedDataset, errorToast]);

  // Generate knowledge graph for selected dataset
  const generateKnowledgeGraph = useCallback(async () => {
    if (!selectedDataset) return;
    
    setIsGeneratingGraph(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('knowledge-graph', {
        body: { 
          datasetId: selectedDataset,
          action: 'build'
        },
      });
      
      if (error) throw error;
      
      successToast(
        "Knowledge Graph Generated",
        `Created ${data.nodes_created} nodes and ${data.edges_created} edges.`
      );
      
      // Reload graph data
      await loadGraphData();
    } catch (error) {
      console.error('Error generating knowledge graph:', error);
      errorToast(
        "Graph Generation Failed",
        "Failed to generate knowledge graph. Please try again."
      );
    } finally {
      setIsGeneratingGraph(false);
    }
  }, [selectedDataset, loadGraphData, successToast, errorToast]);

  // Load graph data when dataset changes
  useEffect(() => {
    if (selectedDataset) {
      loadGraphData();
    } else if (datasets.length > 0) {
      setSelectedDataset(datasets[0].id);
    }
  }, [selectedDataset, datasets, loadGraphData]);

  // Filter graph data based on search and filters
  const filteredGraphData = useCallback(() => {
    if (!graphData.nodes.length) return graphData;
    
    let filteredNodes = [...graphData.nodes];
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredNodes = filteredNodes.filter(node => 
        node.name.toLowerCase().includes(searchLower) || 
        node.type.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply entity type filter
    if (entityTypeFilter) {
      filteredNodes = filteredNodes.filter(node => 
        node.type.toLowerCase() === entityTypeFilter.toLowerCase()
      );
    }
    
    // Get filtered node IDs
    const filteredNodeIds = new Set(filteredNodes.map(node => node.id));
    
    // Filter links to only include connections between filtered nodes
    const filteredLinks = graphData.links.filter(link => 
      filteredNodeIds.has(link.source as string) && 
      filteredNodeIds.has(link.target as string)
    );
    
    return { nodes: filteredNodes, links: filteredLinks };
  }, [graphData, searchTerm, entityTypeFilter]);

  // Handle zoom controls
  const handleZoomIn = () => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.zoom();
      graphRef.current.zoom(currentZoom * 1.2, 400);
    }
  };

  const handleZoomOut = () => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.zoom();
      graphRef.current.zoom(currentZoom / 1.2, 400);
    }
  };

  const handleReset = () => {
    if (graphRef.current) {
      graphRef.current.centerAt();
      graphRef.current.zoom(1, 800);
    }
  };

  // Export graph as PNG
  const handleExportImage = () => {
    if (!graphRef.current) return;
    
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.download = 'knowledge-graph.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get unique entity types for filtering
  const entityTypes = Array.from(new Set(graphData.nodes.map(node => node.type)));

  // Determine if we have actual graph data or just a preview
  const hasRealGraphData = graphData.nodes.length > 0;

  return (
    <Card className="glass-effect h-[500px] flex flex-col">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Network className="w-5 h-5 text-neon-purple" />
            <h3 className="text-lg font-semibold">Knowledge Graph</h3>
          </div>
          <div className="flex items-center space-x-1">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0 border-white/20"
              onClick={handleZoomIn}
              aria-label="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0 border-white/20"
              onClick={handleZoomOut}
              aria-label="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0 border-white/20"
              onClick={handleReset}
              aria-label="Reset view"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0 border-white/20"
              onClick={handleExportImage}
              aria-label="Export as image"
              disabled={!hasRealGraphData}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className={`h-8 px-2 border-white/20 ${showFilters ? 'bg-neon-purple/20 text-neon-purple' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
              aria-label={showFilters ? "Hide filters" : "Show filters"}
            >
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Interactive relationship mapping for your data
        </p>
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
              <div className="flex-1 min-w-[200px]">
                <p className="text-xs text-muted-foreground mb-1">Dataset</p>
                <Select
                  value={selectedDataset || ''}
                  onValueChange={(value) => setSelectedDataset(value)}
                >
                  <SelectTrigger className="h-8 text-xs glass-effect border-white/20">
                    <SelectValue placeholder="Select dataset" />
                  </SelectTrigger>
                  <SelectContent>
                    {datasets.map((dataset) => (
                      <SelectItem key={dataset.id} value={dataset.id}>
                        {dataset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1 min-w-[200px]">
                <p className="text-xs text-muted-foreground mb-1">Entity Type</p>
                <Select
                  value={entityTypeFilter || ''}
                  onValueChange={(value) => setEntityTypeFilter(value || null)}
                >
                  <SelectTrigger className="h-8 text-xs glass-effect border-white/20">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All types</SelectItem>
                    {entityTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1 min-w-[200px]">
                <p className="text-xs text-muted-foreground mb-1">Search</p>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search entities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-8 text-xs glass-effect border-white/20"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 relative overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner size="lg" message="Loading knowledge graph..." />
          </div>
        ) : graphData.nodes.length > 0 ? (
          <ForceGraph2D
            ref={graphRef}
            graphData={filteredGraphData()}
            nodeLabel="name"
            nodeColor="color"
            nodeVal="val"
            linkLabel="label"
            linkWidth="value"
            backgroundColor="rgba(0,0,0,0)"
            linkDirectionalArrowLength={3}
            linkDirectionalArrowRelPos={1}
            linkDirectionalParticles={2}
            linkDirectionalParticleWidth={1}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const { x, y, name, color, val } = node as any;
              const fontSize = 12 / globalScale;
              const nodeSize = Math.sqrt(val) * 5;
              
              // Draw node
              ctx.beginPath();
              ctx.arc(x, y, nodeSize, 0, 2 * Math.PI);
              ctx.fillStyle = `${color}40`; // 25% opacity
              ctx.fill();
              ctx.strokeStyle = color;
              ctx.lineWidth = 1.5;
              ctx.stroke();
              
              // Draw label if zoomed in enough
              if (globalScale > 0.8) {
                ctx.font = `${fontSize}px Sans-Serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = 'white';
                ctx.fillText(name, x, y + nodeSize + fontSize);
              }
            }}
            cooldownTicks={100}
            onEngineStop={() => console.log('Graph layout stabilized')}
          />
        ) : isGeneratingGraph ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <LoadingSpinner size="lg" message="Generating knowledge graph..." />
            <p className="text-sm text-muted-foreground mt-4">
              This may take a moment as we analyze your data and build relationships
            </p>
          </div>
        ) : selectedDataset ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Network className="w-16 h-16 text-neon-purple mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Knowledge Graph Yet</h3>
            <p className="text-muted-foreground max-w-md text-center mb-6">
              Generate a knowledge graph to discover relationships in your data
            </p>
            <Button 
              onClick={generateKnowledgeGraph}
              className="cyber-button"
              disabled={isGeneratingGraph}
            >
              {isGeneratingGraph ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>Generate Knowledge Graph</>
              )}
            </Button>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Network className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Dataset Selected</h3>
            <p className="text-muted-foreground max-w-md text-center mb-4">
              Please select a dataset to view or generate a knowledge graph
            </p>
            {datasets.length === 0 && (
              <p className="text-sm text-gray-500">
                Upload data first to use this feature
              </p>
            )}
          </div>
        )}
        
        {hasRealGraphData && (
          <motion.div
            className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-300 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">Entity Types</span>
              <Badge className="bg-neon-purple/20 text-neon-purple border-neon-purple/30">
                {graphData.nodes.length} Entities
              </Badge>
            </div>
            {entityTypes.map((type) => {
              const count = graphData.nodes.filter(node => node.type === type).length;
              return (
                <div key={type} className="flex items-center space-x-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getNodeColor(type) }}></div>
                  <span>{type.charAt(0).toUpperCase() + type.slice(1)} ({count})</span>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>

      {!hasRealGraphData && (
        <div className="p-3 border-t border-white/10 bg-gray-900/50">
          <div className="flex items-center justify-center text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse"></div>
              <span>Select a dataset and generate a knowledge graph to explore relationships</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default KnowledgeGraphViewer;