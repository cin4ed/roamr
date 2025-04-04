-- Create extensions
create extension if not exists "uuid-ossp";
create extension if not exists "postgis";

-- Create a function to update the updated_at timestamp for any table
create or replace function update_updated_at_column()
returns trigger as $$
begin
    NEW.updated_at = now();
    RETURN NEW;
end;
$$ language 'plpgsql';


-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username varchar(255) unique,
  full_name varchar(255),
  avatar_url text,
  constraint username_length check (char_length(username) >= 3)
);

alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);


-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');


-- Create a table for reports
create table public.reports (
    id uuid not null default uuid_generate_v4(),
    user_id uuid not null,
    title varchar(255) not null,
    description text not null,
    created_at timestamp with time zone default now(),
    constraint reports_pkey primary key (id),
    constraint reports_user_id_fkey foreign key (user_id) references auth.users (id)
);

create index reports_user_id_idx on public.reports (user_id);

alter table public.reports enable row level security;

create policy "Authenticated users can create reports"
    on public.reports
    for insert to authenticated with check (true);

create policy "Users can view their reports"
    on public.reports
    for select to authenticated using (user_id = auth.uid());


-- Create bucket for media
insert into storage.buckets (id, name, public)
values ('media', 'media', true);

create policy "Public access to media"
    on storage.objects
    for select
    to public
    using (true);

create policy "Authenticated users can upload media"
    on storage.objects
    for insert
    to authenticated
    with check (true);


-- Create a table for tags
create table tags (
    id uuid primary key default uuid_generate_v4(),
    name varchar(50) not null unique,
    created_at timestamp with time zone default now()
);

create index tags_name_idx on public.tags (name);

create policy "Authenticated users can create tags"
    on tags
    for insert
    with check (true);

create policy "All users can view tags"
    on tags
    for select
    using (true);


-- Create locations table
create table public.locations (
  id uuid not null default uuid_generate_v4 (),
  name varchar(255) not null,
  description text null,
  longitude numeric not null,
  latitude numeric not null,
  featured_image text null,
  coordinates geography(POINT) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography) STORED,
  address varchar(255) null,
  city varchar(255) null,
  country varchar(255) null,
  creator_id uuid not null default auth.uid (),
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  latest_revision_id uuid null,
  constraint locations_pkey primary key (id),
  constraint locations_creator_id_fkey foreign KEY (creator_id) references auth.users (id)
) TABLESPACE pg_default;

create index locations_creator_id_idx on public.locations (creator_id);

alter table public.locations enable row level security;

create policy "Authenticated users can create locations"
    on public.locations
    for insert
    to authenticated
    with check (true);

create policy "All users can view locations"
    on public.locations
    for select
    using (true);

create policy "All users can update locations"
    on public.locations
    for update
    using (true);

-- create policy "Authenticated users can update locations"
--     on public.locations
--     for update
--     to authenticated
--     with check (true);

-- create trigger update_locations_updated_at
--     before update on public.locations
--     for each row
--     execute function update_updated_at_column();


-- create location_tags table
create table public.location_tags (
  location_id uuid not null,
  tag_id uuid not null,
  constraint location_tags_pkey primary key (location_id, tag_id),
  constraint location_tags_location_id_fkey foreign key (location_id) references public.locations (id),
  constraint location_tags_tag_id_fkey foreign key (tag_id) references public.tags (id)
);

create index location_tags_tag_id_idx on public.location_tags (tag_id);

alter table public.location_tags enable row level security;

create policy "Authenticated users can create location tags"
    on public.location_tags
    for insert
    to authenticated
    with check (true);

create policy "All users can view location tags"
    on public.location_tags
    for select
    using (true);

-- Create location_media table
create type media_type as enum ('photo', 'video');

