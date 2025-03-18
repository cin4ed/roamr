-- Create an enum for rating values to ensure valid ratings
CREATE TYPE public.rating_value AS ENUM ('1', '2', '3', '4', '5');

-- Create the reviews table with all needed fields
CREATE TABLE public.location_reviews (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    location_id uuid NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title text,
    rating rating_value NOT NULL,
    comment text,
    helpful_votes int DEFAULT 0,
    visit_date date,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    -- Ensure a user can only review a location once
    CONSTRAINT location_reviews_pkey PRIMARY KEY (id),
    CONSTRAINT unique_user_location_review UNIQUE (user_id, location_id)
);

-- Create a table for review parameter ratings (for future use with accessibility, safety, etc.)
CREATE TABLE public.review_parameters (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    review_id uuid NOT NULL REFERENCES public.location_reviews(id) ON DELETE CASCADE,
    parameter_name text NOT NULL,
    rating rating_value NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT review_parameters_pkey PRIMARY KEY (id),
    CONSTRAINT unique_review_parameter UNIQUE (review_id, parameter_name)
);

-- Create a table for review media (photos and videos)
CREATE TABLE public.review_media (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    review_id uuid NOT NULL REFERENCES public.location_reviews(id) ON DELETE CASCADE,
    media_type text NOT NULL CHECK (media_type IN ('photo', 'video')),
    media_url text NOT NULL,
    caption text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT review_media_pkey PRIMARY KEY (id)
);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_location_reviews_updated_at
    BEFORE UPDATE ON location_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_parameters_updated_at
    BEFORE UPDATE ON review_parameters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_media_updated_at
    BEFORE UPDATE ON review_media
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create a view for easy access to average ratings
CREATE VIEW location_review_stats AS
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
FROM location_reviews
GROUP BY location_id;

-- Add RLS (Row Level Security) policies
ALTER TABLE location_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_media ENABLE ROW LEVEL SECURITY;

-- Location reviews policies
CREATE POLICY "Anyone can read reviews"
    ON location_reviews FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Authenticated users can create reviews"
    ON location_reviews FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
    ON location_reviews FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
    ON location_reviews FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Review parameters policies
CREATE POLICY "Anyone can read review parameters"
    ON review_parameters FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Users can create parameters for their reviews"
    ON review_parameters FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.location_reviews
            WHERE id = review_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their review parameters"
    ON review_parameters FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.location_reviews
            WHERE id = review_id AND user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.location_reviews
            WHERE id = review_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their review parameters"
    ON review_parameters FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.location_reviews
            WHERE id = review_id AND user_id = auth.uid()
        )
    );

-- Review media policies
CREATE POLICY "Anyone can read review media"
    ON review_media FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Users can create media for their reviews"
    ON review_media FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.location_reviews
            WHERE id = review_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their review media"
    ON review_media FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.location_reviews
            WHERE id = review_id AND user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.location_reviews
            WHERE id = review_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their review media"
    ON review_media FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.location_reviews
            WHERE id = review_id AND user_id = auth.uid()
        )
    ); 