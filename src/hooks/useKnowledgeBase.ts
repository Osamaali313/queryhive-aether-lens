import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { knowledgeEntrySchema, type KnowledgeEntryData } from '@/lib/validation';
import type { KnowledgeBaseEntry, KnowledgeSearchResponse } from '@/types';

export const useKnowledgeBase = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const entries = useQuery<KnowledgeBaseEntry[]>({
    queryKey: ['knowledge-base', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data as KnowledgeBaseEntry[];
    },
    enabled: !!user?.id,
  });

  const addEntry = useMutation<KnowledgeBaseEntry, Error, KnowledgeEntryData>({
    mutationFn: async (entryData) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      // Validate input data
      const validatedData = knowledgeEntrySchema.parse(entryData);
      
      const { data, error } = await supabase
        .from('knowledge_base')
        .insert({
          user_id: user.id,
          ...validatedData,
          metadata: {},
          relevance_score: 0.5,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as KnowledgeBaseEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-base'] });
      toast({
        title: "Knowledge Added",
        description: "Successfully added to knowledge base",
      });
    },
    onError: (error) => {
      console.error('Knowledge entry error:', error);
      
      let errorMessage = 'Failed to add knowledge entry. Please try again.';
      
      if (error.message.includes('duplicate')) {
        errorMessage = 'An entry with this title already exists.';
      } else if (error.message.includes('validation')) {
        errorMessage = 'Invalid entry data. Please check your input.';
      } else if (error.message.includes('permission')) {
        errorMessage = 'You do not have permission to add knowledge entries.';
      } else if (error.message.includes('too long')) {
        errorMessage = 'Content is too long. Please shorten your entry.';
      }

      toast({
        title: "Failed to add knowledge",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const searchKnowledge = useMutation<KnowledgeSearchResponse, Error, { query: string }>({
    mutationFn: async ({ query }) => {
      if (!user) throw new Error('User not authenticated');
      if (!query.trim()) throw new Error('Search query cannot be empty');

      const { data: result, error } = await supabase.functions.invoke('knowledge-search', {
        body: { query: query.trim() },
      });

      if (error) throw new Error(error.message);
      if (!result) throw new Error('No search results');
      
      return result as KnowledgeSearchResponse;
    },
    onError: (error) => {
      console.error('Knowledge search error:', error);
      
      let errorMessage = 'Search failed. Please try again.';
      
      if (error.message.includes('empty')) {
        errorMessage = 'Please enter a search query.';
      } else if (error.message.includes('too short')) {
        errorMessage = 'Search query is too short. Please enter at least 3 characters.';
      } else if (error.message.includes('permission')) {
        errorMessage = 'You do not have permission to search the knowledge base.';
      }

      toast({
        title: "Search Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  return {
    entries: entries.data || [],
    isLoading: entries.isLoading,
    error: entries.error,
    addEntry,
    searchKnowledge,
    isSearching: searchKnowledge.isPending,
  };
};