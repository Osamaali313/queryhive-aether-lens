
-- Create datasets table for uploaded data
CREATE TABLE public.datasets (
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

-- Create data_records table for actual data storage
CREATE TABLE public.data_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id UUID REFERENCES public.datasets(id) ON DELETE CASCADE NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics_queries table for storing query history
CREATE TABLE public.analytics_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  dataset_id UUID REFERENCES public.datasets(id) ON DELETE CASCADE,
  query_text TEXT NOT NULL,
  query_type TEXT, -- 'natural_language', 'sql', 'chart_generation'
  results JSONB,
  execution_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_insights table for storing AI-generated insights
CREATE TABLE public.ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  dataset_id UUID REFERENCES public.datasets(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL, -- 'pattern', 'anomaly', 'prediction', 'summary'
  title TEXT NOT NULL,
  description TEXT,
  confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create dashboards table for custom dashboards
CREATE TABLE public.dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  layout JSONB, -- Store dashboard layout and widget configurations
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboards ENABLE ROW LEVEL SECURITY;

-- RLS policies for datasets
CREATE POLICY "Users can manage their own datasets" 
  ON public.datasets 
  FOR ALL 
  USING (auth.uid() = user_id);

-- RLS policies for data_records
CREATE POLICY "Users can access records from their datasets" 
  ON public.data_records 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.datasets 
      WHERE datasets.id = data_records.dataset_id 
      AND datasets.user_id = auth.uid()
    )
  );

-- RLS policies for analytics_queries
CREATE POLICY "Users can manage their own queries" 
  ON public.analytics_queries 
  FOR ALL 
  USING (auth.uid() = user_id);

-- RLS policies for ai_insights
CREATE POLICY "Users can access their own insights" 
  ON public.ai_insights 
  FOR ALL 
  USING (auth.uid() = user_id);

-- RLS policies for dashboards
CREATE POLICY "Users can manage their own dashboards" 
  ON public.dashboards 
  FOR ALL 
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public dashboards" 
  ON public.dashboards 
  FOR SELECT 
  USING (is_public = TRUE);

-- Create indexes for better performance
CREATE INDEX idx_datasets_user_id ON public.datasets(user_id);
CREATE INDEX idx_data_records_dataset_id ON public.data_records(dataset_id);
CREATE INDEX idx_analytics_queries_user_id ON public.analytics_queries(user_id);
CREATE INDEX idx_analytics_queries_dataset_id ON public.analytics_queries(dataset_id);
CREATE INDEX idx_ai_insights_user_id ON public.ai_insights(user_id);
CREATE INDEX idx_ai_insights_dataset_id ON public.ai_insights(dataset_id);
CREATE INDEX idx_dashboards_user_id ON public.dashboards(user_id);
