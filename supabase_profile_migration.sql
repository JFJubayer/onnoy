-- 1. Add new columns to public.profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS school_name TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS social_link TEXT,
ADD COLUMN IF NOT EXISTS ongoing_modules TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS completed_modules TEXT[] DEFAULT '{}';

-- 2. Create the avatars storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Storage Policies for 'avatars' bucket
-- Allow public viewing of avatars
CREATE POLICY "Allow public read access to avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Allow authenticated users to upload their own avatar
-- We enforce that the file path must start with their user ID (e.g. 'uuid/filename.png')
CREATE POLICY "Allow users to upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to update their own avatar
CREATE POLICY "Allow users to update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to delete their own avatar
CREATE POLICY "Allow users to delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
