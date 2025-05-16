-- Create a table for tags
create table tags (
    id uuid primary key default uuid_generate_v4(),
    name varchar(50) not null unique,
    created_at timestamp with time zone default now()
);

create index tags_name_idx on public.tags (name);

create policy "Authenticated users can create tags"
    on tags
    for insert
    with check (true);

create policy "All users can view tags"
    on tags
    for select
    using (true);
