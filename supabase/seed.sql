insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, 
    last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, 
    email_change, email_change_token_new, recovery_token
)
values (
    '00000000-0000-0000-0000-000000000000', '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611', 'authenticated',
    'authenticated', 'john@example.com', crypt ('johnpassword', gen_salt ('bf')), current_timestamp,
    current_timestamp, current_timestamp, '{"provider":"email","providers":["email"]}', '{}', 
    current_timestamp, current_timestamp, '', '', '', ''
);

insert into public.locations (
    name, 
    description, 
    longitude,
    latitude,
    address, 
    city, 
    country, 
    tags, 
    safety_info, 
    accessibility, 
    creator_id
)
values (
    'Golden Gate Bridge Welcome Center',
    'Iconic viewpoint of San Francisco''s most famous landmark. This spot offers stunning views of the Golden Gate Bridge, San Francisco Bay, and Marin Headlands. Perfect for photography, especially during sunset or when the fog rolls in.',
    -122.4785,
    37.8077,
    '210 Lincoln Boulevard',
    'San Francisco',
    'United States',
    ARRAY['landmark', 'viewpoint', 'photography', 'tourist-attraction', 'hiking'],
    'Well-maintained area with regular park ranger patrols. Can be windy and foggy; bring appropriate clothing. Parking available but fills up quickly during peak hours.',
    'Accessible viewing areas and paved paths available. Visitor center has wheelchair access and accessible restrooms.',
    '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611'::uuid
);

insert into public.location_images (location_id, image_url, uploaded_by)
values (
    (select id from public.locations where name = 'Golden Gate Bridge Welcome Center'),
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
    '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611'::uuid
);

insert into public.location_ratings (
    location_id,
    user_id,
    rating,
    comment
)
values (
    (select id from public.locations where name = 'Golden Gate Bridge Welcome Center'),
    '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611'::uuid,
    '5',
    'One of the best spots to photograph the bridge! The visitor center is informative and the views are spectacular at any time of day.'
);

-- Eiffel Tower, Paris
insert into public.locations (
    name, 
    description, 
    longitude,
    latitude,
    address, 
    city, 
    country, 
    tags, 
    safety_info, 
    accessibility, 
    creator_id
)
values (
    'Eiffel Tower',
    'The iconic iron tower on the Champ de Mars, offering stunning views of Paris.',
    2.2945,
    48.8584,
    'Champ de Mars, 5 Avenue Anatole France',
    'Paris',
    'France',
    ARRAY['landmark', 'tourist-attraction', 'historical'],
    'Well-lit area with regular security patrols. Crowded during peak hours.',
    'Elevator access available. Some areas may have limited wheelchair accessibility.',
    '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611'::uuid
);

-- Shibuya Crossing, Tokyo
insert into public.locations (
    name, 
    description, 
    longitude,
    latitude,
    address, 
    city, 
    country, 
    tags, 
    safety_info, 
    accessibility, 
    creator_id
)
values (
    'Shibuya Crossing',
    'The world''s busiest pedestrian crossing, surrounded by bright lights and screens.',
    139.7003,
    35.6595,
    '2-chōme-2-1 Dōgenzaka',
    'Tokyo',
    'Japan',
    ARRAY['urban', 'city-life', 'photography'],
    'Very safe area with police presence. Crowded at all times.',
    'Street level crossing with tactile paving for visually impaired.',
    '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611'::uuid
);

-- Bondi Beach, Sydney
insert into public.locations (
    name, 
    description, 
    longitude,
    latitude,
    address, 
    city, 
    country, 
    tags, 
    safety_info, 
    accessibility, 
    creator_id
)
values (
    'Bondi Beach',
    'Famous Australian beach known for its golden sand and perfect waves.',
    151.2744,
    -33.8915,
    'Queen Elizabeth Drive',
    'Sydney',
    'Australia',
    ARRAY['beach', 'surfing', 'outdoor'],
    'Lifeguards on duty during daytime. Follow beach safety flags.',
    'Beach wheelchair available upon request. Accessible facilities available.',
    '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611'::uuid
);

-- Central Park, New York
insert into public.locations (
    name, 
    description, 
    longitude,
    latitude,
    address, 
    city, 
    country, 
    tags, 
    safety_info, 
    accessibility, 
    creator_id
)
values (
    'Central Park',
    'An urban oasis in the heart of Manhattan, featuring lakes, gardens, and walking trails.',
    -73.9654,
    40.7829,
    '59th to 110th Street',
    'New York',
    'United States',
    ARRAY['park', 'nature', 'recreation'],
    'Well-patrolled area. Stay on marked paths after dark.',
    'Most areas accessible by wheelchair. Paved paths throughout.',
    '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611'::uuid
);

-- Machu Picchu, Peru
insert into public.locations (
    name, 
    description, 
    longitude,
    latitude,
    address, 
    city, 
    country, 
    tags, 
    safety_info, 
    accessibility, 
    creator_id
)
values (
    'Machu Picchu',
    'Ancient Incan citadel set high in the Andes Mountains.',
    -72.5450,
    -13.1631,
    'Machu Picchu Mountain',
    'Cusco',
    'Peru',
    ARRAY['historical', 'hiking', 'unesco'],
    'High altitude location. Acclimatization recommended. Guide recommended.',
    'Challenging terrain. Limited accessibility for mobility-impaired visitors.',
    '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611'::uuid
);

