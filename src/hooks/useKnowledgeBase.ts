import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { knowledgeEntrySchema, type KnowledgeEntryData } from '@/lib/validation';
import type { KnowledgeBaseEntry, KnowledgeSearchResponse } from '@/types';

export const useKnowledgeBase = () => {
  const { user } = useAuth();
  const { successToast, errorToast, infoToast } = useToast();
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

      if (error) {
        console.error('Error fetching knowledge base entries:', error);
        throw new Error(error.message);
      }
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
          metadata: validatedData.metadata || {},
          relevance_score: 0.5,
        })
        .select()
        .single();

      if (error) {
        console.error('Knowledge entry error:', error);
        throw new Error(error.message);
      }
      return data as KnowledgeBaseEntry;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-base'] });
      successToast(
        "Knowledge Added",
        `"${data.title}" has been added to your knowledge base.`
      );
    },
    onError: (error) => {
      console.error('Knowledge entry error:', error);
      
      let errorMessage = 'Failed to add knowledge entry. Please try again.';
      let errorTitle = "Knowledge Entry Failed";
      
      if (error.message.includes('duplicate')) {
        errorMessage = 'An entry with this title already exists.';
        errorTitle = "Duplicate Entry";
      } else if (error.message.includes('validation')) {
        errorMessage = 'Invalid entry data. Please check your input.';
        errorTitle = "Validation Error";
      } else if (error.message.includes('permission')) {
        errorMessage = 'You do not have permission to add knowledge entries.';
        errorTitle = "Permission Denied";
      } else if (error.message.includes('too long')) {
        errorMessage = 'Content is too long. Please shorten your entry.';
        errorTitle = "Content Too Long";
      } else if (error.message.includes('not authenticated')) {
        errorMessage = 'You need to be signed in to use this feature.';
        errorTitle = "Authentication Required";
      }

      errorToast(errorTitle, errorMessage);
    },
  });

  const searchKnowledge = useMutation<KnowledgeSearchResponse, Error, { query: string }>({
    mutationFn: async ({ query }) => {
      if (!user) throw new Error('User not authenticated');
      if (!query.trim()) throw new Error('Search query cannot be empty');

      const { data: result, error } = await supabase.functions.invoke('knowledge-search', {
        body: { query: query.trim() },
      });

      if (error) {
        console.error('Knowledge search error:', error);
        throw new Error(error.message);
      }
      if (!result) throw new Error('No search results');
      
      return result as KnowledgeSearchResponse;
    },
    onSuccess: (data) => {
      if (data.knowledge_results.length === 0 && data.insight_results.length === 0) {
        infoToast(
          "No Results Found",
          "Your search didn't match any knowledge entries. Try different keywords."
        );
      }
    },
    onError: (error) => {
      console.error('Knowledge search error:', error);
      
      let errorMessage = 'Search failed. Please try again.';
      let errorTitle = "Search Failed";
      
      if (error.message.includes('empty')) {
        errorMessage = 'Please enter a search query.';
        errorTitle = "Empty Query";
      } else if (error.message.includes('too short')) {
        errorMessage = 'Search query is too short. Please enter at least 3 characters.';
        errorTitle = "Query Too Short";
      } else if (error.message.includes('permission')) {
        errorMessage = 'You do not have permission to search the knowledge base.';
        errorTitle = "Permission Denied";
      } else if (error.message.includes('not authenticated')) {
        errorMessage = 'You need to be signed in to use this feature.';
        errorTitle = "Authentication Required";
      }

      errorToast(errorTitle, errorMessage);
    },
  });

  const deleteEntry = useMutation<void, Error, string>({
    mutationFn: async (entryId) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('knowledge_base')
        .delete()
        .eq('id', entryId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting knowledge entry:', error);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-base'] });
      successToast(
        "Entry Deleted",
        "The knowledge entry has been removed."
      );
    },
    onError: (error) => {
      console.error('Knowledge entry deletion error:', error);
      
      let errorMessage = 'Failed to delete entry. Please try again.';
      let errorTitle = "Deletion Failed";
      
      if (error.message.includes('permission')) {
        errorMessage = 'You do not have permission to delete this entry.';
        errorTitle = "Permission Denied";
      } else if (error.message.includes('not found')) {
        errorMessage = 'Entry not found. It may have been already deleted.';
        errorTitle = "Entry Not Found";
      }

      errorToast(errorTitle, errorMessage);
    },
  });

  return {
    entries: entries.data || [],
    isLoading: entries.isLoading,
    error: entries.error,
    addEntry,
    searchKnowledge,
    deleteEntry,
    isSearching: searchKnowledge.isPending,
  };
};