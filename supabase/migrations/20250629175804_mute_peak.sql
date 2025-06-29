-- Create learning_patterns table for AI learning system if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'learning_patterns') THEN
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
  END IF;
END $$;

-- Create user_feedback table for learning system if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_feedback') THEN
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
  END IF;
END $$;

-- Create knowledge_base table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'knowledge_base') THEN
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
  END IF;
END $$;

-- Create knowledge_nodes table for knowledge graph if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'knowledge_nodes') THEN
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
  END IF;
END $$;

-- Create knowledge_edges table for knowledge graph if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'knowledge_edges') THEN
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
  END IF;
END $$;

-- Create processing_pipelines table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'processing_pipelines') THEN
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
  END IF;
END $$;

-- Enable RLS on all tables if not already enabled
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'learning_patterns') THEN
    ALTER TABLE public.learning_patterns ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_feedback') THEN
    ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'knowledge_base') THEN
    ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'knowledge_nodes') THEN
    ALTER TABLE public.knowledge_nodes ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'knowledge_edges') THEN
    ALTER TABLE public.knowledge_edges ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'processing_pipelines') THEN
    ALTER TABLE public.processing_pipelines ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create RLS policies if they don't exist
DO $$ 
BEGIN
  -- RLS policies for learning_patterns
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'learning_patterns' 
    AND schemaname = 'public' 
    AND policyname = 'Users can manage their own learning patterns'
  ) THEN
    CREATE POLICY "Users can manage their own learning patterns" 
      ON public.learning_patterns 
      FOR ALL 
      USING (auth.uid() = user_id);
  END IF;

  -- RLS policies for user_feedback
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'user_feedback' 
    AND schemaname = 'public' 
    AND policyname = 'Users can manage their own feedback'
  ) THEN
    CREATE POLICY "Users can manage their own feedback" 
      ON public.user_feedback 
      FOR ALL 
      USING (auth.uid() = user_id);
  END IF;

  -- RLS policies for knowledge_base
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'knowledge_base' 
    AND schemaname = 'public' 
    AND policyname = 'Users can manage their own knowledge base'
  ) THEN
    CREATE POLICY "Users can manage their own knowledge base" 
      ON public.knowledge_base 
      FOR ALL 
      USING (auth.uid() = user_id);
  END IF;

  -- RLS policies for knowledge_nodes
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'knowledge_nodes' 
    AND schemaname = 'public' 
    AND policyname = 'Users can manage their own knowledge nodes'
  ) THEN
    CREATE POLICY "Users can manage their own knowledge nodes" 
      ON public.knowledge_nodes 
      FOR ALL 
      USING (auth.uid() = user_id);
  END IF;

  -- RLS policies for knowledge_edges
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'knowledge_edges' 
    AND schemaname = 'public' 
    AND policyname = 'Users can manage their own knowledge edges'
  ) THEN
    CREATE POLICY "Users can manage their own knowledge edges" 
      ON public.knowledge_edges 
      FOR ALL 
      USING (auth.uid() = user_id);
  END IF;

  -- RLS policies for processing_pipelines
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'processing_pipelines' 
    AND schemaname = 'public' 
    AND policyname = 'Users can manage their own processing pipelines'
  ) THEN
    CREATE POLICY "Users can manage their own processing pipelines" 
      ON public.processing_pipelines 
      FOR ALL 
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create indexes for better performance if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_learning_patterns_user_id') THEN
    CREATE INDEX idx_learning_patterns_user_id ON public.learning_patterns(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_learning_patterns_type') THEN
    CREATE INDEX idx_learning_patterns_type ON public.learning_patterns(pattern_type);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_feedback_user_id') THEN
    CREATE INDEX idx_user_feedback_user_id ON public.user_feedback(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_knowledge_base_user_id') THEN
    CREATE INDEX idx_knowledge_base_user_id ON public.knowledge_base(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_knowledge_base_category') THEN
    CREATE INDEX idx_knowledge_base_category ON public.knowledge_base(category);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_knowledge_nodes_user_id') THEN
    CREATE INDEX idx_knowledge_nodes_user_id ON public.knowledge_nodes(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_knowledge_nodes_dataset_id') THEN
    CREATE INDEX idx_knowledge_nodes_dataset_id ON public.knowledge_nodes(dataset_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_knowledge_edges_user_id') THEN
    CREATE INDEX idx_knowledge_edges_user_id ON public.knowledge_edges(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_knowledge_edges_source') THEN
    CREATE INDEX idx_knowledge_edges_source ON public.knowledge_edges(source_node_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_knowledge_edges_target') THEN
    CREATE INDEX idx_knowledge_edges_target ON public.knowledge_edges(target_node_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_processing_pipelines_user_id') THEN
    CREATE INDEX idx_processing_pipelines_user_id ON public.processing_pipelines(user_id);
  END IF;
END $$;

-- Add vector column to knowledge_base for semantic search if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'knowledge_base' 
    AND column_name = 'embedding'
  ) THEN
    ALTER TABLE public.knowledge_base ADD COLUMN embedding vector(1536);
  END IF;
END $$;

-- Create index for vector similarity search if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'knowledge_base_embedding_idx') THEN
    CREATE INDEX knowledge_base_embedding_idx ON public.knowledge_base USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
  END IF;
END $$;