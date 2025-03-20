-- -- Seed data for Roamr App
-- -- This seeder populates the database with sample data

-- -- ------------------------------------------------------------------------------------------------
-- -- First, insert some test users
-- -- Note: In a real Supabase project, you would typically create these users through the auth API
-- -- These are placeholder UUIDs for test users
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES
  ('d0d54cc1-32f7-4eaa-9e3b-b27cde9f3b18', 'alice@example.com', '{"name": "Alice Smith"}'),
  ('27dfe806-85e5-492c-8f3c-1b8be9301d3c', 'bob@example.com', '{"name": "Bob Johnson"}'),
  ('6bc9148f-c74d-429e-afb5-62c0f9b08de4', 'charlie@example.com', '{"name": "Charlie Brown"}'),
  ('0c31d49c-5cb3-4cfa-a7b0-9dbcb8d89e68', 'diana@example.com', '{"name": "Diana Prince"}')
ON CONFLICT DO NOTHING;

-- -- ------------------------------------------------------------------------------------------------
-- -- Insert sample locations
INSERT INTO public.locations (
  id, name, description, longitude, latitude, 
  address, city, country, tags, safety_info, 
  accessibility, creator_id, verification_status
)
VALUES
  (
    'a4d345b9-caf4-4d4f-8d2d-64c89d2c3fff', 
    'Golden Gate Park', 
    'A large urban park with beautiful gardens, museums, and recreational areas.',
    -122.4869, 37.7695,
    '501 Stanyan St', 'San Francisco', 'United States',
    ARRAY['park', 'nature', 'museums', 'recreation'],
    'Well-lit paths, regular park ranger patrols, emergency phones available.',
    'Most areas wheelchair accessible, ADA compliant restrooms, accessible parking spots.',
    'd0d54cc1-32f7-4eaa-9e3b-b27cde9f3b18',
    'verified'
  ),
  (
    'bce78991-d7c0-4243-8424-af16dcbaca1b',
    'Mount Tamalpais',
    'Scenic mountain with hiking trails offering stunning views of the Bay Area.',
    -122.5964, 37.9246,
    NULL, 'Mill Valley', 'United States',
    ARRAY['mountain', 'hiking', 'nature', 'views'],
    'Limited cell reception in some areas, bring sufficient water and sun protection.',
    'Most trails not wheelchair accessible, some accessible viewpoints available at visitor centers.',
    '27dfe806-85e5-492c-8f3c-1b8be9301d3c',
    'verified'
  ),
  (
    'c0e9b198-8ca2-4a0d-9703-836e84f3a82b',
    'Fisherman''s Wharf',
    'Popular waterfront area with seafood restaurants, shops, and sea lion viewing.',
    -122.4169, 37.8083,
    'Beach Street & The Embarcadero', 'San Francisco', 'United States',
    ARRAY['waterfront', 'tourist', 'shopping', 'food'],
    'Crowded area, keep belongings secure and be aware of surroundings.',
    'Wheelchair accessible boardwalk and most restaurants and shops are accessible.',
    '6bc9148f-c74d-429e-afb5-62c0f9b08de4',
    'verified'
  ),
  (
    'd1f0c339-9d71-4f2b-a8e5-94bcf9427d12',
    'Muir Woods',
    'Ancient redwood forest with towering trees and serene hiking trails.',
    -122.5717, 37.8912,
    '1 Muir Woods Rd', 'Mill Valley', 'United States',
    ARRAY['forest', 'hiking', 'nature', 'redwoods'],
    'Stay on designated trails, check park hours as gates close at sunset.',
    'Main trail loop is wheelchair accessible and boardwalked.',
    '0c31d49c-5cb3-4cfa-a7b0-9dbcb8d89e68',
    'verified'
  ),
  (
    'e2f1d440-ae82-4b53-9f69-05ab7cef3b23',
    'Hidden Beach Cove',
    'A secluded beach with unique rock formations and tide pools.',
    -122.5129, 37.7925,
    NULL, 'Pacifica', 'United States',
    ARRAY['beach', 'ocean', 'secluded', 'tidepools'],
    'Watch for high tides, rocky terrain can be slippery.',
    'Difficult access via steep trail, not wheelchair accessible.',
    'd0d54cc1-32f7-4eaa-9e3b-b27cde9f3b18',
    'pending'
  );

