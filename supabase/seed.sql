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

-- Ensure handle_new_user trigger creates profiles if they don't exist
-- (No explicit profile inserts needed here as the trigger handles it)

-- Seed Locations using the function
-- Note: We use the location description as the initial revision content.
begin;

select create_location_with_revision(
    'Pripyat Amusement Park',
    'Located in the ghost town of Pripyat, Ukraine, this amusement park was set to open in May 1986 but was abandoned after the Chernobyl nuclear disaster. The Ferris wheel and bumper cars remain eerie relics of a city evacuated overnight.',
    '# Pripyat Amusement Park\n\n## History\nLocated in the ghost town of Pripyat, Ukraine, this amusement park was set to open in May 1986 but was abandoned after the Chernobyl nuclear disaster. The Ferris wheel and bumper cars remain eerie relics of a city evacuated overnight.\n\n## Current State\n- The Ferris wheel stands as the park''s most iconic landmark\n- Bumper cars remain frozen in time\n- Overgrown vegetation has reclaimed much of the area\n- High radiation levels still present\n\n## Visiting\n⚠️ **Warning**: This location is within the Chernobyl Exclusion Zone. Special permits and guided tours required.',
    30.0561,
    51.4080,
    array['park', 'spooky', 'abandoned', 'industrial'],
    'd0d54cc1-32f7-4eaa-9e3b-b27cde9f3b18'
);

select create_location_with_revision(
    'Hashima Island (Gunkanjima)',
    'Off the coast of Nagasaki, Japan, this small island was once a bustling coal mining community. Abandoned in 1974, its decaying concrete buildings and sea walls give it a battleship-like silhouette, making it a UNESCO World Heritage Site and urbex hotspot.',
    '# Hashima Island (Gunkanjima)\n\n## Overview\nOff the coast of Nagasaki, Japan, this small island was once a bustling coal mining community. Abandoned in 1974, its decaying concrete buildings and sea walls give it a battleship-like silhouette, making it a UNESCO World Heritage Site and urbex hotspot.\n\n## History\n- Founded in 1887 for coal mining\n- Peak population: 5,259 in 1959\n- Abandoned in 1974\n- Designated UNESCO World Heritage Site in 2015\n\n## Notable Features\n- Concrete sea walls\n- Apartment buildings\n- School ruins\n- Shrine remains\n\n## Visiting\n🚢 Accessible only by authorized boat tours from Nagasaki',
    129.7386,
    32.6278,
    array['island', 'industrial', 'spooky', 'historical'],
    '27dfe806-85e5-492c-8f3c-1b8be9301d3c'
);

select create_location_with_revision(
    'Beelitz-Heilstätten Hospital',
    'A sprawling sanatorium complex in Germany, originally built in the late 19th century to treat tuberculosis patients. It later served as a military hospital during World Wars I and II and was abandoned in the 1990s, leaving behind haunting wards and surgical rooms.',
    '# Beelitz-Heilstätten Hospital\n\n## History\nA sprawling sanatorium complex in Germany, originally built in the late 19th century to treat tuberculosis patients. It later served as a military hospital during World Wars I and II and was abandoned in the 1990s, leaving behind haunting wards and surgical rooms.\n\n## Timeline\n- 1898: Construction begins\n- 1902: Opens as TB sanatorium\n- WWI: Military hospital\n- WWII: Military hospital\n- 1990s: Abandoned\n\n## Notable Features\n- Art Nouveau architecture\n- Surgical theater\n- Patient wards\n- Underground tunnels\n\n## Visiting\n🎫 Guided tours available through official website',
    12.9165,
    52.2596,
    array['hospital', 'spooky', 'historical', 'forest'],
    '6bc9148f-c74d-429e-afb5-62c0f9b08de4'
);

select create_location_with_revision(
    'Eastern State Penitentiary',
    'Located in Philadelphia, USA, this former prison operated from 1829 until 1971. Its gothic architecture and radial design, now crumbling and overgrown, make it a prime urbex destination, open to the public as a historic site.',
    '# Eastern State Penitentiary\n\n## Overview\nLocated in Philadelphia, USA, this former prison operated from 1829 until 1971. Its gothic architecture and radial design, now crumbling and overgrown, make it a prime urbex destination, open to the public as a historic site.\n\n## Historical Significance\n- First true penitentiary in the world\n- Revolutionary radial design\n- Housed Al Capone (1929-1930)\n- Closed in 1971\n\n## Architecture\n- Gothic-style exterior\n- Central rotunda\n- Individual cell blocks\n- Guard towers\n\n## Visiting\n🎫 Open for daily tours and special events\n🌙 Haunted house during Halloween season',
    -75.1727,
    39.9683,
    array['prison', 'historical', 'spooky', 'urban'],
    '0c31d49c-5cb3-4cfa-a7b0-9dbcb8d89e68'
);