-- Santorini, Greece
insert into public.locations (
    name, 
    description, 
    longitude,
    latitude,
    address, 
    city, 
    country, 
    tags, 
    safety_info, 
    accessibility, 
    creator_id
)
values (
    'Oia Sunset Point',
    'Famous viewpoint for watching stunning sunsets over the Aegean Sea.',
    25.3760,
    36.4618,
    'Oia Castle',
    'Santorini',
    'Greece',
    ARRAY['sunset', 'views', 'romantic'],
    'Crowded during sunset hours. Watch your step on narrow paths.',
    'Some steep steps and narrow paths. Limited wheelchair access.',
    '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611'::uuid
);

-- Victoria Falls, Zimbabwe
insert into public.locations (
    name, 
    description, 
    longitude,
    latitude,
    address, 
    city, 
    country, 
    tags, 
    safety_info, 
    accessibility, 
    creator_id
)
values (
    'Victoria Falls',
    'One of the world''s largest waterfalls, known locally as ''The Smoke that Thunders''.',
    25.8572,
    -17.9243,
    'Victoria Falls National Park',
    'Victoria Falls',
    'Zimbabwe',
    ARRAY['waterfall', 'nature', 'adventure'],
    'Stay on designated viewing paths. Raincoats recommended.',
    'Main viewpoints accessible via paved paths. Some areas require climbing.',
    '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611'::uuid
);

-- Northern Lights Viewpoint, Iceland
insert into public.locations (
    name, 
    description, 
    longitude,
    latitude,
    address, 
    city, 
    country, 
    tags, 
    safety_info, 
    accessibility, 
    creator_id
)
values (
    'Aurora Center',
    'Prime viewing location for the Northern Lights near Reykjavik.',
    -21.9303,
    64.1283,
    'Grótta Island Lighthouse',
    'Reykjavik',
    'Iceland',
    ARRAY['aurora', 'night-sky', 'nature'],
    'Dress warmly. Check weather conditions before visiting.',
    'Parking area nearby. Short walk to viewing point.',
    '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611'::uuid
);

-- Great Wall, China
insert into public.locations (
    name, 
    description, 
    longitude,
    latitude,
    address, 
    city, 
    country, 
    tags, 
    safety_info, 
    accessibility, 
    creator_id
)
values (
    'Mutianyu Great Wall',
    'Well-preserved section of the Great Wall with stunning mountain views.',
    116.5681,
    40.4319,
    'Mutianyu Road',
    'Beijing',
    'China',
    ARRAY['historical', 'hiking', 'unesco'],
    'Stay on designated paths. Cable car available.',
    'Cable car provides easier access. Some sections steep and challenging.',
    '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611'::uuid
);

-- Add corresponding images for each location
insert into public.location_images (location_id, image_url, uploaded_by)
values
    ((select id from public.locations where name = 'Eiffel Tower'),
     'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f',
     '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611'::uuid),
    ((select id from public.locations where name = 'Shibuya Crossing'),
     'https://images.unsplash.com/photo-1542051841857-5f90071e7989',
     '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611'::uuid),
    ((select id from public.locations where name = 'Bondi Beach'),
     'https://images.unsplash.com/photo-1578500494198-246f612d3b3d',
     '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611'::uuid),
    ((select id from public.locations where name = 'Central Park'),
     'https://images.unsplash.com/photo-1623593419606-7f9c8c22d736',
     '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611'::uuid),
    ((select id from public.locations where name = 'Machu Picchu'),
     'https://images.unsplash.com/photo-1526392060635-9d6019884377',
     '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611'::uuid),
    ((select id from public.locations where name = 'Oia Sunset Point'),
     'https://images.unsplash.com/photo-1533105079780-92b9be482077',
     '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611'::uuid),
    ((select id from public.locations where name = 'Victoria Falls'),
     'https://images.unsplash.com/photo-1544735716-392fe2489ffa',
     '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611'::uuid),
    ((select id from public.locations where name = 'Aurora Center'),
     'https://images.unsplash.com/photo-1579033461380-adb47c3eb938',
     '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611'::uuid),
    ((select id from public.locations where name = 'Mutianyu Great Wall'),
     'https://images.unsplash.com/photo-1508804052814-cd3ba865a116',
     '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611'::uuid);

-- Add ratings for each location
insert into public.location_ratings (location_id, user_id, rating, comment)
values
    ((select id from public.locations where name = 'Eiffel Tower'),
     '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611'::uuid,
     '5',
     'Magical at night with the light show!'),
    ((select id from public.locations where name = 'Shibuya Crossing'),
     '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611'::uuid,
     '4',
     'Incredible energy and atmosphere'),
    ((select id from public.locations where name = 'Bondi Beach'),
     '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611'::uuid,
     '5',
     'Perfect beach day spot'),
    ((select id from public.locations where name = 'Central Park'),
     '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611'::uuid,
     '4',
     'Beautiful in all seasons'),
    ((select id from public.locations where name = 'Machu Picchu'),
     '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611'::uuid,
     '5',
     'Breathtaking ancient wonder'),
    ((select id from public.locations where name = 'Oia Sunset Point'),
     '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611'::uuid,
     '5',
     'Most beautiful sunset ever'),
    ((select id from public.locations where name = 'Victoria Falls'),
     '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611'::uuid,
     '5',
     'The power of nature is incredible here'),
    ((select id from public.locations where name = 'Aurora Center'),
     '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611'::uuid,
     '4',
     'Amazing when the conditions are right'),
    ((select id from public.locations where name = 'Mutianyu Great Wall'),
     '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611'::uuid,
     '5',
     'Less crowded than other sections, fantastic views');