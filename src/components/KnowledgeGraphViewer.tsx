
import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Network, Share2, Brain } from 'lucide-react';
import { useKnowledgeGraph } from '@/hooks/useKnowledgeGraph';
import { useDatasets } from '@/hooks/useDatasets';

const KnowledgeGraphViewer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { nodes, edges, buildKnowledgeGraph, isBuildingGraph } = useKnowledgeGraph();
  const { datasets } = useDatasets();

  useEffect(() => {
    if (!canvasRef.current || nodes.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    // Simple force-directed layout simulation
    const nodePositions = new Map();
    const nodeRadius = 20;
    const centerX = canvas.offsetWidth / 2;
    const centerY = canvas.offsetHeight / 2;

    // Initialize node positions
    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * 2 * Math.PI;
      const radius = Math.min(centerX, centerY) * 0.6;
      nodePositions.set(node.id, {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      });
    });

    // Draw edges
    edges.forEach(edge => {
      const sourcePos = nodePositions.get(edge.source_node_id);
      const targetPos = nodePositions.get(edge.target_node_id);
      
      if (sourcePos && targetPos) {
        ctx.beginPath();
        ctx.moveTo(sourcePos.x, sourcePos.y);
        ctx.lineTo(targetPos.x, targetPos.y);
        ctx.strokeStyle = `rgba(0, 245, 255, ${edge.weight * 0.5})`;
        ctx.lineWidth = Math.max(1, edge.weight * 2);
        ctx.stroke();

        // Draw relationship label
        const midX = (sourcePos.x + targetPos.x) / 2;
        const midY = (sourcePos.y + targetPos.y) / 2;
        ctx.fillStyle = '#8b5cf6';
        ctx.font = '10px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(edge.relationship_type, midX, midY);
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      const pos = nodePositions.get(node.id);
      if (!pos) return;

      // Node circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, nodeRadius, 0, 2 * Math.PI);
      ctx.fillStyle = getNodeColor(node.entity_type);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Node label
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(
        node.entity_name.length > 10 
          ? node.entity_name.substring(0, 10) + '...' 
          : node.entity_name,
        pos.x,
        pos.y + nodeRadius + 15
      );
    });

  }, [nodes, edges]);

  const getNodeColor = (entityType: string): string => {
    const colors: Record<string, string> = {
      'person': '#10b981',
      'organization': '#8b5cf6',
      'location': '#f59e0b',
      'concept': '#00f5ff',
      'event': '#ef4444',
      'default': '#6b7280'
    };
    return colors[entityType] || colors.default;
  };

  const handleBuildGraph = () => {
    if (datasets.length > 0) {
      buildKnowledgeGraph.mutate({ datasetId: datasets[0].id });
    }
  };

  return (
    <Card className="glass-effect h-[500px] flex flex-col">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Network className="w-5 h-5 text-neon-purple" />
            <h3 className="text-lg font-semibold">Knowledge Graph</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleBuildGraph}
              disabled={isBuildingGraph || datasets.length === 0}
              size="sm"
              className="cyber-button"
            >
              <Brain className="w-4 h-4 mr-1" />
              {isBuildingGraph ? 'Building...' : 'Build Graph'}
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {nodes.length} entities • {edges.length} relationships
        </p>
      </div>

      <div className="flex-1 relative">
        {nodes.length > 0 ? (
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Network className="w-12 h-12 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400">No knowledge graph built yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Upload data and click "Build Graph" to get started
              </p>
            </div>
          </div>
        )}
      </div>

      {nodes.length > 0 && (
        <div className="p-3 border-t border-white/10 bg-gray-900/50">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Entities</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-1 bg-neon-blue"></div>
                <span>Relationships</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">
              <Share2 className="w-3 h-3 mr-1" />
              Export
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default KnowledgeGraphViewer;
