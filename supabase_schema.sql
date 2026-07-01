-- Supabase Database Schema: Profiles and Verification Trigger
-- Run this script in the Supabase SQL Editor to set up the profiles table and verification trigger.

-- 1. Create public profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  unique_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Allow anyone to read profiles (useful for validation/display)
CREATE POLICY "Allow public read access" ON public.profiles
  FOR SELECT USING (true);

-- Allow users to update their own profile fields
CREATE POLICY "Allow individual update access" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 4. Create trigger function to handle verified users
CREATE OR REPLACE FUNCTION public.handle_user_verification()
RETURNS TRIGGER AS $$
DECLARE
  generated_id TEXT;
  id_exists BOOLEAN;
BEGIN
  -- Check if the email is confirmed
  -- On INSERT, OLD is null. On UPDATE, we check if email is confirmed and profile doesn't exist, or if email transition just happened.
  IF (TG_OP = 'INSERT' AND NEW.email_confirmed_at IS NOT NULL) OR 
     (TG_OP = 'UPDATE' AND NEW.email_confirmed_at IS NOT NULL AND (OLD.email_confirmed_at IS NULL OR NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id))) THEN
    
    -- Loop until we generate a completely unique ONNOY-XXXXXX ID
    LOOP
      -- Generate a 6-character random alphanumeric string prefixed with ONNOY-
      generated_id := 'ONNOY-' || upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 6));
      
      SELECT EXISTS(SELECT 1 FROM public.profiles WHERE unique_id = generated_id) INTO id_exists;
      EXIT WHEN NOT id_exists;
    END LOOP;

    -- Create or update the user's profile with their email and generated Unique ID
    INSERT INTO public.profiles (id, email, unique_id, created_at, updated_at)
    VALUES (NEW.id, NEW.email, generated_id, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE 
    SET email = EXCLUDED.email, 
        unique_id = COALESCE(profiles.unique_id, EXCLUDED.unique_id), 
        updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Attach trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_verified ON auth.users;
CREATE TRIGGER on_auth_user_verified
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_verification();
