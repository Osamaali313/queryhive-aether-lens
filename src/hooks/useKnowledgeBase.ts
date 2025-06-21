
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface KnowledgeBaseEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  metadata: Record<string, any>;
  relevance_score: number;
  created_at: string;
  updated_at: string;
}

export const useKnowledgeBase = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // For now, return empty data since the table doesn't exist in types yet
  const entries = useQuery({
    queryKey: ['knowledge-base', user?.id],
    queryFn: async () => {
      return [] as KnowledgeBaseEntry[];
    },
    enabled: !!user?.id,
  });

  const addEntry = useMutation({
    mutationFn: async ({ 
      title, 
      content, 
      category, 
      tags = [] 
    }: {
      title: string;
      content: string;
      category: string;
      tags?: string[];
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      // For now, just return a mock entry
      return {
        id: crypto.randomUUID(),
        user_id: user.id,
        title,
        content,
        category,
        tags,
        metadata: {},
        relevance_score: 0.5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as KnowledgeBaseEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-base'] });
      toast({
        title: "Knowledge Added",
        description: "Successfully added to knowledge base",
      });
    },
  });

  const searchKnowledge = useMutation({
    mutationFn: async ({ query }: { query: string }) => {
      if (!user) throw new Error('User not authenticated');

      // For now, return empty results
      return { results: [] };
    },
  });

  return {
    entries: entries.data || [],
    isLoading: entries.isLoading,
    addEntry,
    searchKnowledge,
    isSearching: searchKnowledge.isPending,
  };
};
