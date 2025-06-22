# QueryHive AI - API Documentation

## Overview

QueryHive AI uses Supabase Edge Functions for serverless AI processing and data operations. All functions are deployed to Supabase and accessible via the Supabase client.

## Authentication

All API calls require authentication via Supabase Auth. Include the user's JWT token in the Authorization header:

```typescript
const { data, error } = await supabase.functions.invoke('function-name', {
  body: { /* request data */ },
  headers: {
    Authorization: `Bearer ${session.access_token}`
  }
});
```

## Edge Functions

### 1. AI Analytics (`ai-analytics`)

Processes natural language queries and generates intelligent responses.

**Endpoint:** `POST /functions/v1/ai-analytics`

**Request Body:**
```typescript
{
  query: string;           // User's natural language query
  data?: any[];           // Optional data context
  type?: string;          // Query type: 'natural_language' | 'enhanced_analysis'
  modelType?: string;     // ML model type for context
}
```

**Response:**
```typescript
{
  response: string;       // AI-generated response
  confidence?: number;    // Confidence score (0-1)
  metadata?: any;        // Additional response metadata
}
```

**Example:**
```typescript
const result = await supabase.functions.invoke('ai-analytics', {
  body: {
    query: "What are the trends in my sales data?",
    data: salesData,
    type: 'enhanced_analysis',
    modelType: 'time_series'
  }
});
```

### 2. ML Models (`ml-models`)

Executes machine learning analysis on datasets.

**Endpoint:** `POST /functions/v1/ml-models`

**Request Body:**
```typescript
{
  datasetId: string;                    // Dataset UUID
  modelType: MLModelType;               // 'linear_regression' | 'clustering' | 'anomaly_detection' | 'time_series'
  parameters?: Record<string, any>;     // Model-specific parameters
}
```

**Response:**
```typescript
{
  title: string;          // Analysis title
  description: string;    // Human-readable description
  confidence: number;     // Confidence score (0-1)
  metadata: any;         // Model-specific results
}
```

**Model Types:**

#### Linear Regression
```typescript
// Parameters
{
  xColumn?: string;       // X-axis variable (auto-detected if not provided)
  yColumn?: string;       // Y-axis variable (auto-detected if not provided)
}

// Response metadata
{
  equation: {
    slope: number;
    intercept: number;
  };
  rSquared: number;
  dataPoints: number;
  variables: { x: string; y: string; };
}
```

#### Clustering
```typescript
// Parameters
{
  clusters?: number;      // Number of clusters (auto-calculated if not provided)
  algorithm?: string;     // 'kmeans' (default)
}

// Response metadata
{
  clusters: Array<{
    id: number;
    range: [number, number];
    count: number;
    percentage: string;
  }>;
  variable: string;
  totalPoints: number;
}
```

#### Anomaly Detection
```typescript
// Parameters
{
  threshold?: number;     // Standard deviations threshold (default: 2)
  method?: string;        // 'zscore' (default)
}

// Response metadata
{
  anomalies: Array<{
    column: string;
    count: number;
    percentage: string;
    examples: number[];
  }>;
  threshold: number;
  totalAnomalies: number;
}
```

#### Time Series Analysis
```typescript
// Parameters
{
  dateColumn?: string;    // Date column (auto-detected if not provided)
  valueColumn?: string;   // Value column (auto-detected if not provided)
  forecastPeriods?: number; // Number of periods to forecast
}

// Response metadata
{
  trend: {
    direction: 'increasing' | 'decreasing' | 'stable';
    strength: number;
  };
  dataPoints: number;
  dateRange: {
    start: Date;
    end: Date;
  };
  variables: { date: string; value: string; };
}
```

### 3. Data Processing (`data-processing`)

Performs data cleaning, validation, and transformation operations.

**Endpoint:** `POST /functions/v1/data-processing`

**Request Body:**
```typescript
{
  datasetId: string;
  operations: {
    clean?: boolean;        // Data cleaning
    validate?: boolean;     // Data validation
    transform?: boolean;    // Data transformation
    analyze?: boolean;      // Basic analysis
  };
}
```

**Response:**
```typescript
{
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
```

### 4. Knowledge Graph (`knowledge-graph`)

Builds and manages knowledge graphs from data.

**Endpoint:** `POST /functions/v1/knowledge-graph`

**Request Body:**
```typescript
{
  datasetId: string;
  action: 'build';        // Currently only 'build' is supported
}
```

**Response:**
```typescript
{
  success: boolean;
  nodes_created: number;
  edges_created: number;
  message: string;
}
```

### 5. Knowledge Search (`knowledge-search`)

Searches the user's knowledge base for relevant information.

**Endpoint:** `POST /functions/v1/knowledge-search`

**Request Body:**
```typescript
{
  query: string;          // Search query
}
```

