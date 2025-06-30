-- Create user_achievements table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievements TEXT[] DEFAULT '{}',
  viewed_achievements TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on the table
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Create RLS policy (removed IF NOT EXISTS as it's not supported for policies)
DO $$ 
BEGIN
  -- Check if policy exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_achievements' 
    AND policyname = 'Users can manage their own achievements'
  ) THEN
    CREATE POLICY "Users can manage their own achievements" 
      ON public.user_achievements 
      FOR ALL 
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create index for user_id
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to update the updated_at column
DROP TRIGGER IF EXISTS trigger_update_user_achievements_updated_at ON public.user_achievements;
CREATE TRIGGER trigger_update_user_achievements_updated_at
BEFORE UPDATE ON public.user_achievements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();