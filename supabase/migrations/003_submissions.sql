-- 1. Create Submissions Table
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    unique_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    mission_title TEXT NOT NULL,
    evidence_notes TEXT NOT NULL,
    screenshot_urls TEXT[] NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on submissions
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone (public) to insert new submissions
CREATE POLICY "Allow public inserts" 
    ON public.submissions 
    FOR INSERT 
    WITH CHECK (true);

-- Policy: Allow users to view their own submissions
CREATE POLICY "Allow users to view their own submissions" 
    ON public.submissions 
    FOR SELECT 
    USING (auth.uid() = user_id);

-- 2. Create Storage Bucket for Screenshots (stored in storage.buckets schema)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('mission-screenshots', 'mission-screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow public uploads (INSERT) into mission-screenshots bucket
CREATE POLICY "Allow public uploads to mission-screenshots"
    ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'mission-screenshots');

-- Policy: Allow public viewing (SELECT) of screenshots
CREATE POLICY "Allow public access to mission-screenshots"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'mission-screenshots');
