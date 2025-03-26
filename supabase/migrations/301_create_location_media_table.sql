create type media_type as enum ('photo', 'video');

-- Create a table to link locations with all their media
create table public.location_media (
    id uuid not null default uuid_generate_v4(),
    location_id uuid not null references public.locations(id) on delete cascade,
    media_type media_type not null,
    caption text not null,
    media_url text not null,
    uploaded_by uuid not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    constraint location_media_pkey primary key (id),
    constraint locations_media_uploaded_by_id_fkey foreign key (uploaded_by) references auth.users (id),
    constraint unique_location_media unique (location_id, media_url)
);

-- Enable row level security for the location_media table
alter table public.location_media enable row level security;

-- Location media policies
create policy "Anyone can read location media connections"
    on location_media for select
    to public
    using (true);

create POLICY "Authenticated users can add media to locations"
    on location_media
    for insert to authenticated with CHECK (true);

-- Create a trigger to automatically update the updated_at column for the location_media table
create trigger update_location_media_updated_at
    before update on public.location_media
    for each row
    execute function update_updated_at_column();
