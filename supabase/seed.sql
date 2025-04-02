-- Seed data for Roamr App
-- This seeder populates the database with sample data

-- ------------------------------------------------------------------------------------------------
-- First, insert some test users
-- Note: In a real Supabase project, you would typically create these users through the auth API
-- These are placeholder UUIDs for test users
insert into auth.users (id, email, raw_user_meta_data)
values
  ('d0d54cc1-32f7-4eaa-9e3b-b27cde9f3b18', 'alice@example.com', '{"name": "Alice Smith"}'),
  ('27dfe806-85e5-492c-8f3c-1b8be9301d3c', 'bob@example.com', '{"name": "Bob Johnson"}'),
  ('6bc9148f-c74d-429e-afb5-62c0f9b08de4', 'charlie@example.com', '{"name": "Charlie Brown"}'),
  ('0c31d49c-5cb3-4cfa-a7b0-9dbcb8d89e68', 'diana@example.com', '{"name": "Diana Prince"}')
on conflict do nothing;

-- -- ------------------------------------------------------------------------------------------------
-- -- Insert sample locations
insert into public.locations (id, name, description, country, city, longitude, latitude, tags, creator_id)
values
  (
    'a4d345b9-caf4-4d4f-8d2d-64c89d2c3fff',
    'Pripyat Amusement Park',
    'Located in the ghost town of Pripyat, Ukraine, this amusement park was set to open in May 1986 but was abandoned after the Chernobyl nuclear disaster. The Ferris wheel and bumper cars remain eerie relics of a city evacuated overnight.',
    'Ukraine',
    'Pripyat',
    30.0561,
    51.4080,
    array['park', 'spooky', 'abandoned', 'industrial'],
    'd0d54cc1-32f7-4eaa-9e3b-b27cde9f3b18'
  ),
  (
    'bce78991-d7c0-4243-8424-af16dcbaca1b',
    'Hashima Island (Gunkanjima)',
    'Off the coast of Nagasaki, Japan, this small island was once a bustling coal mining community. Abandoned in 1974, its decaying concrete buildings and sea walls give it a battleship-like silhouette, making it a UNESCO World Heritage Site and urbex hotspot.',
    'Japan',
    'Nagasaki',
    129.7386,
    32.6278,
    array['island', 'industrial', 'spooky', 'historical'],
    '27dfe806-85e5-492c-8f3c-1b8be9301d3c'
  ),
  (
    'c0e9b198-8ca2-4a0d-9703-836e84f3a82b',
    'Beelitz-Heilstätten Hospital',
    'A sprawling sanatorium complex in Germany, originally built in the late 19th century to treat tuberculosis patients. It later served as a military hospital during World Wars I and II and was abandoned in the 1990s, leaving behind haunting wards and surgical rooms.',
    'Germany',
    'Beelitz',
    12.9165,
    52.2596,
    array['hospital', 'spooky', 'historical', 'forest'],
    '6bc9148f-c74d-429e-afb5-62c0f9b08de4'
  ),
  (
    'd1f0c339-9d71-4f2b-a8e5-94bcf9427d12',
    'Eastern State Penitentiary',
    'Located in Philadelphia, USA, this former prison operated from 1829 until 1971. Its gothic architecture and radial design, now crumbling and overgrown, make it a prime urbex destination, open to the public as a historic site.',
    'USA',
    'Philadelphia',
    -75.1727,
    39.9683,
    array['prison', 'historical', 'spooky', 'urban'],
    '0c31d49c-5cb3-4cfa-a7b0-9dbcb8d89e68'
  ),
  (
    'e2f1d440-ae82-4b53-9f69-05ab7cef3b23',
    'Mirny Diamond Mine',
    'In Siberia, Russia, this massive open-pit diamond mine was abandoned after operations ceased in the early 2000s. The second-largest man-made hole in the world, it''s a surreal industrial relic surrounded by desolate tundra.',
    'Russia',
    'Mirny',
    113.9931,
    62.5292,
    array['industrial', 'spooky', 'remote', 'mine'],
    'd0d54cc1-32f7-4eaa-9e3b-b27cde9f3b18'
  ),
  (
    '343ac7b6-cb1d-4309-a164-3ef27602e646',
    'Kolmanskop',
    'A ghost town in the Namib Desert, Namibia, once a thriving diamond mining settlement in the early 20th century. Abandoned in the 1950s, its German-style buildings are now half-buried in sand, offering a hauntingly beautiful urbex experience.',
    'Namibia',
    'Kolmanskop',
    15.2338,
    -26.7045,
    array['desert', 'spooky', 'historical', 'abandoned'],
    '27dfe806-85e5-492c-8f3c-1b8be9301d3c'
  ),
  (
    '0fb47222-1120-4b44-adad-49d62ea0e945',
    'Bannerman Castle',
    'On Pollepel Island in the Hudson River, New York, USA, this abandoned military surplus warehouse was built in the early 1900s by Francis Bannerman. Partially destroyed by fire and weather, its ruins are a picturesque urbex site.',
    'USA',
    'New York',
    -73.9890,
    41.4559,
    array['castle', 'island', 'historical', 'ruins'],
    '6bc9148f-c74d-429e-afb5-62c0f9b08de4'
  ),
  (
    '7a6c8e34-dbdb-4bf8-934b-692c1205d409',
    'Maunsell Sea Forts',
    'Off the coast of England in the Thames Estuary, these World War II-era anti-aircraft towers stand on stilts above the sea. Abandoned since the 1950s, they''re rusting relics accessible only by boat, offering a unique maritime urbex adventure.',
    'England',
    'Thames Estuary',
    0.9861,
    51.4625,
    array['military', 'spooky', 'sea', 'industrial'],
    '0c31d49c-5cb3-4cfa-a7b0-9dbcb8d89e68'
  ),
  (
    '995f317f-a486-4d6e-8ed5-dd42be40f692',
    'Oradour-sur-Glane',
    'A village in France left as a memorial after a Nazi massacre in 1944 killed most of its inhabitants. The ruins, including rusted cars and crumbling homes, remain untouched as a haunting reminder of history.',
    'France',
    'Oradour-sur-Glane',
    1.0327,
    45.9331,
    array['village', 'historical', 'spooky', 'war'],
    'd0d54cc1-32f7-4eaa-9e3b-b27cde9f3b18'
  ),
  (
    '5774d520-9dad-44a4-94ef-5bae6b804de9',
    'Buzludzha Monument',
    'Perched atop a mountain in Bulgaria, this futuristic, UFO-shaped structure was built in 1981 as a Communist Party headquarters. Abandoned after the fall of the Soviet Union, its decaying interior features mosaics and a panoramic view.',
    'Bulgaria',
    'Buzludzha',
    25.3936,
    42.7358,
    array['mountain', 'historical', 'spooky', 'monument'],
    '27dfe806-85e5-492c-8f3c-1b8be9301d3c'
  );