-- -- ------------------------------------------------------------------------------------------------
-- Insert sample media
INSERT INTO public.media (
  id, media_type, media_url, caption, uploaded_by
)
VALUES
  (
    'f3d2e541-bf93-4564-98a6-ac7eb590ef24',
    'photo',
    'https://example.com/images/golden_gate_park1.jpg',
    'Conservatory of Flowers in full bloom',
    'd0d54cc1-32f7-4eaa-9e3b-b27cde9f3b18'
  ),
  (
    '44e3f652-ca04-5675-09b7-bd8fc691f435',
    'photo',
    'https://example.com/images/golden_gate_park2.jpg',
    'Japanese Tea Garden bridge',
    'd0d54cc1-32f7-4eaa-9e3b-b27cde9f3b18'
  ),
  (
    '55f4a763-db15-6786-10c8-ce94d702a446',
    'video',
    'https://example.com/videos/mount_tam_summit.mp4',
    'Panoramic view from East Peak',
    '27dfe806-85e5-492c-8f3c-1b8be9301d3c'
  ),
  (
    '66a5b874-ec26-7897-21d9-df05e813b557',
    'photo',
    'https://example.com/images/fishermans_wharf.jpg',
    'Sea lions at Pier 39',
    '6bc9148f-c74d-429e-afb5-62c0f9b08de4'
  ),
  (
    '77b6c985-fd37-8908-32e0-ea16f924c668',
    'photo',
    'https://example.com/images/muir_woods1.jpg',
    'Cathedral Grove redwoods',
    '0c31d49c-5cb3-4cfa-a7b0-9dbcb8d89e68'
  ),
  (
    '88c7d096-ae48-9019-43f1-fb27a035d779',
    'photo',
    'https://example.com/images/muir_woods2.jpg',
    'Redwood Creek',
    '0c31d49c-5cb3-4cfa-a7b0-9dbcb8d89e68'
  ),
  (
    '99d8e107-bf59-0120-54a2-ac38b146e880',
    'photo',
    'https://example.com/images/hidden_beach.jpg',
    'Sunset at Hidden Beach Cove',
    'd0d54cc1-32f7-4eaa-9e3b-b27cde9f3b18'
  );

-- -- ------------------------------------------------------------------------------------------------
-- -- Insert sample location reviews
-- INSERT INTO public.location_reviews (
--   id, location_id, user_id, title, rating, comment, helpful_votes, visit_date
-- )
-- VALUES
--   (
--     'a0e9f218-ca60-1231-65b3-bd4fc257fa91',
--     'a4d345b9-caf4-4d4f-8d2d-64c89d2c3fff', -- Golden Gate Park
--     '27dfe806-85e5-492c-8f3c-1b8be9301d3c', -- Bob
--     'Perfect Day at the Park',
--     '5',
--     'Spent the whole day exploring Golden Gate Park. The Conservatory of Flowers was spectacular and the Japanese Tea Garden was peaceful and beautiful. Highly recommend renting bikes to see everything!',
--     5,
--     '2023-06-15'
--   ),
--   (
--     'b1f0a329-db71-2342-76c4-ce5ad368ab02',
--     'a4d345b9-caf4-4d4f-8d2d-64c89d2c3fff', -- Golden Gate Park
--     '6bc9148f-c74d-429e-afb5-62c0f9b08de4', -- Charlie
--     'Great for Families',
--     '4',
--     'Lots of activities for kids and adults alike. The de Young Museum was excellent. Would have given 5 stars but some areas were closed for maintenance.',
--     2,
--     '2023-07-22'
--   ),
--   (
--     'c2a1b430-ec82-3453-87d5-df6be479bc13',
--     'bce78991-d7c0-4243-8424-af16dcbaca1b', -- Mount Tamalpais
--     'd0d54cc1-32f7-4eaa-9e3b-b27cde9f3b18', -- Alice
--     'Breathtaking Views',
--     '5',
--     'The hike was challenging but totally worth it for the incredible views at the top. Could see the entire Bay Area on a clear day. Will definitely be back!',
--     7,
--     '2023-05-10'
--   ),
--   (
--     'd3b2c541-fd93-4564-98e6-ea7cf580cd24',
--     'c0e9b198-8ca2-4a0d-9703-836e84f3a82b', -- Fisherman's Wharf
--     '0c31d49c-5cb3-4cfa-a7b0-9dbcb8d89e68', -- Diana
--     'Too Touristy',
--     '3',
--     'Interesting to see the sea lions, but very crowded and overpriced. The seafood was fresh though. Probably wouldn''t go again but worth seeing once.',
--     3,
--     '2023-08-05'
--   ),
--   (
--     'e4c3d652-ae04-5675-09f7-fb8da691de35',
--     'd1f0c339-9d71-4f2b-a8e5-94bcf9427d12', -- Muir Woods
--     '27dfe806-85e5-492c-8f3c-1b8be9301d3c', -- Bob
--     'Magical Forest Experience',
--     '5',
--     'Walking among these ancient redwoods is a truly spiritual experience. Go early to avoid crowds and take the time to simply stand and absorb the quiet majesty of these incredible trees.',
--     10,
--     '2023-04-18'
--   ),
--   (
--     'f5d4e763-bf15-6786-10a8-ac9eb702ef46',
--     'd1f0c339-9d71-4f2b-a8e5-94bcf9427d12', -- Muir Woods
--     '6bc9148f-c74d-429e-afb5-62c0f9b08de4', -- Charlie
--     'Natural Wonder',
--     '4',
--     'Beautiful old-growth forest. The boardwalk trail is easy and accessible. Parking can be a nightmare though - make reservations in advance!',
--     4,
--     '2023-09-30'
--   );