select create_location_with_revision(
    'Mirny Diamond Mine',
    'In Siberia, Russia, this massive open-pit diamond mine was abandoned after operations ceased in the early 2000s. The second-largest man-made hole in the world, it''s a surreal industrial relic surrounded by desolate tundra.',
    '# Mirny Diamond Mine\n\n## Overview\nIn Siberia, Russia, this massive open-pit diamond mine was abandoned after operations ceased in the early 2000s. The second-largest man-made hole in the world, it''s a surreal industrial relic surrounded by desolate tundra.\n\n## Specifications\n- Depth: 525 meters\n- Diameter: 1,200 meters\n- Second-largest man-made hole\n- Helicopter flight restrictions\n\n## History\n- Opened: 1957\n- Peak production: 1960s\n- Abandoned: Early 2000s\n\n## Visiting\n⚠️ **Warning**: No public access. Viewing only possible from air or designated viewpoints.',
    113.9931,
    62.5292,
    array['industrial', 'spooky', 'remote', 'mine'],
    'd0d54cc1-32f7-4eaa-9e3b-b27cde9f3b18'
);

select create_location_with_revision(
    'Kolmanskop',
    'A ghost town in the Namib Desert, Namibia, once a thriving diamond mining settlement in the early 20th century. Abandoned in the 1950s, its German-style buildings are now half-buried in sand, offering a hauntingly beautiful urbex experience.',
    '# Kolmanskop\n\n## Overview\nA ghost town in the Namib Desert, Namibia, once a thriving diamond mining settlement in the early 20th century. Abandoned in the 1950s, its German-style buildings are now half-buried in sand, offering a hauntingly beautiful urbex experience.\n\n## History\n- Founded: 1908\n- Peak: 1920s\n- Abandoned: 1956\n\n## Notable Buildings\n- Ballroom\n- Hospital\n- School\n- Casino\n\n## Visiting\n🎫 Guided tours available from Lüderitz\n📸 Photography permits required',
    15.2338,
    -26.7045,
    array['desert', 'spooky', 'historical', 'abandoned'],
    '27dfe806-85e5-492c-8f3c-1b8be9301d3c'
);

select create_location_with_revision(
    'Bannerman Castle',
    'On Pollepel Island in the Hudson River, New York, USA, this abandoned military surplus warehouse was built in the early 1900s by Francis Bannerman. Partially destroyed by fire and weather, its ruins are a picturesque urbex site.',
    '# Bannerman Castle\n\n## Overview\nOn Pollepel Island in the Hudson River, New York, USA, this abandoned military surplus warehouse was built in the early 1900s by Francis Bannerman. Partially destroyed by fire and weather, its ruins are a picturesque urbex site.\n\n## History\n- Built: 1901-1918\n- Fire: 1969\n- Partial collapse: 2009\n\n## Architecture\n- Scottish-style castle design\n- Military warehouse\n- Powder magazine\n- Living quarters\n\n## Visiting\n🚢 Accessible by guided boat tours\n🏰 Foundation working to preserve ruins',
    -73.9890,
    41.4559,
    array['castle', 'island', 'historical', 'ruins'],
    '6bc9148f-c74d-429e-afb5-62c0f9b08de4'
);

select create_location_with_revision(
    'Maunsell Sea Forts',
    'Off the coast of England in the Thames Estuary, these World War II-era anti-aircraft towers stand on stilts above the sea. Abandoned since the 1950s, they''re rusting relics accessible only by boat, offering a unique maritime urbex adventure.',
    '# Maunsell Sea Forts\n\n## Overview\nOff the coast of England in the Thames Estuary, these World War II-era anti-aircraft towers stand on stilts above the sea. Abandoned since the 1950s, they''re rusting relics accessible only by boat, offering a unique maritime urbex adventure.\n\n## History\n- Built: 1942-1943\n- Decommissioned: 1950s\n- Pirate radio use: 1960s\n\n## Structure\n- Seven interconnected towers\n- Living quarters\n- Gun platforms\n- Radar station\n\n## Visiting\n⚠️ **Warning**: Dangerous to access. View from boat tours only.',
    0.9861,
    51.4625,
    array['military', 'spooky', 'sea', 'industrial'],
    '0c31d49c-5cb3-4cfa-a7b0-9dbcb8d89e68'
);

