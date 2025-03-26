-- -- Create a type for rating values
-- CREATE TYPE public.rating_value AS ENUM ('1', '2', '3', '4', '5');

-- -- Create the reviews table with all needed fields
-- CREATE TABLE public.location_reviews (
--     id uuid NOT NULL DEFAULT uuid_generate_v4(),
--     location_id uuid NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
--     user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
--     title text,
--     rating rating_value NOT NULL,
--     comment text,
--     helpful_votes int DEFAULT 0,
--     visit_date date,
--     created_at timestamp with time zone DEFAULT now(),
--     updated_at timestamp with time zone DEFAULT now(),
--     CONSTRAINT location_reviews_pkey PRIMARY KEY (id),
--     CONSTRAINT unique_location_active_user UNIQUE (location_id, user_id)
-- );

-- -- Enable row level security for the location_reviews table
-- ALTER TABLE public.location_reviews ENABLE ROW LEVEL SECURITY;

-- -- Location reviews policies
-- CREATE POLICY "Anyone can read reviews"
--     ON location_reviews FOR SELECT
--     TO public
--     USING (true);

-- CREATE POLICY "Authenticated users can create reviews"
--     ON location_reviews FOR INSERT
--     TO authenticated
--     WITH CHECK (auth.uid() = user_id);

-- CREATE POLICY "Users can update own reviews"
--     ON location_reviews FOR UPDATE
--     TO authenticated
--     USING (auth.uid() = user_id)
--     WITH CHECK (auth.uid() = user_id);

-- CREATE POLICY "Users can delete own reviews"
--     ON location_reviews FOR DELETE
--     TO authenticated
--     USING (auth.uid() = user_id);

-- -- Create a trigger to automatically update the updated_at column for the location_reviews table
-- CREATE TRIGGER update_location_reviews_updated_at
--     BEFORE UPDATE ON public.location_reviews
--     FOR EACH ROW
--     EXECUTE FUNCTION update_updated_at_column();

-- -- ------------------------------------------------------------------------------------------------

-- -- Create a pivot table to connect reviews to media
-- CREATE TABLE public.review_media (
--     id uuid NOT NULL DEFAULT uuid_generate_v4(),
--     review_id uuid NOT NULL REFERENCES public.location_reviews(id) ON DELETE CASCADE,
--     media_id uuid NOT NULL REFERENCES public.media(id) ON DELETE CASCADE,
--     display_order int DEFAULT 0,
--     created_at timestamp with time zone DEFAULT now(),
--     CONSTRAINT review_media_pkey PRIMARY KEY (id),
--     CONSTRAINT unique_review_media UNIQUE (review_id, media_id)
-- );

-- -- Enable row level security for the review_media table
-- ALTER TABLE public.review_media ENABLE ROW LEVEL SECURITY;

-- -- Review media pivot table policies
-- CREATE POLICY "Anyone can read review media connections"
--     ON review_media FOR SELECT
--     TO public
--     USING (true);

-- CREATE POLICY "Users can create media connections for their reviews"
--     ON review_media FOR INSERT
--     TO authenticated
--     WITH CHECK (
--         EXISTS (
--             SELECT 1 FROM location_reviews 
--             WHERE id = review_media.review_id AND user_id = auth.uid()
--         )
--     );

-- CREATE POLICY "Users can delete media connections for their reviews"
--     ON review_media FOR DELETE
--     TO authenticated
--     USING (auth.uid() = review_id);

-- CREATE POLICY "Users can update media connections for their reviews"
--     ON review_media FOR UPDATE
--     TO authenticated
--     USING (auth.uid() = review_id)
--     WITH CHECK (auth.uid() = review_id);

-- -- Create a trigger to automatically update the updated_at column for the review_media table
-- CREATE TRIGGER update_review_media_updated_at
--     BEFORE UPDATE ON review_media
--     FOR EACH ROW
--     EXECUTE FUNCTION update_updated_at_column();

-- -- ------------------------------------------------------------------------------------------------

-- -- Create a type for review parameter names
-- CREATE TYPE public.review_parameter_name AS ENUM ('accessibility', 'safety', 'atmosphere');