-- -- ------------------------------------------------------------------------------------------------
-- -- Insert sample review media connections
-- INSERT INTO public.review_media (
--   id, review_id, media_id, display_order
-- )
-- VALUES
--   (
--     '06e5f874-ca26-7897-21b9-bd0fc813ff57',
--     'a0e9f218-ca60-1231-65b3-bd4fc257fa91', -- Bob's review of Golden Gate Park
--     '44e3f652-ca04-5675-09b7-bd8fc691f435', -- Japanese Tea Garden photo
--     1
--   ),
--   (
--     '17f6a985-db37-8908-32c0-ce1fd924aa68',
--     'c2a1b430-ec82-3453-87d5-df6be479bc13', -- Alice's review of Mount Tamalpais
--     '55f4a763-db15-6786-10c8-ce94d702a446', -- Mount Tam summit video
--     1
--   ),
--   (
--     '28a7b096-ec48-9019-43d1-df2ae035bb79',
--     'd3b2c541-fd93-4564-98e6-ea7cf580cd24', -- Diana's review of Fisherman's Wharf
--     '66a5b874-ec26-7897-21d9-df05e813b557', -- Sea lions photo
--     1
--   ),
--   (
--     '39b8c107-fd59-0120-54e2-ea3bf146cc80',
--     'e4c3d652-ae04-5675-09f7-fb8da691de35', -- Bob's review of Muir Woods
--     '77b6c985-fd37-8908-32e0-ea16f924c668', -- Cathedral Grove photo
--     1
--   ),
--   (
--     '40c9d218-ae60-1231-65f3-fb4ca257dd91',
--     'e4c3d652-ae04-5675-09f7-fb8da691de35', -- Bob's review of Muir Woods
--     '88c7d096-ae48-9019-43f1-fb27a035d779', -- Redwood Creek photo
--     2
--   );

-- -- ------------------------------------------------------------------------------------------------
-- -- Insert sample review parameters
-- INSERT INTO public.review_parameters (
--   id, review_id, parameter_name, rating
-- )
-- VALUES
--   (
--     '51d0e329-bf71-2342-76a4-ac5fb368ee02',
--     'a0e9f218-ca60-1231-65b3-bd4fc257fa91', -- Bob's review of Golden Gate Park
--     'safety',
--     '5'
--   ),
--   (
--     '62e1f430-ca82-3453-87b5-bd6ac479ff13',
--     'a0e9f218-ca60-1231-65b3-bd4fc257fa91', -- Bob's review of Golden Gate Park
--     'accessibility',
--     '4'
--   ),
--   (
--     '73f2a541-db93-4564-98c6-ce7bd580aa24',
--     'c2a1b430-ec82-3453-87d5-df6be479bc13', -- Alice's review of Mount Tamalpais
--     'safety',
--     '3'
--   ),
--   (
--     '84a3b652-ec04-5675-09d7-df8ce691bb35',
--     'c2a1b430-ec82-3453-87d5-df6be479bc13', -- Alice's review of Mount Tamalpais
--     'atmosphere',
--     '5'
--   ),
--   (
--     '95b4c763-fd15-6786-10e8-ea9df702cc46',
--     'd3b2c541-fd93-4564-98e6-ea7cf580cd24', -- Diana's review of Fisherman's Wharf
--     'accessibility',
--     '5'
--   ),
--   (
--     'a6c5d874-ae26-7897-21f9-fb0ea813dd57',
--     'd3b2c541-fd93-4564-98e6-ea7cf580cd24', -- Diana's review of Fisherman's Wharf
--     'atmosphere',
--     '2'
--   ),
--   (
--     'b7d6e985-bf37-8908-32a0-ac1fb924ee68',
--     'e4c3d652-ae04-5675-09f7-fb8da691de35', -- Bob's review of Muir Woods
--     'accessibility',
--     '4'
--   ),
--   (
--     'c8e7f096-ca48-9019-43b1-bd2ac035ff79',
--     'e4c3d652-ae04-5675-09f7-fb8da691de35', -- Bob's review of Muir Woods
--     'safety',
--     '5'
--   ),
--   (
--     'd9f8a107-db59-0120-54c2-ce3bd146aa80',
--     'e4c3d652-ae04-5675-09f7-fb8da691de35', -- Bob's review of Muir Woods
--     'atmosphere',
--     '5'
--   );

-- -- Refresh the materialized view to include our seed data
-- REFRESH MATERIALIZED VIEW location_review_stats;
