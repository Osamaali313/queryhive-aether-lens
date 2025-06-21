
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface KnowledgeNode {
  id: string;
  user_id: string;
  dataset_id?: string;
  entity_type: string;
  entity_name: string;
  properties: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeEdge {
  id: string;
  user_id: string;
  source_node_id: string;
  target_node_id: string;
  relationship_type: string;
  weight: number;
  properties: Record<string, any>;
  created_at: string;
}

export const useKnowledgeGraph = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const nodes = useQuery({
    queryKey: ['knowledge-nodes', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('knowledge_nodes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as KnowledgeNode[];
    },
    enabled: !!user?.id,
  });

  const edges = useQuery({
    queryKey: ['knowledge-edges', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('knowledge_edges')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as KnowledgeEdge[];
    },
    enabled: !!user?.id,
  });

  const buildKnowledgeGraph = useMutation({
    mutationFn: async ({ datasetId }: { datasetId: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data: result, error } = await supabase.functions.invoke('knowledge-graph', {
        body: { datasetId, action: 'build' },
      });

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-nodes'] });
      queryClient.invalidateQueries({ queryKey: ['knowledge-edges'] });
      toast({
        title: "Knowledge Graph Built",
        description: "Successfully created knowledge graph from your data",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Build Knowledge Graph",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    nodes: nodes.data || [],
    edges: edges.data || [],
    isLoadingNodes: nodes.isLoading,
    isLoadingEdges: edges.isLoading,
    buildKnowledgeGraph,
    isBuildingGraph: buildKnowledgeGraph.isPending,
  };
};
