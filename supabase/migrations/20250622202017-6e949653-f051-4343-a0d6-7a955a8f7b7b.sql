
-- Create learning_patterns table for AI learning system
CREATE TABLE public.learning_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pattern_type TEXT NOT NULL,
  pattern_data JSONB NOT NULL DEFAULT '{}',
  confidence_score DECIMAL(3,2) DEFAULT 0.50 CHECK (confidence_score >= 0 AND confidence_score <= 1),
  usage_count INTEGER DEFAULT 1,
  last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_feedback table for learning system
CREATE TABLE public.user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  interaction_id TEXT,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('positive', 'negative', 'neutral')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  context JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create knowledge_base table
CREATE TABLE public.knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  relevance_score DECIMAL(3,2) DEFAULT 0.50 CHECK (relevance_score >= 0 AND relevance_score <= 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create knowledge_nodes table for knowledge graph
CREATE TABLE public.knowledge_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  dataset_id UUID REFERENCES public.datasets(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_name TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create knowledge_edges table for knowledge graph
CREATE TABLE public.knowledge_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  source_node_id UUID REFERENCES public.knowledge_nodes(id) ON DELETE CASCADE NOT NULL,
  target_node_id UUID REFERENCES public.knowledge_nodes(id) ON DELETE CASCADE NOT NULL,
  relationship_type TEXT NOT NULL,
  weight DECIMAL(3,2) DEFAULT 0.50 CHECK (weight >= 0 AND weight <= 1),
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create processing_pipelines table
CREATE TABLE public.processing_pipelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  pipeline_config JSONB NOT NULL DEFAULT '{}',
  status TEXT DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'running', 'error')),
  last_run TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.learning_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processing_pipelines ENABLE ROW LEVEL SECURITY;

-- RLS policies for learning_patterns
CREATE POLICY "Users can manage their own learning patterns" 
  ON public.learning_patterns 
  FOR ALL 
  USING (auth.uid() = user_id);

-- RLS policies for user_feedback
CREATE POLICY "Users can manage their own feedback" 
  ON public.user_feedback 
  FOR ALL 
  USING (auth.uid() = user_id);

-- RLS policies for knowledge_base
CREATE POLICY "Users can manage their own knowledge base" 
  ON public.knowledge_base 
  FOR ALL 
  USING (auth.uid() = user_id);

-- RLS policies for knowledge_nodes
CREATE POLICY "Users can manage their own knowledge nodes" 
  ON public.knowledge_nodes 
  FOR ALL 
  USING (auth.uid() = user_id);

-- RLS policies for knowledge_edges
CREATE POLICY "Users can manage their own knowledge edges" 
  ON public.knowledge_edges 
  FOR ALL 
  USING (auth.uid() = user_id);

-- RLS policies for processing_pipelines
CREATE POLICY "Users can manage their own processing pipelines" 
  ON public.processing_pipelines 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_learning_patterns_user_id ON public.learning_patterns(user_id);
CREATE INDEX idx_learning_patterns_type ON public.learning_patterns(pattern_type);
CREATE INDEX idx_user_feedback_user_id ON public.user_feedback(user_id);
CREATE INDEX idx_knowledge_base_user_id ON public.knowledge_base(user_id);
CREATE INDEX idx_knowledge_base_category ON public.knowledge_base(category);
CREATE INDEX idx_knowledge_nodes_user_id ON public.knowledge_nodes(user_id);
CREATE INDEX idx_knowledge_nodes_dataset_id ON public.knowledge_nodes(dataset_id);
CREATE INDEX idx_knowledge_edges_user_id ON public.knowledge_edges(user_id);
CREATE INDEX idx_knowledge_edges_source ON public.knowledge_edges(source_node_id);
CREATE INDEX idx_knowledge_edges_target ON public.knowledge_edges(target_node_id);
CREATE INDEX idx_processing_pipelines_user_id ON public.processing_pipelines(user_id);

-- Add vector column to knowledge_base for semantic search (if vector extension is available)
ALTER TABLE public.knowledge_base ADD COLUMN embedding vector(1536);

-- Create index for vector similarity search
CREATE INDEX ON public.knowledge_base USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
