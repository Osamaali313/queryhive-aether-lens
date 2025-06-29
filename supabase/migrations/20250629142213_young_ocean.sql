/*
  # Add onboarding status to profiles table

  1. Changes
     - Add `onboarding_complete` boolean column to profiles table
     - Add `onboarding_step` integer column to track progress
     - Add default values for existing users
  
  2. Security
     - No changes to RLS policies needed
*/

-- Add onboarding status columns to profiles table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'onboarding_complete'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN onboarding_complete BOOLEAN DEFAULT FALSE;
  END IF;

  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'onboarding_step'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN onboarding_step INTEGER DEFAULT 0;
  END IF;
END $$;

-- Set existing users to have completed onboarding
UPDATE public.profiles
SET onboarding_complete = TRUE, onboarding_step = 5
WHERE onboarding_complete IS NULL;