create extension if not exists "uuid-ossp";
create extension if not exists "postgis";

-- Create locations table
create table public.locations (
  id uuid not null default uuid_generate_v4 (),
  name varchar(255) not null,
  description text null,
  longitude numeric not null,
  latitude numeric not null,
  coordinates geography(POINT) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography) STORED,
  user_id uuid not null default auth.uid (),
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint locations_pkey primary key (id),
  constraint locations_user_id_fkey foreign KEY (user_id) references auth.users (id)
);

create index locations_user_id_idx on public.locations (user_id);
create index idx_locations_coordinates on public.locations using GIST (coordinates);

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