select create_location_with_revision(
    'Oradour-sur-Glane',
    'A village in France left as a memorial after a Nazi massacre in 1944 killed most of its inhabitants. The ruins, including rusted cars and crumbling homes, remain untouched as a haunting reminder of history.',
    '# Oradour-sur-Glane\n\n## Overview\nA village in France left as a memorial after a Nazi massacre in 1944 killed most of its inhabitants. The ruins, including rusted cars and crumbling homes, remain untouched as a haunting reminder of history.\n\n## Tragedy\n- Date: June 10, 1944\n- Victims: 642 people\n- Perpetrators: Waffen-SS\n\n## Memorial Site\n- Preserved ruins\n- Memorial center\n- Cemetery\n- New village nearby\n\n## Visiting\n🎫 Free entry\n🤫 Respectful silence requested',
    1.0327,
    45.9331,
    array['village', 'historical', 'spooky', 'war'],
    'd0d54cc1-32f7-4eaa-9e3b-b27cde9f3b18'
);

select create_location_with_revision(
    'Buzludzha Monument',
    'Perched atop a mountain in Bulgaria, this futuristic, UFO-shaped structure was built in 1981 as a Communist Party headquarters. Abandoned after the fall of the Soviet Union, its decaying interior features mosaics and a panoramic view.',
    '# Buzludzha Monument\n\n## Overview\nPerched atop a mountain in Bulgaria, this futuristic, UFO-shaped structure was built in 1981 as a Communist Party headquarters. Abandoned after the fall of the Soviet Union, its decaying interior features mosaics and a panoramic view.\n\n## History\n- Built: 1974-1981\n- Opened: 1981\n- Abandoned: 1989\n\n## Architecture\n- UFO-like design\n- Concrete and steel construction\n- Mosaic interior\n- 70m tall tower\n\n## Visiting\n⚠️ **Warning**: Dangerous to enter. View from exterior only.\n📸 Popular photography spot',
    25.3936,
    42.7358,
    array['mountain', 'historical', 'spooky', 'monument'],
    '27dfe806-85e5-492c-8f3c-1b8be9301d3c'
);

commit;