-- -- ------------------------------------------------------------------------------------------------
-- Insert sample media
insert into public.location_media (location_id, media_type, media_url, caption, uploaded_by)
values
  (
    'a4d345b9-caf4-4d4f-8d2d-64c89d2c3fff',
    'photo',
    'https://meanderingwild.com/wp-content/uploads/2020/03/fairground-wheel-683x1024.jpg',
    'photo caption',
    'd0d54cc1-32f7-4eaa-9e3b-b27cde9f3b18'
  ),
  (
    'bce78991-d7c0-4243-8424-af16dcbaca1b',
    'photo',
    'https://www.nagasaki-tabinet.com/storage/tourism_attractions/51797/responsive_images/2yYVRIinzGwIyyeJIQjg1AEEpvQWGm0v0AeHg4aX__1673_1116.jpeg',
    'photo caption',
    '27dfe806-85e5-492c-8f3c-1b8be9301d3c'
  ),
  (
    'c0e9b198-8ca2-4a0d-9703-836e84f3a82b',
    'photo',
    'https://images.squarespace-cdn.com/content/v1/61505c55c04b0a138b337894/4c49386d-ece6-4c73-80d4-cb3773b0a226/long-corridors-at-beelitz-heilstaetten.jpeg',
    'photo caption',
    '6bc9148f-c74d-429e-afb5-62c0f9b08de4'
  ),
  (
    'd1f0c339-9d71-4f2b-a8e5-94bcf9427d12',
    'photo',
    'https://www.easternstate.org/sites/easternstate/files/2019-01/homepage-mobile-header.jpg',
    'photo caption',
    '0c31d49c-5cb3-4cfa-a7b0-9dbcb8d89e68'
  ),
  (
    'e2f1d440-ae82-4b53-9f69-05ab7cef3b23',
    'photo',
    'https://i.insider.com/5d41aef1100a2417c432c528?width=800&format=jpeg&auto=webp',
    'photo caption',
    'd0d54cc1-32f7-4eaa-9e3b-b27cde9f3b18'
  ),
  (
    '343ac7b6-cb1d-4309-a164-3ef27602e646',
    'photo',
    'https://travelationship.com/wp-content/uploads/2022/03/fi-kolmanskop.jpg',
    'photo caption',
    '27dfe806-85e5-492c-8f3c-1b8be9301d3c'
  ),
  (
    '0fb47222-1120-4b44-adad-49d62ea0e945',
    'photo',
    'https://www.travelingfoundlove.com/wp-content/uploads/2023/03/Bannerman-Castle-Viewpoint.jpg',
    'photo caption',
    '6bc9148f-c74d-429e-afb5-62c0f9b08de4'
  ),
  (
    '7a6c8e34-dbdb-4bf8-934b-692c1205d409',
    'photo',
    'https://www.designingbuildings.co.uk/w/images/b/b2/MaunsellForts.jpg',
    'photo caption',
    '0c31d49c-5cb3-4cfa-a7b0-9dbcb8d89e68'
  ),
  (
    '995f317f-a486-4d6e-8ed5-dd42be40f692',
    'photo',
    'https://www.nationalww2museum.org/sites/default/files/styles/wide_large/public/2018-11/4.%20ouradour.png',
    'photo caption',
    'd0d54cc1-32f7-4eaa-9e3b-b27cde9f3b18'
  ),
  (
    '5774d520-9dad-44a4-94ef-5bae6b804de9',
    'photo',
    'https://www.kathmanduandbeyond.com/wp-content/uploads/2019/09/Buzludzha-Monument-Buzludzha-Bulgaria-15.jpg',
    'photo caption',
    '27dfe806-85e5-492c-8f3c-1b8be9301d3c'
  );

