// Core data types
export interface Dataset {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  file_name: string;
  file_size?: number;
  columns_info?: ColumnInfo[];
  row_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ColumnInfo {
  name: string;
  type: 'number' | 'text' | 'date' | 'boolean';
  sample?: any;
}

export interface DataRecord {
  id: string;
  dataset_id: string;
  data: Record<string, any>;
  created_at: string;
}

// AI and ML types
export type MLModelType = 'linear_regression' | 'clustering' | 'anomaly_detection' | 'time_series';

export interface MLAnalysisRequest {
  datasetId: string;
  modelType: MLModelType;
  parameters?: Record<string, any>;
}

export interface MLAnalysisResult {
  title: string;
  description: string;
  confidence: number;
  metadata: MLResultMetadata;
}

export interface MLResultMetadata {
  equation?: {
    slope: number;
    intercept: number;
  };
  rSquared?: number;
  dataPoints?: number;
  variables?: { x: string; y: string };
  clusters?: Array<{
    id: number;
    range: [number, number];
    count: number;
    percentage: string;
  }>;
  anomalies?: Array<{
    column: string;
    count: number;
    percentage: string;
    examples: number[];
  }>;
  trend?: {
    direction: 'increasing' | 'decreasing' | 'stable';
    strength: number;
  };
  totalPoints?: number;
  totalAnomalies?: number;
  threshold?: number;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface AIAnalysisRequest {
  query: string;
  data?: Record<string, any>[];
  type?: 'natural_language' | 'enhanced_analysis';
  modelType?: string;
}

export interface AIAnalysisResponse {
  response: string;
  confidence?: number;
  metadata?: any;
}

// Knowledge base types
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

export interface KnowledgeSearchRequest {
  query: string;
}

export interface KnowledgeSearchResponse {
  success: boolean;
  knowledge_results: KnowledgeBaseEntry[];
  insight_results: AIInsight[];
  total_found: number;
  search_terms: string[];
}

// Learning system types
export interface LearningPattern {
  id: string;
  user_id: string;
  pattern_type: string;
  pattern_data: Record<string, any>;
  confidence_score: number;
  usage_count: number;
  last_used: string;
  created_at: string;
}

export interface FeedbackRequest {
  interactionId: string;
  feedbackType: 'positive' | 'negative' | 'neutral';
  rating: number;
  comment?: string;
  context?: Record<string, any>;
}

export interface PersonalizationRequest {
  context: Record<string, any>;
}

export interface Recommendation {
  type: string;
  title: string;
  description: string;
  confidence: number;
}

// Insights types
export interface AIInsight {
  id: string;
  user_id: string;
  dataset_id?: string;
  insight_type: string;
  title: string;
  description?: string;
  confidence_score?: number;
  metadata?: Record<string, any>;
  created_at: string;
}

// File upload types
export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  data?: Record<string, any>[];
}

// Processing pipeline types
export interface ProcessingPipeline {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  pipeline_config: Record<string, any>;
  status: 'active' | 'inactive' | 'running' | 'error';
  last_run?: string;
  created_at: string;
  updated_at: string;
}

export interface DataProcessingRequest {
  datasetId: string;
  operations: {
    clean?: boolean;
    validate?: boolean;
    transform?: boolean;
    analyze?: boolean;
  };
}

export interface DataProcessingResult {
  originalCount: number;
  processedCount: number;
  operations: Array<{
    type: string;
    [key: string]: any;
  }>;
  qualityMetrics: {
    completeness: number;
    accuracy: number;
    consistency: number;
  };
  issues: string[];
}

// Knowledge graph types
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

// Error types
export interface APIError {
  message: string;
  code?: string;
  details?: any;
}

// Chat message types
export interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  modelType?: string;
  metadata?: MLResultMetadata;
}