-- Create logs storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('logs', 'logs', false)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to upload files to their own folder
CREATE POLICY "Users can upload their own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'logs' 
    AND (storage.foldername(name))[1] = 'user_uploads' 
    AND (storage.foldername(name))[2] = auth.uid()::text
);

-- Create policy to allow users to view their own files
CREATE POLICY "Users can view their own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'logs' 
    AND (storage.foldername(name))[1] = 'user_uploads' 
    AND (storage.foldername(name))[2] = auth.uid()::text
);

-- Create policy to allow users to update their own files
CREATE POLICY "Users can update their own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'logs' 
    AND (storage.foldername(name))[1] = 'user_uploads' 
    AND (storage.foldername(name))[2] = auth.uid()::text
);

-- Create policy to allow users to delete their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'logs' 
    AND (storage.foldername(name))[1] = 'user_uploads' 
    AND (storage.foldername(name))[2] = auth.uid()::text
);

-- Allow public read access (optional - if you want files to be publicly viewable)
-- CREATE POLICY "Allow public read access" 
-- ON storage.objects FOR SELECT
-- TO public
-- USING (bucket_id = 'logs' AND auth.role() = 'authenticated');

-- Create uploads table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    notes TEXT,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_url TEXT,
    file_path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    status TEXT DEFAULT 'processing',
    
    -- Add additional metadata as needed
    processed_at TIMESTAMP WITH TIME ZONE,
    thumbnail_url TEXT
);

-- Enable Row Level Security on uploads table
ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own uploads
CREATE POLICY "Users can view their own uploads"
ON public.uploads FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Create policy for users to insert their own uploads
CREATE POLICY "Users can insert their own uploads"
ON public.uploads FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Create policy for users to update their own uploads
CREATE POLICY "Users can update their own uploads"
ON public.uploads FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Create policy for users to delete their own uploads
CREATE POLICY "Users can delete their own uploads"
ON public.uploads FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS uploads_user_id_idx ON public.uploads (user_id);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS uploads_created_at_idx ON public.uploads (created_at DESC);

-- Optional: Create a function to clean up storage when an upload is deleted
CREATE OR REPLACE FUNCTION delete_storage_object()
RETURNS TRIGGER AS $$
BEGIN
    -- Call Supabase function to delete from storage
    -- This requires setting up a Supabase Function to handle the deletion
    -- PERFORM http_post(
    --     'https://your-project-ref.functions.supabase.co/delete-storage-object',
    --     json_build_object('bucket', 'logs', 'path', OLD.file_path),
    --     'application/json',
    --     json_build_object('Authorization', current_setting('request.headers')::json->>'authorization')
    -- );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optional: Create a trigger to call the function when an upload is deleted
CREATE TRIGGER delete_storage_object_trigger
AFTER DELETE ON public.uploads
FOR EACH ROW
EXECUTE PROCEDURE delete_storage_object();

-- Note: The storage cleanup function is commented out as it requires additional setup
-- To enable it, create a Supabase Edge Function to handle the storage deletion 