update public.locations set featured_image = 'https://meanderingwild.com/wp-content/uploads/2020/03/fairground-wheel-683x1024.jpg' where id = 'a4d345b9-caf4-4d4f-8d2d-64c89d2c3fff';
update public.locations set featured_image = 'https://www.nagasaki-tabinet.com/storage/tourism_attractions/51797/responsive_images/2yYVRIinzGwIyyeJIQjg1AEEpvQWGm0v0AeHg4aX__1673_1116.jpeg' where id = 'bce78991-d7c0-4243-8424-af16dcbaca1b';
update public.locations set featured_image = 'https://images.squarespace-cdn.com/content/v1/61505c55c04b0a138b337894/4c49386d-ece6-4c73-80d4-cb3773b0a226/long-corridors-at-beelitz-heilstaetten.jpeg' where id = 'c0e9b198-8ca2-4a0d-9703-836e84f3a82b';
update public.locations set featured_image = 'https://www.easternstate.org/sites/easternstate/files/2019-01/homepage-mobile-header.jpg' where id = 'd1f0c339-9d71-4f2b-a8e5-94bcf9427d12';
update public.locations set featured_image = 'https://i.insider.com/5d41aef1100a2417c432c528?width=800&format=jpeg&auto=webp' where id = 'e2f1d440-ae82-4b53-9f69-05ab7cef3b23';
update public.locations set featured_image = 'https://travelationship.com/wp-content/uploads/2022/03/fi-kolmanskop.jpg' where id = '343ac7b6-cb1d-4309-a164-3ef27602e646';
update public.locations set featured_image = 'https://www.travelingfoundlove.com/wp-content/uploads/2023/03/Bannerman-Castle-Viewpoint.jpg' where id = '0fb47222-1120-4b44-adad-49d62ea0e945';
update public.locations set featured_image = 'https://www.designingbuildings.co.uk/w/images/b/b2/MaunsellForts.jpg' where id = '7a6c8e34-dbdb-4bf8-934b-692c1205d409';
update public.locations set featured_image = 'https://www.nationalww2museum.org/sites/default/files/styles/wide_large/public/2018-11/4.%20ouradour.png' where id = '995f317f-a486-4d6e-8ed5-dd42be40f692';
update public.locations set featured_image = 'https://www.kathmanduandbeyond.com/wp-content/uploads/2019/09/Buzludzha-Monument-Buzludzha-Bulgaria-15.jpg' where id = '5774d520-9dad-44a4-94ef-5bae6b804de9';

