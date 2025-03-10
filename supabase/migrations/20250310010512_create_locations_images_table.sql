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