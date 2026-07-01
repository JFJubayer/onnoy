-- 1. Alter profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- 2. Alter submissions table
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- 3. Create Admin RLS policies for submissions
-- Drop policies if they already exist to avoid errors
DROP POLICY IF EXISTS "Allow admins to view all submissions" ON public.submissions;
CREATE POLICY "Allow admins to view all submissions" 
    ON public.submissions 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Allow admins to update submissions" ON public.submissions;
CREATE POLICY "Allow admins to update submissions" 
    ON public.submissions 
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 4. Create Admin RLS policies for profiles
DROP POLICY IF EXISTS "Allow admins to update profiles" ON public.profiles;
CREATE POLICY "Allow admins to update profiles" 
    ON public.profiles 
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );
