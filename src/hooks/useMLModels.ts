import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import type { MLAnalysisRequest, MLAnalysisResult, AIInsight } from '@/types';

// Export the MLModelType for use in other components
export type MLModelType = 'linear_regression' | 'clustering' | 'anomaly_detection' | 'time_series';

// Mock insights for demo mode
const DEMO_INSIGHTS: AIInsight[] = [
  {
    id: 'insight-1',
    user_id: 'demo-user',
    dataset_id: 'demo-dataset-1',
    insight_type: 'linear_regression',
    title: 'Sales vs Marketing Spend Analysis',
    description: 'Strong positive relationship between marketing spend and sales revenue. For every $1 increase in marketing, sales increase by $2.34 on average.',
    confidence_score: 0.92,
    metadata: {
      equation: { slope: 2.34, intercept: 45000 },
      rSquared: 0.87,
      dataPoints: 124
    },
    created_at: new Date(Date.now() - 86400000 * 5).toISOString() // 5 days ago
  },
  {
    id: 'insight-2',
    user_id: 'demo-user',
    dataset_id: 'demo-dataset-1',
    insight_type: 'anomaly_detection',
    title: 'Sales Anomaly Detection',
    description: 'Identified 12 anomalies in sales data (0.96% of transactions). These outliers are primarily high-value transactions that exceed normal patterns.',
    confidence_score: 0.89,
    metadata: {
      anomalies: [
        { column: 'total_amount', count: 12, percentage: '0.96' }
      ],
      totalAnomalies: 12
    },
    created_at: new Date(Date.now() - 86400000 * 3).toISOString() // 3 days ago
  },
  {
    id: 'insight-3',
    user_id: 'demo-user',
    dataset_id: 'demo-dataset-2',
    insight_type: 'clustering',
    title: 'Customer Segmentation Analysis',
    description: 'Identified 3 distinct customer segments based on purchase behavior and demographics. The largest segment (42%) represents regular shoppers with moderate loyalty.',
    confidence_score: 0.85,
    metadata: {
      clusters: [
        { id: 0, count: 355, percentage: '42.0' },
        { id: 1, count: 287, percentage: '34.0' },
        { id: 2, count: 203, percentage: '24.0' }
      ],
      totalPoints: 845
    },
    created_at: new Date(Date.now() - 86400000 * 1).toISOString() // 1 day ago
  }
];

export const useMLModels = () => {
  const { toast } = useToast();

  // Fetch existing insights
  const { data: insights = [], isLoading: isLoadingInsights, refetch: refetchInsights } = useQuery({
    queryKey: ['ai-insights'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      return DEMO_INSIGHTS;
    },
  });

  // Run ML analysis
  const runMLAnalysis = useMutation<MLAnalysisResult, Error, MLAnalysisRequest>({
    mutationFn: async (request) => {
      console.log('Running ML analysis:', request);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate simulated ML results based on model type
      let result: MLAnalysisResult;
      
      switch (request.modelType) {
        case 'linear_regression':
          result = {
            title: 'Linear Regression Analysis',
            description: 'Found a strong positive relationship between variables. For every 1 unit increase in the independent variable, the dependent variable increases by 2.34 units on average.',
            confidence: 0.87,
            metadata: {
              equation: { slope: 2.34, intercept: 45.67 },
              rSquared: 0.87,
              dataPoints: 124,
              variables: { x: 'marketing_spend', y: 'sales' }
            }
          };
          break;
        case 'clustering':
          result = {
            title: 'K-Means Clustering (3 clusters)',
            description: 'Identified 3 distinct clusters in your data. The largest cluster contains 42% of data points, representing your primary customer segment.',
            confidence: 0.85,
            metadata: {
              clusters: [
                { id: 0, count: 355, percentage: '42.0' },
                { id: 1, count: 287, percentage: '34.0' },
                { id: 2, count: 203, percentage: '24.0' }
              ],
              totalPoints: 845
            }
          };
          break;
        case 'anomaly_detection':
          result = {
            title: 'Anomaly Detection Results',
            description: 'Found 12 anomalies (0.96% of data) across your dataset. These outliers may require further investigation.',
            confidence: 0.89,
            metadata: {
              anomalies: [
                { column: 'total_amount', count: 12, percentage: '0.96' }
              ],
              totalAnomalies: 12,
              threshold: 3
            }
          };
          break;
        case 'time_series':
          result = {
            title: 'Time Series Analysis',
            description: 'Detected an increasing trend with 15.7% growth over the analyzed period. Seasonal patterns are also present with peaks in Q4.',
            confidence: 0.82,
            metadata: {
              trend: { direction: 'increasing', strength: 15.7 },
              dataPoints: 24
            }
          };
          break;
        default:
          throw new Error(`Unsupported model type: ${request.modelType}`);
      }

      // Add new insight to demo insights
      const newInsight: AIInsight = {
        id: `insight-${Date.now()}`,
        user_id: 'demo-user',
        dataset_id: request.datasetId,
        insight_type: request.modelType,
        title: result.title,
        description: result.description,
        confidence_score: result.confidence,
        metadata: result.metadata,
        created_at: new Date().toISOString()
      };
      
      DEMO_INSIGHTS.unshift(newInsight);

      return result;
    },
    onSuccess: (result) => {
      console.log('ML analysis successful:', result);
      toast({
        title: 'Analysis Complete',
        description: `${result.title} completed successfully`,
      });
      
      // Refetch insights to include the new one
      refetchInsights();
    },
    onError: (error) => {
      console.error('ML analysis error:', error);
      
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: 'ML analysis failed. Please try again with different parameters.',
      });
    },
  });

  return {
    insights: insights as AIInsight[],
    isLoadingInsights,
    runMLAnalysis,
    isRunningAnalysis: runMLAnalysis.isPending,
    refetchInsights,
  };
};