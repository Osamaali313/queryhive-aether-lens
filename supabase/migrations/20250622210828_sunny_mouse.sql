/*
  # Enhanced AI Learning System Schema

  1. New Tables
    - `learning_patterns` - Stores AI learning patterns and user preferences
    - `user_feedback` - Collects user feedback for RLHF system
    - `knowledge_base` - Stores knowledge entries with semantic search
    - `knowledge_nodes` - Knowledge graph nodes for entity relationships
    - `knowledge_edges` - Knowledge graph edges for relationship mapping
    - `processing_pipelines` - Data processing workflow configurations

  2. Security
    - Enable RLS on all tables
    - Add policies for user data isolation
    - Ensure proper access control

  3. Performance
    - Add indexes for efficient querying
    - Vector search capabilities for knowledge base
*/

-- Create learning_patterns table for AI learning system
CREATE TABLE IF NOT EXISTS public.learning_patterns (
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
CREATE TABLE IF NOT EXISTS public.user_feedback (
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
CREATE TABLE IF NOT EXISTS public.knowledge_base (
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
CREATE TABLE IF NOT EXISTS public.knowledge_nodes (
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
CREATE TABLE IF NOT EXISTS public.knowledge_edges (
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
CREATE TABLE IF NOT EXISTS public.processing_pipelines (
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

-- Enable RLS on all tables (only if not already enabled)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'learning_patterns' AND n.nspname = 'public' AND c.relrowsecurity = true
  ) THEN
    ALTER TABLE public.learning_patterns ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'user_feedback' AND n.nspname = 'public' AND c.relrowsecurity = true
  ) THEN
    ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'knowledge_base' AND n.nspname = 'public' AND c.relrowsecurity = true
  ) THEN
    ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'knowledge_nodes' AND n.nspname = 'public' AND c.relrowsecurity = true
  ) THEN
    ALTER TABLE public.knowledge_nodes ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'knowledge_edges' AND n.nspname = 'public' AND c.relrowsecurity = true
  ) THEN
    ALTER TABLE public.knowledge_edges ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'processing_pipelines' AND n.nspname = 'public' AND c.relrowsecurity = true
  ) THEN
    ALTER TABLE public.processing_pipelines ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- RLS policies for learning_patterns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'learning_patterns' AND policyname = 'Users can manage their own learning patterns'
  ) THEN
    CREATE POLICY "Users can manage their own learning patterns" 
      ON public.learning_patterns 
      FOR ALL 
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- RLS policies for user_feedback
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_feedback' AND policyname = 'Users can manage their own feedback'
  ) THEN
    CREATE POLICY "Users can manage their own feedback" 
      ON public.user_feedback 
      FOR ALL 
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- RLS policies for knowledge_base
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'knowledge_base' AND policyname = 'Users can manage their own knowledge base'
  ) THEN
    CREATE POLICY "Users can manage their own knowledge base" 
      ON public.knowledge_base 
      FOR ALL 
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- RLS policies for knowledge_nodes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'knowledge_nodes' AND policyname = 'Users can manage their own knowledge nodes'
  ) THEN
    CREATE POLICY "Users can manage their own knowledge nodes" 
      ON public.knowledge_nodes 
      FOR ALL 
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- RLS policies for knowledge_edges
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'knowledge_edges' AND policyname = 'Users can manage their own knowledge edges'
  ) THEN
    CREATE POLICY "Users can manage their own knowledge edges" 
      ON public.knowledge_edges 
      FOR ALL 
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- RLS policies for processing_pipelines
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'processing_pipelines' AND policyname = 'Users can manage their own processing pipelines'
  ) THEN
    CREATE POLICY "Users can manage their own processing pipelines" 
      ON public.processing_pipelines 
      FOR ALL 
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create indexes for better performance (only if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_learning_patterns_user_id') THEN
    CREATE INDEX idx_learning_patterns_user_id ON public.learning_patterns(user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_learning_patterns_type') THEN
    CREATE INDEX idx_learning_patterns_type ON public.learning_patterns(pattern_type);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_feedback_user_id') THEN
    CREATE INDEX idx_user_feedback_user_id ON public.user_feedback(user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_knowledge_base_user_id') THEN
    CREATE INDEX idx_knowledge_base_user_id ON public.knowledge_base(user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_knowledge_base_category') THEN
    CREATE INDEX idx_knowledge_base_category ON public.knowledge_base(category);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_knowledge_nodes_user_id') THEN
    CREATE INDEX idx_knowledge_nodes_user_id ON public.knowledge_nodes(user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_knowledge_nodes_dataset_id') THEN
    CREATE INDEX idx_knowledge_nodes_dataset_id ON public.knowledge_nodes(dataset_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_knowledge_edges_user_id') THEN
    CREATE INDEX idx_knowledge_edges_user_id ON public.knowledge_edges(user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_knowledge_edges_source') THEN
    CREATE INDEX idx_knowledge_edges_source ON public.knowledge_edges(source_node_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_knowledge_edges_target') THEN
    CREATE INDEX idx_knowledge_edges_target ON public.knowledge_edges(target_node_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_processing_pipelines_user_id') THEN
    CREATE INDEX idx_processing_pipelines_user_id ON public.processing_pipelines(user_id);
  END IF;
END $$;

-- Add vector column to knowledge_base for semantic search (if vector extension is available)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'knowledge_base' AND column_name = 'embedding'
  ) THEN
    -- Only add if vector extension is available
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'vector') THEN
      ALTER TABLE public.knowledge_base ADD COLUMN embedding vector(1536);
    END IF;
  END IF;
END $$;

-- Create index for vector similarity search (only if vector extension and column exist)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'knowledge_base' AND column_name = 'embedding'
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'knowledge_base_embedding_idx'
  ) THEN
    CREATE INDEX knowledge_base_embedding_idx ON public.knowledge_base USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
  END IF;
END $$;