-- Add other seed data as needed (e.g., reports, media) below
-- -- ------------------------------------------------------------------------------------------------
-- Insert sample media
insert into public.location_media (location_id, media_type, media_url, caption, uploaded_by)
values
  (
    (select id from public.locations where name = 'Pripyat Amusement Park'),
    'photo',
    'https://meanderingwild.com/wp-content/uploads/2020/03/fairground-wheel-683x1024.jpg',
    'photo caption',
    'd0d54cc1-32f7-4eaa-9e3b-b27cde9f3b18'
  ),
  (
    (select id from public.locations where name = 'Hashima Island (Gunkanjima)'),
    'photo',
    'https://www.nagasaki-tabinet.com/storage/tourism_attractions/51797/responsive_images/2yYVRIinzGwIyyeJIQjg1AEEpvQWGm0v0AeHg4aX__1673_1116.jpeg',
    'photo caption',
    '27dfe806-85e5-492c-8f3c-1b8be9301d3c'
  ),
  (
    (select id from public.locations where name = 'Beelitz-Heilstätten Hospital'),
    'photo',
    'https://images.squarespace-cdn.com/content/v1/61505c55c04b0a138b337894/4c49386d-ece6-4c73-80d4-cb3773b0a226/long-corridors-at-beelitz-heilstaetten.jpeg',
    'photo caption',
    '6bc9148f-c74d-429e-afb5-62c0f9b08de4'
  ),
  (
    (select id from public.locations where name = 'Eastern State Penitentiary'),
    'photo',
    'https://www.easternstate.org/sites/easternstate/files/2019-01/homepage-mobile-header.jpg',
    'photo caption',
    '0c31d49c-5cb3-4cfa-a7b0-9dbcb8d89e68'
  ),
  (
    (select id from public.locations where name = 'Mirny Diamond Mine'),
    'photo',
    'https://i.insider.com/5d41aef1100a2417c432c528?width=800&format=jpeg&auto=webp',
    'photo caption',
    'd0d54cc1-32f7-4eaa-9e3b-b27cde9f3b18'
  ),
  (
    (select id from public.locations where name = 'Kolmanskop'),
    'photo',
    'https://travelationship.com/wp-content/uploads/2022/03/fi-kolmanskop.jpg',
    'photo caption',
    '27dfe806-85e5-492c-8f3c-1b8be9301d3c'
  ),
  (
    (select id from public.locations where name = 'Bannerman Castle'),
    'photo',
    'https://www.travelingfoundlove.com/wp-content/uploads/2023/03/Bannerman-Castle-Viewpoint.jpg',
    'photo caption',
    '6bc9148f-c74d-429e-afb5-62c0f9b08de4'
  ),
  (
    (select id from public.locations where name = 'Maunsell Sea Forts'),
    'photo',
    'https://www.designingbuildings.co.uk/w/images/b/b2/MaunsellForts.jpg',
    'photo caption',
    '0c31d49c-5cb3-4cfa-a7b0-9dbcb8d89e68'
  ),
  (
    (select id from public.locations where name = 'Oradour-sur-Glane'),
    'photo',
    'https://www.nationalww2museum.org/sites/default/files/styles/wide_large/public/2018-11/4.%20ouradour.png',
    'photo caption',
    'd0d54cc1-32f7-4eaa-9e3b-b27cde9f3b18'
  ),
  (
    (select id from public.locations where name = 'Buzludzha Monument'),
    'photo',
    'https://www.kathmanduandbeyond.com/wp-content/uploads/2019/09/Buzludzha-Monument-Buzludzha-Bulgaria-15.jpg',
    'photo caption',
    '27dfe806-85e5-492c-8f3c-1b8be9301d3c'
  );

update public.locations set featured_image = 'https://meanderingwild.com/wp-content/uploads/2020/03/fairground-wheel-683x1024.jpg' where id = (select id from public.locations where name = 'Pripyat Amusement Park');
update public.locations set featured_image = 'https://www.nagasaki-tabinet.com/storage/tourism_attractions/51797/responsive_images/2yYVRIinzGwIyyeJIQjg1AEEpvQWGm0v0AeHg4aX__1673_1116.jpeg' where id = (select id from public.locations where name = 'Hashima Island (Gunkanjima)');
update public.locations set featured_image = 'https://images.squarespace-cdn.com/content/v1/61505c55c04b0a138b337894/4c49386d-ece6-4c73-80d4-cb3773b0a226/long-corridors-at-beelitz-heilstaetten.jpeg' where id = (select id from public.locations where name = 'Beelitz-Heilstätten Hospital');
update public.locations set featured_image = 'https://www.easternstate.org/sites/easternstate/files/2019-01/homepage-mobile-header.jpg' where id = (select id from public.locations where name = 'Eastern State Penitentiary');
update public.locations set featured_image = 'https://i.insider.com/5d41aef1100a2417c432c528?width=800&format=jpeg&auto=webp' where id = (select id from public.locations where name = 'Mirny Diamond Mine');
update public.locations set featured_image = 'https://travelationship.com/wp-content/uploads/2022/03/fi-kolmanskop.jpg' where id = (select id from public.locations where name = 'Kolmanskop');
update public.locations set featured_image = 'https://www.travelingfoundlove.com/wp-content/uploads/2023/03/Bannerman-Castle-Viewpoint.jpg' where id = (select id from public.locations where name = 'Bannerman Castle');
update public.locations set featured_image = 'https://www.designingbuildings.co.uk/w/images/b/b2/MaunsellForts.jpg' where id = (select id from public.locations where name = 'Maunsell Sea Forts');
update public.locations set featured_image = 'https://www.nationalww2museum.org/sites/default/files/styles/wide_large/public/2018-11/4.%20ouradour.png' where id = (select id from public.locations where name = 'Oradour-sur-Glane');
update public.locations set featured_image = 'https://www.kathmanduandbeyond.com/wp-content/uploads/2019/09/Buzludzha-Monument-Buzludzha-Bulgaria-15.jpg' where id = (select id from public.locations where name = 'Buzludzha Monument');

