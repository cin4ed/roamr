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

create policy "Authenticated users can add media to locations"
    on location_media
    for insert to authenticated with CHECK (true);
