import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Network, Clock, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const KnowledgeGraphViewer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create mock nodes and edges for visualization
    const nodes = [
      { id: 1, label: 'Customer', x: canvas.width * 0.5, y: canvas.height * 0.3, color: '#00d4ff', radius: 20 },
      { id: 2, label: 'Product', x: canvas.width * 0.3, y: canvas.height * 0.5, color: '#8b5cf6', radius: 18 },
      { id: 3, label: 'Order', x: canvas.width * 0.7, y: canvas.height * 0.5, color: '#10b981', radius: 18 },
      { id: 4, label: 'Category', x: canvas.width * 0.2, y: canvas.height * 0.7, color: '#f472b6', radius: 15 },
      { id: 5, label: 'Payment', x: canvas.width * 0.8, y: canvas.height * 0.7, color: '#f59e0b', radius: 15 },
      { id: 6, label: 'Shipping', x: canvas.width * 0.6, y: canvas.height * 0.8, color: '#ef4444', radius: 15 },
    ];

    const edges = [
      { from: 1, to: 2, label: 'buys', width: 2 },
      { from: 1, to: 3, label: 'places', width: 3 },
      { from: 2, to: 4, label: 'belongs to', width: 1.5 },
      { from: 3, to: 5, label: 'has', width: 2 },
      { from: 3, to: 6, label: 'includes', width: 2 },
      { from: 2, to: 3, label: 'in', width: 2.5 },
    ];

    // Animation variables
    let angle = 0;
    let animationFrameId: number;

    // Draw function
    const draw = () => {
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update node positions if animating
      if (isAnimating) {
        angle += 0.002;
        nodes.forEach((node, i) => {
          const offset = i * (Math.PI * 2 / nodes.length);
          const radius = 20 * Math.sin(angle + offset) + 100;
          node.x = canvas.width / 2 + Math.cos(angle + offset) * radius * zoom;
          node.y = canvas.height / 2 + Math.sin(angle + offset) * radius * zoom;
        });
      }
      
      // Draw edges
      edges.forEach(edge => {
        const fromNode = nodes.find(n => n.id === edge.from);
        const toNode = nodes.find(n => n.id === edge.to);
        
        if (fromNode && toNode) {
          // Draw edge
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.lineWidth = edge.width;
          ctx.stroke();
          
          // Draw edge label
          const midX = (fromNode.x + toNode.x) / 2;
          const midY = (fromNode.y + toNode.y) / 2;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(edge.label, midX, midY - 5);
        }
      });
      
      // Draw nodes
      nodes.forEach(node => {
        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * zoom, 0, Math.PI * 2);
        ctx.fillStyle = `${node.color}40`; // 25% opacity
        ctx.fill();
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Node label
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + node.radius * zoom + 15);
      });
      
      // Request next frame
      animationFrameId = requestAnimationFrame(draw);
    };
    
    // Start animation
    draw();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [zoom, isAnimating]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
  };

  const toggleAnimation = () => {
    setIsAnimating(prev => !prev);
  };

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
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0 border-white/20"
              onClick={handleZoomOut}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0 border-white/20"
              onClick={handleReset}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className={`h-8 px-2 border-white/20 ${isAnimating ? 'bg-neon-purple/20 text-neon-purple' : ''}`}
              onClick={toggleAnimation}
            >
              {isAnimating ? 'Pause' : 'Animate'}
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Interactive relationship mapping for your data
        </p>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 cursor-move"
        />
        
        <motion.div
          className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-300 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-neon-blue"></div>
            <span>Customers (12)</span>
          </div>
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-neon-purple"></div>
            <span>Products (24)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-neon-green"></div>
            <span>Orders (36)</span>
          </div>
        </motion.div>
      </div>

      <div className="p-3 border-t border-white/10 bg-gray-900/50">
        <div className="flex items-center justify-center text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse"></div>
            <span>Interactive Preview - Full Version Coming Soon</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default KnowledgeGraphViewer;