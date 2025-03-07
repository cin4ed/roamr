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

insert into public.locations (name, description, coordinates, address, city, country, tags, safety_info, accessibility, creator_id)
values (
    'Test Location',
    'This is a test location',
    ST_GeogFromText('SRID=4326;POINT(-122.4194 37.7749)'),
    '123 Main St',
    'San Francisco',
    'United States',
    ARRAY['test', 'location'],
    'This location is safe for all users',
    'This location is accessible for all users',
    '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611'::uuid
);

insert into public.location_images (location_id, image_url, uploaded_by)
values (
    (select id from public.locations where name = 'Test Location'),
    'https://images.unsplash.com/photo-1631197344782-e66f0c665ba9',
    '0a1ff718-a54b-483d-b4fd-e9b2f4fc7611'::uuid
);