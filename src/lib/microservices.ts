import { supabase } from '@/integrations/supabase/client';

// Microservice endpoints
const SERVICES = {
  AI_ANALYTICS: '/api/ai-analytics',
  ML_MODELS: '/api/ml-models',
  DATA_PROCESSING: '/api/data-processing',
  KNOWLEDGE_GRAPH: '/api/knowledge-graph',
  KNOWLEDGE_SEARCH: '/api/knowledge-search',
  LEARNING_ENGINE: '/api/learning-engine',
  PIPELINE_ORCHESTRATOR: '/api/pipeline-orchestrator'
};

// Base URL for microservices
const BASE_URL = import.meta.env.VITE_MICROSERVICES_URL || '';

// Generic request function with authentication
async function request<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<T> {
  // Get current session
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('Authentication required');
  }
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`
  };
  
  const options: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  };
  
  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }
  
  return response.json();
}

// AI Analytics Service
export const aiAnalyticsService = {
  query: (data: { query: string; data?: any[]; type?: string; modelType?: string }) => 
    request<{ response: string; confidence?: number }>(SERVICES.AI_ANALYTICS, 'POST', data)
};

// ML Models Service
export const mlModelsService = {
  runModel: (data: { datasetId: string; modelType: string; parameters?: Record<string, any> }) => 
    request<{ title: string; description: string; confidence: number; metadata: any }>(
      SERVICES.ML_MODELS, 
      'POST', 
      data
    )
};

// Data Processing Service
export const dataProcessingService = {
  processData: (data: { datasetId: string; operations: Record<string, boolean> }) => 
    request<{ success: boolean; results: any }>(SERVICES.DATA_PROCESSING, 'POST', data)
};

// Knowledge Graph Service
export const knowledgeGraphService = {
  buildGraph: (datasetId: string) => 
    request<{ success: boolean; nodes_created: number; edges_created: number }>(
      SERVICES.KNOWLEDGE_GRAPH, 
      'POST', 
      { datasetId, action: 'build' }
    ),
  
  getGraph: (datasetId: string) => 
    request<{ nodes: any[]; edges: any[] }>(
      SERVICES.KNOWLEDGE_GRAPH, 
      'GET'
    )
};

// Knowledge Search Service
export const knowledgeSearchService = {
  search: (query: string) => 
    request<{ success: boolean; knowledge_results: any[]; insight_results: any[] }>(
      SERVICES.KNOWLEDGE_SEARCH, 
      'POST', 
      { query }
    )
};

// Learning Engine Service
export const learningEngineService = {
  processFeedback: (data: { feedback_type: string; rating: number; comment?: string; context?: any }) => 
    request<{ success: boolean }>(
      SERVICES.LEARNING_ENGINE, 
      'POST', 
      { action: 'process_feedback', feedback: data }
    ),
  
  getRecommendations: (context: any) => 
    request<{ success: boolean; recommendations: any[] }>(
      SERVICES.LEARNING_ENGINE, 
      'POST', 
      { action: 'get_recommendations', context }
    )
};

// Pipeline Orchestrator Service
export const pipelineOrchestratorService = {
  runPipeline: (pipelineId: string, datasetId: string) => 
    request<{ success: boolean; results: any }>(
      SERVICES.PIPELINE_ORCHESTRATOR, 
      'POST', 
      { pipelineId, datasetId, action: 'run' }
    )
};

// Service health check
export const checkServicesHealth = async (): Promise<Record<string, boolean>> => {
  const services = Object.values(SERVICES);
  const results: Record<string, boolean> = {};
  
  await Promise.all(
    services.map(async (service) => {
      try {
        const response = await fetch(`${BASE_URL}${service}/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        results[service] = response.ok;
      } catch (error) {
        results[service] = false;
      }
    })
  );
  
  return results;
};