-- Create the articles table if it does not exist
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    category_name TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    date TEXT NOT NULL,
    image_desc TEXT,
    image_gradient TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on the articles table
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Create policies for articles

-- 1. Allow public (anonymous and authenticated) users to read articles
CREATE POLICY "Allow public read access"
ON public.articles
FOR SELECT
TO public
USING (true);

-- 2. Allow authenticated users to insert new articles
CREATE POLICY "Allow authenticated insert"
ON public.articles
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 3. Allow authenticated users to update existing articles
CREATE POLICY "Allow authenticated update"
ON public.articles
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 4. Allow authenticated users to delete articles
CREATE POLICY "Allow authenticated delete"
ON public.articles
FOR DELETE
TO authenticated
USING (true);
