-- Create an enum for rating values to ensure valid ratings
CREATE TYPE public.rating_value AS ENUM ('1', '2', '3', '4', '5');

-- Create the ratings table
CREATE TABLE public.location_ratings (
    id uuid not null default uuid_generate_v4(),
    location_id uuid not null references public.locations(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    rating rating_value not null,
    comment text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    -- Ensure a user can only rate a location once
    CONSTRAINT location_ratings_pkey PRIMARY KEY (id),
    CONSTRAINT unique_user_location_rating UNIQUE (user_id, location_id)
);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_location_ratings_updated_at
    BEFORE UPDATE ON location_ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create a view for easy access to average ratings
CREATE VIEW location_rating_stats AS
SELECT 
    location_id,
    ROUND(AVG(CASE rating 
        WHEN '1' THEN 1
        WHEN '2' THEN 2
        WHEN '3' THEN 3
        WHEN '4' THEN 4
        WHEN '5' THEN 5
    END), 2) as average_rating,
    COUNT(*) as total_ratings
FROM location_ratings
GROUP BY location_id;

-- Add RLS (Row Level Security) policies
ALTER TABLE location_ratings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read ratings
CREATE POLICY "Anyone can read ratings"
ON location_ratings FOR SELECT
TO public
USING (true);

-- Allow authenticated users to create ratings
CREATE POLICY "Authenticated users can create ratings"
ON location_ratings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own ratings
CREATE POLICY "Users can update own ratings"
ON location_ratings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own ratings
CREATE POLICY "Users can delete own ratings"
ON location_ratings FOR DELETE
TO authenticated
USING (auth.uid() = user_id);