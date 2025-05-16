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
