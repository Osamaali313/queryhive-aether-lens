
import React from 'react';
import { Card } from '@/components/ui/card';
import { Network, Clock } from 'lucide-react';

const KnowledgeGraphViewer: React.FC = () => {
  return (
    <Card className="glass-effect h-[500px] flex flex-col">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Network className="w-5 h-5 text-neon-purple" />
            <h3 className="text-lg font-semibold">Knowledge Graph</h3>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Advanced relationship mapping for your data
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-16 h-16 text-neon-purple mx-auto mb-4 animate-pulse" />
          <h3 className="text-xl font-semibold text-neon-purple mb-2">Coming Soon</h3>
          <p className="text-gray-400 max-w-sm">
            Knowledge Graph visualization and relationship discovery features are currently in development.
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            Expected release: Q4 2025
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-white/10 bg-gray-900/50">
        <div className="flex items-center justify-center text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse"></div>
            <span>Feature in Development</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default KnowledgeGraphViewer;
