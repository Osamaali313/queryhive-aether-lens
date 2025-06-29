/*
  # Add User Achievements Table

  1. New Tables
    - `user_achievements` - Stores user achievement progress and unlocked achievements

  2. Security
    - Enable RLS on the table
    - Add policies for user-based access control
    
  3. Performance
    - Create indexes for common query patterns
*/

-- Create user_achievements table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_achievements') THEN
    CREATE TABLE public.user_achievements (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
      achievements TEXT[] DEFAULT '{}',
      viewed_achievements TEXT[] DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
END $$;

-- Enable RLS on the table
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_achievements') THEN
    ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create RLS policy if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'user_achievements' 
    AND schemaname = 'public' 
    AND policyname = 'Users can manage their own achievements'
  ) THEN
    CREATE POLICY "Users can manage their own achievements" 
      ON public.user_achievements 
      FOR ALL 
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create index for user_id if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_achievements_user_id') THEN
    CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);
  END IF;
END $$;

-- Add updated_at trigger function if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  END IF;
END $$;

-- Add trigger to update the updated_at column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'trigger_update_user_achievements_updated_at'
  ) THEN
    CREATE TRIGGER trigger_update_user_achievements_updated_at
    BEFORE UPDATE ON public.user_achievements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;