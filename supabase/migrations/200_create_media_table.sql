-- Create a centralized media table for all types of media
CREATE TABLE public.media (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    media_type text NOT NULL CHECK (media_type IN ('photo', 'video')),
    media_url text NOT NULL,
    caption text,
    uploaded_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT media_pkey PRIMARY KEY (id)
);

-- Enable row level security for the media table
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Media policies
CREATE POLICY "Anyone can read media"
    ON media FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Authenticated users can upload media"
    ON media FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update their media"
    ON media FOR UPDATE
    TO authenticated
    USING (auth.uid() = uploaded_by)
    WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete their media"
    ON media FOR DELETE
    TO authenticated
    USING (auth.uid() = uploaded_by);

-- Create a trigger to automatically update the updated_at column for the media table
CREATE TRIGGER update_media_updated_at
    BEFORE UPDATE ON media
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();