**Response:**
```typescript
{
  success: boolean;
  knowledge_results: Array<{
    id: string;
    title: string;
    content: string;
    category: string;
    tags: string[];
    relevance_score: number;
    calculated_relevance: number;
  }>;
  insight_results: Array<{
    id: string;
    title: string;
    description: string;
    confidence_score: number;
  }>;
  total_found: number;
  search_terms: string[];
}
```

### 6. Learning Engine (`learning-engine`)

Manages the AI learning system and user feedback processing.

**Endpoint:** `POST /functions/v1/learning-engine`

**Request Body:**
```typescript
// For processing feedback
{
  action: 'process_feedback';
  feedback: {
    feedback_type: 'positive' | 'negative' | 'neutral';
    rating: number;         // 1-5
    comment?: string;
    context?: any;
  };
}

// For getting recommendations
{
  action: 'get_recommendations';
  context?: any;
}
```

**Response:**
```typescript
// For process_feedback
{
  success: boolean;
  patterns_updated: number;
  message: string;
}

// For get_recommendations
{
  success: boolean;
  recommendations: Array<{
    type: string;
    title: string;
    description: string;
    confidence: number;
  }>;
  personalization_score: number;
}
```

### 7. Pipeline Orchestrator (`pipeline-orchestrator`)

Manages data processing pipelines.

**Endpoint:** `POST /functions/v1/pipeline-orchestrator`

**Request Body:**
```typescript
{
  pipelineId: string;
  datasetId: string;
  action: 'run';
}
```

**Response:**
```typescript
{
  success: boolean;
  results: {
    original_count: number;
    processed_count: number;
    transformations_applied: number;
    processing_time: number;
    data_quality_score: number;
  };
  message: string;
}
```

## Database Schema

### Core Tables

#### datasets
```sql
CREATE TABLE datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  columns_info JSONB,
  row_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### data_records
```sql
CREATE TABLE data_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### ai_insights
```sql
CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  confidence_score DECIMAL(3,2),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Learning System Tables

#### learning_patterns
```sql
CREATE TABLE learning_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pattern_type TEXT NOT NULL,
  pattern_data JSONB NOT NULL DEFAULT '{}',
  confidence_score DECIMAL(3,2) DEFAULT 0.50,
  usage_count INTEGER DEFAULT 1,
  last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### user_feedback
```sql
CREATE TABLE user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  interaction_id TEXT,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('positive', 'negative', 'neutral')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  context JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Knowledge System Tables

#### knowledge_base
```sql
CREATE TABLE knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  relevance_score DECIMAL(3,2) DEFAULT 0.50,
  embedding vector(1536),  -- For semantic search
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### knowledge_nodes
```sql
CREATE TABLE knowledge_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_name TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### knowledge_edges
```sql
CREATE TABLE knowledge_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  source_node_id UUID REFERENCES knowledge_nodes(id) ON DELETE CASCADE NOT NULL,
  target_node_id UUID REFERENCES knowledge_nodes(id) ON DELETE CASCADE NOT NULL,
  relationship_type TEXT NOT NULL,
  weight DECIMAL(3,2) DEFAULT 0.50,
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Error Handling

All functions return consistent error responses:

```typescript
{
  error: string;          // Error message
  code?: string;          // Error code (optional)
  details?: any;          // Additional error details (optional)
}
```

Common error codes:
- `UNAUTHORIZED`: User not authenticated
- `FORBIDDEN`: User lacks permission
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid input data
- `PROCESSING_ERROR`: Error during data processing
- `AI_ERROR`: Error from AI service

## Rate Limiting

API calls are rate-limited per user:
- AI Analytics: 100 requests per hour
- ML Models: 50 requests per hour
- Other functions: 200 requests per hour

## Best Practices

1. **Error Handling**: Always check for errors in responses
2. **Pagination**: Use pagination for large datasets
3. **Caching**: Cache responses when appropriate
4. **Retries**: Implement exponential backoff for retries
5. **Validation**: Validate input data before sending requests

## SDK Usage Examples

```typescript
// Initialize Supabase client
const supabase = createClient(url, anonKey);

// AI Analytics
const analyzeData = async (query: string, data: any[]) => {
  const { data: result, error } = await supabase.functions.invoke('ai-analytics', {
    body: { query, data, type: 'enhanced_analysis' }
  });
  
  if (error) throw new Error(error.message);
  return result;
};

// ML Models
const runMLAnalysis = async (datasetId: string, modelType: string) => {
  const { data: result, error } = await supabase.functions.invoke('ml-models', {
    body: { datasetId, modelType, parameters: {} }
  });
  
  if (error) throw new Error(error.message);
  return result;
};

// Knowledge Search
const searchKnowledge = async (query: string) => {
  const { data: result, error } = await supabase.functions.invoke('knowledge-search', {
    body: { query }
  });
  
  if (error) throw new Error(error.message);
  return result;
};
```