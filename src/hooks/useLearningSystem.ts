import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { feedbackSchema, type FeedbackData } from '@/lib/validation';
import type { LearningPattern, Recommendation } from '@/types';

// Mock learning patterns for demo mode
const DEMO_PATTERNS: LearningPattern[] = [
  {
    id: 'pattern-1',
    user_id: 'demo-user',
    pattern_type: 'preferred_models',
    pattern_data: {
      model_type: 'linear_regression',
      rating: 5,
      feedback_type: 'positive'
    },
    confidence_score: 0.9,
    usage_count: 3,
    last_used: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    created_at: new Date(Date.now() - 86400000 * 10).toISOString() // 10 days ago
  },
  {
    id: 'pattern-2',
    user_id: 'demo-user',
    pattern_type: 'query_complexity',
    pattern_data: {
      complexity_level: 'medium',
      rating: 4,
      preferred: true
    },
    confidence_score: 0.85,
    usage_count: 5,
    last_used: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    created_at: new Date(Date.now() - 86400000 * 8).toISOString() // 8 days ago
  },
  {
    id: 'pattern-3',
    user_id: 'demo-user',
    pattern_type: 'response_format',
    pattern_data: {
      format_type: 'visual',
      rating: 5,
      liked: true
    },
    confidence_score: 0.95,
    usage_count: 7,
    last_used: new Date(Date.now() - 86400000 * 0.5).toISOString(), // 12 hours ago
    created_at: new Date(Date.now() - 86400000 * 7).toISOString() // 7 days ago
  }
];

// Mock recommendations for demo mode
const DEMO_RECOMMENDATIONS: Recommendation[] = [
  {
    type: 'dataset_based',
    title: 'Analyze trends in your sales data',
    description: 'I noticed your dataset contains date fields. Would you like me to perform a time series analysis to identify trends and patterns over time?',
    confidence: 0.9
  },
  {
    type: 'model_suggestion',
    title: 'Run a linear regression analysis on your latest data',
    description: 'Based on your preferences, you might find valuable insights using linear regression analysis.',
    confidence: 0.85
  },
  {
    type: 'workflow_chain',
    title: 'Follow up on your regression analysis with predictions',
    description: 'Based on your recent regression analysis, would you like to make predictions using the model we\'ve built?',
    confidence: 0.8
  },
  {
    type: 'query_style',
    title: 'What are the main trends and patterns in my data?',
    description: 'This medium complexity query matches your preferred interaction style.',
    confidence: 0.75
  },
  {
    type: 'anomaly',
    title: 'Check for unusual patterns in your data',
    description: 'I can automatically scan your data for anomalies and outliers that might require attention.',
    confidence: 0.7
  }
];

export const useLearningSystem = () => {
  const { successToast, errorToast, infoToast } = useToast();

  const patterns = useQuery<LearningPattern[]>({
    queryKey: ['learning-patterns'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return DEMO_PATTERNS;
    },
  });

  const getPersonalizedRecommendations = useMutation<{ recommendations: Recommendation[]; personalization_score: number }, Error, { context: Record<string, any> }>({
    mutationFn: async ({ context }) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Filter recommendations based on context
      let filteredRecommendations = [...DEMO_RECOMMENDATIONS];
      
      if (context.recentActivity === 'viewing_dashboard') {
        filteredRecommendations = filteredRecommendations.filter(r => 
          r.type === 'dataset_based' || r.type === 'workflow_chain'
        );
      }
      
      if (context.query) {
        const query = context.query.toLowerCase();
        filteredRecommendations = filteredRecommendations.filter(r => 
          r.title.toLowerCase().includes(query) || 
          r.description.toLowerCase().includes(query)
        );
      }
      
      return {
        recommendations: filteredRecommendations.slice(0, 3),
        personalization_score: 0.85
      };
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
      errorToast("Recommendations Failed", "Failed to get recommendations. Please try again.");
    },
  });

  const recordInteraction = useMutation<{ success: boolean }, Error, { interactionType: string; data: Record<string, any> }>({
    mutationFn: async ({ interactionType, data }) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // In a real app, this would update the database
      console.log(`Recorded interaction: ${interactionType}`, data);
      
      return { success: true };
    },
  });

  const submitFeedback = useMutation<{ success: boolean }, Error, FeedbackData>({
    mutationFn: async (feedbackData) => {
      // Validate input data
      const validatedData = feedbackSchema.parse(feedbackData);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would update the database
      console.log('Feedback submitted:', validatedData);
      
      return { success: true };
    },
    onSuccess: () => {
      successToast(
        "Feedback Submitted",
        "Thank you for your feedback! This helps improve our AI."
      );
    },
    onError: (error) => {
      console.error('Feedback submission error:', error);
      errorToast("Feedback Submission Failed", "Failed to submit feedback. Please try again.");
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