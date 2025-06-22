
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

  const entries = useQuery({
    queryKey: ['knowledge-base', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as KnowledgeBaseEntry[];
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
      
      const { data, error } = await supabase
        .from('knowledge_base')
        .insert({
          user_id: user.id,
          title,
          content,
          category,
          tags,
          metadata: {},
          relevance_score: 0.5,
        })
        .select()
        .single();

      if (error) throw error;
      return data as KnowledgeBaseEntry;
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

      const { data: result, error } = await supabase.functions.invoke('knowledge-search', {
        body: { query },
      });

      if (error) throw error;
      return result;
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
