-- Create a table for reports
create table public.reports (
    id uuid not null default uuid_generate_v4(),
    user_id uuid not null,
    title varchar(255) not null,
    description text not null,
    created_at timestamp with time zone default now(),
    constraint reports_pkey primary key (id),
    constraint reports_user_id_fkey foreign key (user_id) references auth.users (id)
);

create index reports_user_id_idx on public.reports (user_id);

alter table public.reports enable row level security;

create policy "Authenticated users can create reports"
    on public.reports
    for insert to authenticated with check (true);

create policy "Users can view their reports"
    on public.reports
    for select to authenticated using (user_id = auth.uid());