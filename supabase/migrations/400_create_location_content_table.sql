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
