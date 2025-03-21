-- Create a table to link locations with all their media
CREATE TABLE public.location_media (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    location_id uuid NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
    media_id uuid NOT NULL REFERENCES public.media(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT location_media_pkey PRIMARY KEY (id),
    CONSTRAINT unique_location_media UNIQUE (location_id, media_id)
);

-- Enable row level security for the location_media table
ALTER TABLE public.location_media ENABLE ROW LEVEL SECURITY;

-- Location media policies
CREATE POLICY "Anyone can read location media connections"
    ON location_media FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Authenticated users can add media to locations"
    ON location_media 
    FOR INSERT TO authenticated WITH CHECK (true);

-- Create a trigger to automatically update the updated_at column for the location_media table
CREATE TRIGGER update_location_media_updated_at
    BEFORE UPDATE ON public.location_media
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create a function to upload media to a location
-- CREATE OR REPLACE FUNCTION add_location_media(
--     p_media_type TEXT,
--     p_media_url
-- )