-- -- Create a table for review parameter ratings (for future use with accessibility, safety, etc.)
-- CREATE TABLE public.review_parameters (
--     id uuid NOT NULL DEFAULT uuid_generate_v4(),
--     review_id uuid NOT NULL REFERENCES public.location_reviews(id) ON DELETE CASCADE,
--     parameter_name public.review_parameter_name NOT NULL,
--     rating rating_value NOT NULL,
--     created_at timestamp with time zone DEFAULT now(),
--     updated_at timestamp with time zone DEFAULT now(),
--     CONSTRAINT review_parameters_pkey PRIMARY KEY (id),
--     CONSTRAINT unique_review_parameter UNIQUE (review_id, parameter_name)
-- );

-- -- Enable row level security for the review_parameters table
-- ALTER TABLE public.review_parameters ENABLE ROW LEVEL SECURITY;

-- -- Review parameters policies
-- CREATE POLICY "Anyone can read review parameters"
--     ON review_parameters FOR SELECT
--     TO public
--     USING (true);

-- CREATE POLICY "Users can create parameters for their reviews"
--     ON review_parameters FOR INSERT
--     TO authenticated
--     WITH CHECK (
--         EXISTS (
--             SELECT 1 FROM location_reviews 
--             WHERE id = review_parameters.review_id AND user_id = auth.uid()
--         )
--     );

-- CREATE POLICY "Users can update their review parameters"
--     ON review_parameters FOR UPDATE
--     TO authenticated
--     USING (
--         EXISTS (
--             SELECT 1 FROM location_reviews 
--             WHERE id = review_parameters.review_id AND user_id = auth.uid()
--         )
--     )
--     WITH CHECK (
--         EXISTS (
--             SELECT 1 FROM location_reviews 
--             WHERE id = review_parameters.review_id AND user_id = auth.uid()
--         )
--     );

-- CREATE POLICY "Users can delete their review parameters"
--     ON review_parameters FOR DELETE
--     TO authenticated
--     USING (
--         EXISTS (
--             SELECT 1 FROM location_reviews 
--             WHERE id = review_parameters.review_id AND user_id = auth.uid()
--         )
--     );

-- -- Create a trigger to automatically update the updated_at column for the review_parameters table
-- CREATE TRIGGER update_review_parameters_updated_at
--     BEFORE UPDATE ON review_parameters
--     FOR EACH ROW
--     EXECUTE FUNCTION update_updated_at_column();

-- -- ------------------------------------------------------------------------------------------------

-- -- Create a materialized view for location review stats
-- CREATE MATERIALIZED VIEW location_review_stats AS
-- SELECT 
--     location_id,
--     ROUND(AVG(CASE 
--         WHEN rating = '1' THEN 1
--         WHEN rating = '2' THEN 2
--         WHEN rating = '3' THEN 3
--         WHEN rating = '4' THEN 4
--         WHEN rating = '5' THEN 5
--     END), 2) as average_rating,
--     COUNT(*) as total_ratings
-- FROM location_reviews
-- GROUP BY location_id;

-- -- Add index to materialized view for better performance
-- CREATE INDEX idx_location_review_stats_location_id ON location_review_stats(location_id);

-- -- Create function to refresh materialized view
-- CREATE OR REPLACE FUNCTION refresh_location_review_stats()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     REFRESH MATERIALIZED VIEW location_review_stats;
--     RETURN NULL;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- Create trigger to refresh materialized view when reviews change
-- CREATE TRIGGER refresh_location_review_stats_trigger
-- AFTER INSERT OR UPDATE OR DELETE ON location_reviews
-- FOR EACH STATEMENT
-- EXECUTE FUNCTION refresh_location_review_stats();

-- -- ------------------------------------------------------------------------------------------------

-- -- Add indexes for frequently queried columns
-- CREATE INDEX idx_locations_coordinates ON public.locations USING GIST(coordinates);
-- CREATE INDEX idx_location_reviews_location_id ON public.location_reviews(location_id);
-- CREATE INDEX idx_location_reviews_user_id ON public.location_reviews(user_id);
-- CREATE INDEX idx_review_media_review_id ON public.review_media(review_id);
-- CREATE INDEX idx_review_parameters_review_id ON public.review_parameters(review_id);