create table public.location_media (
    id uuid not null default uuid_generate_v4(),
    location_id uuid not null,
    media_type media_type not null,
    caption text not null,
    media_url text not null,
    uploaded_by uuid not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    constraint location_media_pkey primary key (id),
    constraint locations_media_uploaded_by_id_fkey foreign key (uploaded_by) references auth.users (id),
    constraint unique_location_media unique (location_id, media_url),
    constraint location_media_location_id_fkey foreign key (location_id) references public.locations (id)
);

create index location_media_location_id_idx on public.location_media (location_id);
create index location_media_uploaded_by_idx on public.location_media (uploaded_by);
create index location_media_media_type_idx on public.location_media (media_type);

alter table public.location_media enable row level security;

create policy "Anyone can read location media connections"
    on location_media for select
    to public
    using (true);

create POLICY "Authenticated users can add media to locations"
    on location_media
    for insert to authenticated with CHECK (true);

create trigger update_location_media_updated_at
    before update on public.location_media
    for each row
    execute function update_updated_at_column();


-- Create location_content table
create table public.location_content (
    id uuid not null default uuid_generate_v4(),
    content text not null,
    constraint location_content_pkey primary key (id)
);

create policy "Authenticated users can create location content"
    on public.location_content
    for insert
    to authenticated
    with check (true);

create policy "All users can view location content"
    on public.location_content
    for select
    using (true);


-- Create location_revisions table
create table public.location_revisions (
  id uuid not null default uuid_generate_v4(),
  location_id uuid not null,
  location_content_id uuid not null,
  user_id uuid not null,
  comment text null,
  created_at timestamp with time zone null default now(),
  constraint location_revisions_pkey primary key (id),
  constraint location_revisions_location_id_fkey foreign key (location_id) references public.locations (id),
  constraint location_revisions_location_content_id_fkey foreign key (location_content_id) references public.location_content (id),
  constraint location_revisions_user_id_fkey foreign key (user_id) references auth.users (id)
);

create index location_revisions_location_id_idx on public.location_revisions (location_id);
create index location_revisions_location_content_id_idx on public.location_revisions (location_content_id);
create index location_revisions_user_id_idx on public.location_revisions (user_id);

create policy "Authenticated users can create location revisions"
    on public.location_revisions
    for insert
    to authenticated
    with check (true);

create policy "All users can view location revisions"
    on public.location_revisions
    for select
    using (true);

alter table public.locations add constraint fk_latest_revision
foreign key (latest_revision_id) references public.location_revisions (id)
deferrable initially deferred;

-- Function to create a location with a revision within a transaction
create or replace function create_location_with_revision(
    loc_name text,
    loc_description text,
    rev_content text,
    loc_longitude numeric,
    loc_latitude numeric,
    loc_tags text[],
    creator_user_id uuid default auth.uid()
)
returns uuid as $$
declare
    loc_id uuid;
    rev_id uuid;
    loc_content_id uuid;
    tag_name text;
    tag_id uuid;
begin
    -- Insert the location, specifying the creator
    insert into locations (name, description, longitude, latitude, creator_id)
    values (loc_name, loc_description, loc_longitude, loc_latitude, creator_user_id)
    returning id into loc_id;

    -- Handle tags
    foreach tag_name in array loc_tags
    loop
        -- Check if tag exists
        select id into tag_id from tags where name = tag_name;
        
        -- If tag doesn't exist, create it
        if tag_id is null then
            insert into tags (name)
            values (tag_name)
            returning id into tag_id;
        end if;
        
        -- Link tag to location
        insert into location_tags (location_id, tag_id)
        values (loc_id, tag_id);
    end loop;

    -- Insert the content for the initial revision
    insert into location_content (content)
    values (rev_content)
    returning id into loc_content_id;

    -- Insert the initial revision, specifying the user and linking the content
    insert into location_revisions (location_id, location_content_id, user_id)
    values (loc_id, loc_content_id, creator_user_id)
    returning id into rev_id;

    -- Update the location to point to the latest revision
    update locations
    set latest_revision_id = rev_id
    where id = loc_id;
    
    return loc_id;
end;
$$ language plpgsql;