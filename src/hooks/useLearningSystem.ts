import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { feedbackSchema, type FeedbackData } from '@/lib/validation';
import type { LearningPattern, Recommendation } from '@/types';

export const useLearningSystem = () => {
  const { user } = useAuth();
  const { successToast, errorToast, infoToast } = useToast();
  const queryClient = useQueryClient();

  const patterns = useQuery<LearningPattern[]>({
    queryKey: ['learning-patterns', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('learning_patterns')
        .select('*')
        .eq('user_id', user.id)
        .order('confidence_score', { ascending: false });

      if (error) {
        console.error('Error fetching learning patterns:', error);
        throw new Error(error.message);
      }
      return data as LearningPattern[];
    },
    enabled: !!user?.id,
  });

  const getPersonalizedRecommendations = useMutation<{ recommendations: Recommendation[]; personalization_score: number }, Error, { context: Record<string, any> }>({
    mutationFn: async ({ context }) => {
      if (!user) throw new Error('User not authenticated');

      const { data: result, error } = await supabase.functions.invoke('learning-engine', {
        body: { 
          action: 'get_recommendations',
          context
        },
      });

      if (error) {
        console.error('Recommendations error:', error);
        throw new Error(error.message);
      }
      if (!result) throw new Error('No recommendations available');
      
      return result;
    },
    onSuccess: (data) => {
      if (data.recommendations.length === 0) {
        infoToast(
          "No Personalized Recommendations",
          "Continue using the system to generate personalized recommendations."
        );
      }
    },
    onError: (error) => {
      console.error('Recommendations error:', error);
      
      let errorMessage = 'Failed to get recommendations. Please try again.';
      let errorTitle = "Recommendations Failed";
      
      if (error.message.includes('insufficient data')) {
        errorMessage = 'Not enough interaction data for personalized recommendations yet.';
        errorTitle = "Insufficient Data";
      } else if (error.message.includes('permission')) {
        errorMessage = 'You do not have permission to access recommendations.';
        errorTitle = "Permission Denied";
      } else if (error.message.includes('not authenticated')) {
        errorMessage = 'You need to be signed in to use this feature.';
        errorTitle = "Authentication Required";
      }

      errorToast(errorTitle, errorMessage);
    },
  });

  const recordInteraction = useMutation<{ success: boolean }, Error, { interactionType: string; data: Record<string, any> }>({
    mutationFn: async ({ interactionType, data }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('learning_patterns')
        .upsert({
          user_id: user.id,
          pattern_type: interactionType,
          pattern_data: data,
          confidence_score: 0.5,
          usage_count: 1,
        }, {
          onConflict: 'user_id,pattern_type',
          ignoreDuplicates: false
        });

      if (error) {
        console.error('Interaction recording error:', error);
        throw new Error(error.message);
      }
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning-patterns'] });
    },
    onError: (error) => {
      console.error('Interaction recording error:', error);
      // Don't show toast for interaction recording failures as they're background operations
    },
  });

  const submitFeedback = useMutation<{ success: boolean }, Error, FeedbackData>({
    mutationFn: async (feedbackData) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Validate input data
      const validatedData = feedbackSchema.parse(feedbackData);

      const { error } = await supabase
        .from('user_feedback')
        .insert({
          user_id: user.id,
          feedback_type: validatedData.feedbackType || 'neutral',
          rating: validatedData.rating,
          comment: validatedData.comment,
          interaction_id: validatedData.interactionId,
          context: validatedData.context || {},
        });

      if (error) {
        console.error('Feedback submission error:', error);
        throw new Error(error.message);
      }

      // Process feedback through learning engine
      const { error: learningError } = await supabase.functions.invoke('learning-engine', {
        body: { 
          action: 'process_feedback',
          feedback: validatedData
        },
      });

      if (learningError) {
        console.warn('Learning engine error:', learningError);
      }
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning-patterns'] });
      successToast(
        "Feedback Submitted",
        "Thank you for your feedback! This helps improve our AI."
      );
    },
    onError: (error) => {
      console.error('Feedback submission error:', error);
      
      let errorMessage = 'Failed to submit feedback. Please try again.';
      let errorTitle = "Feedback Submission Failed";
      
      if (error.message.includes('validation')) {
        errorMessage = 'Invalid feedback data. Please check your input.';
        errorTitle = "Validation Error";
      } else if (error.message.includes('permission')) {
        errorMessage = 'You do not have permission to submit feedback.';
        errorTitle = "Permission Denied";
      } else if (error.message.includes('duplicate')) {
        errorMessage = 'You have already provided feedback for this interaction.';
        errorTitle = "Duplicate Feedback";
      } else if (error.message.includes('not authenticated')) {
        errorMessage = 'You need to be signed in to use this feature.';
        errorTitle = "Authentication Required";
      }

      errorToast(errorTitle, errorMessage);
    },
  });

  return {
    patterns: patterns.data || [],
    isLoading: patterns.isLoading,
    error: patterns.error,
    getPersonalizedRecommendations,
    recordInteraction,
    submitFeedback,
    isGettingRecommendations: getPersonalizedRecommendations.isPending,
    isProcessing: submitFeedback.isPending,
  };
};
