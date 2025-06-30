import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { knowledgeEntrySchema, type KnowledgeEntryData } from '@/lib/validation';
import type { KnowledgeBaseEntry, KnowledgeSearchResponse } from '@/types';

// Mock knowledge base entries for demo mode
const DEMO_KNOWLEDGE_ENTRIES: KnowledgeBaseEntry[] = [
  {
    id: 'entry-1',
    user_id: 'demo-user',
    title: 'Sales Performance Analysis',
    content: 'Analysis of Q1 2024 sales performance shows a 15% increase compared to Q4 2023. Key drivers include new product launches and expanded market reach.',
    category: 'sales',
    tags: ['sales', 'performance', 'quarterly'],
    metadata: { confidence: 0.92, source: 'ai_analysis' },
    relevance_score: 0.95,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
    updated_at: new Date(Date.now() - 86400000 * 10).toISOString() // 10 days ago
  },
  {
    id: 'entry-2',
    user_id: 'demo-user',
    title: 'Customer Segmentation Insights',
    content: 'Customer segmentation analysis reveals three distinct groups: high-value loyalists (18%), regular shoppers (64%), and occasional buyers (18%). Each segment requires tailored marketing approaches.',
    category: 'customers',
    tags: ['segmentation', 'marketing', 'analysis'],
    metadata: { confidence: 0.88, source: 'ml_model' },
    relevance_score: 0.9,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString() // 5 days ago
  },
  {
    id: 'entry-3',
    user_id: 'demo-user',
    title: 'Product Performance Metrics',
    content: 'Top performing products by revenue: 1) Laptop Pro (32%), 2) Wireless Headphones (18%), 3) Smart Watch (12%). Consider inventory adjustments to meet demand.',
    category: 'products',
    tags: ['products', 'performance', 'inventory'],
    metadata: { confidence: 0.94, source: 'data_analysis' },
    relevance_score: 0.92,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
  }
];

export const useKnowledgeBase = () => {
  const { successToast, errorToast, infoToast } = useToast();
  const queryClient = useQueryClient();
  
  const entries = useQuery<KnowledgeBaseEntry[]>({
    queryKey: ['knowledge-base'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return DEMO_KNOWLEDGE_ENTRIES;
    },
  });

  const addEntry = useMutation<KnowledgeBaseEntry, Error, KnowledgeEntryData>({
    mutationFn: async (entryData) => {
      // Validate input data
      const validatedData = knowledgeEntrySchema.parse(entryData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create new entry
      const newEntry: KnowledgeBaseEntry = {
        id: `entry-${Date.now()}`,
        user_id: 'demo-user',
        title: validatedData.title,
        content: validatedData.content,
        category: validatedData.category || 'general',
        tags: validatedData.tags || [],
        metadata: validatedData.metadata || {},
        relevance_score: 0.9,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Add to mock data
      DEMO_KNOWLEDGE_ENTRIES.unshift(newEntry);
      
      return newEntry;
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
      errorToast("Knowledge Entry Failed", "Failed to add knowledge entry. Please try again.");
    },
  });

  const searchKnowledge = useMutation<KnowledgeSearchResponse, Error, { query: string }>({
    mutationFn: async ({ query }) => {
      if (!query.trim()) throw new Error('Search query cannot be empty');

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Simple search implementation
      const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
      
      const results = DEMO_KNOWLEDGE_ENTRIES.filter(entry => {
        const entryText = `${entry.title} ${entry.content} ${entry.tags.join(' ')}`.toLowerCase();
        return searchTerms.some(term => entryText.includes(term));
      });
      
      return {
        success: true,
        knowledge_results: results,
        insight_results: [],
        total_found: results.length,
        search_terms: searchTerms
      };
    },
    onSuccess: (data) => {
      if (data.knowledge_results.length === 0) {
        infoToast(
          "No Results Found",
          "Your search didn't match any knowledge entries. Try different keywords."
        );
      }
    },
    onError: (error) => {
      console.error('Knowledge search error:', error);
      errorToast("Search Failed", "Failed to search knowledge base. Please try again.");
    },
  });

  const deleteEntry = useMutation<void, Error, string>({
    mutationFn: async (entryId) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove from mock data
      const index = DEMO_KNOWLEDGE_ENTRIES.findIndex(entry => entry.id === entryId);
      if (index !== -1) {
        DEMO_KNOWLEDGE_ENTRIES.splice(index, 1);
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
      errorToast("Deletion Failed", "Failed to delete entry. Please try again.");
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