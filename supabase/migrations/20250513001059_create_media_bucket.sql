-- Create bucket for media
insert into storage.buckets (id, name, public)
values ('media', 'media', true);

create policy "Public access to media"
    on storage.objects
    for select
    to public
    using (true);

create policy "Authenticated users can upload media"
    on storage.objects
    for insert
    to authenticated
    with check (true);