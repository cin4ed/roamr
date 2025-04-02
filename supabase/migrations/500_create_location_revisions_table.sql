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

create policy "Authenticated users can create location revisions"
    on public.location_revisions
    for insert
    to authenticated
    with check (true);

create policy "All users can view location revisions"
    on public.location_revisions
    for select
    using (true);