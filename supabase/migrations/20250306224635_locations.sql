create type public.verification_status as enum (
  'pending',
  'verified',
  'rejected'
);

create table public.locations (
  id uuid not null default uuid_generate_v4 (),
  name text not null,
  description text null,
  coordinates geography(POINT) not null,
  address text null,
  city text null,
  country text null,
  tags text[] null,
  safety_info text null,
  accessibility text null,
  creator_id uuid not null default auth.uid (),
  verification_status public.verification_status default 'pending'::verification_status,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint locations_pkey primary key (id),
  constraint locations_creator_id_fkey foreign KEY (creator_id) references auth.users (id)
) TABLESPACE pg_default;

-- Add longitude and latitude columns
ALTER TABLE locations
ADD COLUMN longitude numeric GENERATED ALWAYS AS (ST_X(coordinates::geometry)) STORED,
ADD COLUMN latitude numeric GENERATED ALWAYS AS (ST_Y(coordinates::geometry)) STORED;

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

---

create table public.location_images (
  id uuid not null default uuid_generate_v4 (),
  location_id uuid not null,
  image_url text not null,
  uploaded_by uuid not null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint location_images_pkey primary key (id),
  constraint location_images_location_id_fkey foreign key (location_id) references public.locations (id) on delete cascade,
  constraint location_images_uploaded_by_fkey foreign key (uploaded_by) references auth.users (id)
) TABLESPACE pg_default;

alter table public.location_images enable row level security;

create policy "Authenticated users can upload images"
on public.location_images
for insert
to authenticated
with check (true);

create policy "All users can view images"
on public.location_images
for select
using (true);

---
