create table public.reviews (
    id uuid not null default uuid_generate_v4(),
    location_id uuid not null,
    user_id uuid not null,
    rating integer not null,
    comment text null,
    created_at timestamp with time zone null default now(),
    constraint reviews_pkey primary key (id),
    constraint reviews_location_id_fkey foreign key (location_id) references public.locations (id),
    constraint reviews_user_id_fkey foreign key (user_id) references auth.users (id)
);

alter table public.reviews enable row level security;

create policy "Authenticated users can create reviews"
    on public.reviews
    for insert
    to authenticated
    with check (true);

create policy "All users can view reviews"
    on public.reviews
    for select
    using (true);