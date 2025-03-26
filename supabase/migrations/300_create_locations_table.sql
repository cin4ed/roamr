-- Create a type for location verification status
create type public.verification_status as enum (
  'pending',
  'verified',
  'rejected'
);

-- Create the locations table
create table public.locations (
  id uuid not null default uuid_generate_v4 (),
  name text not null,
  description text null,
  longitude numeric not null,
  latitude numeric not null,
  featured_image text null,
  coordinates geography(POINT) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography) STORED,
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

-- Enable row level security for the locations table
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Locations policies
CREATE POLICY "Authenticated users can create locations"
    ON public.locations
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "All users can view locations"
    ON public.locations
    FOR SELECT
    USING (true);

-- Create a trigger to automatically update the updated_at column for the locations table
CREATE TRIGGER update_locations_updated_at
    BEFORE UPDATE ON public.locations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
