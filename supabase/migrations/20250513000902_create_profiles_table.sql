create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username varchar(20) unique not null,
  avatar_url text,
  updated_at timestamp with time zone default now(),
  constraint username_length check (char_length(username) > 1)
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

create function public.handle_new_user()
returns trigger
set search_path = ''
as $$
declare
  new_username text;
begin
  loop
    new_username := lpad(
      (trunc(random() * 1e10)::bigint)::text ||
      (trunc(random() * 1e10)::bigint)::text,
      10, '0'
    );
    exit when not exists (
      select 1 from public.profiles where username = new_username
    );
  end loop;

  insert into public.profiles (id, username)
  values (new.id, new_username);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- insert into storage.buckets (id, name)
--   values ('avatars', 'avatars');

-- create policy "Avatar images are publicly accessible." on storage.objects
--   for select using (bucket_id = 'avatars');

-- create policy "Anyone can upload an avatar." on storage.objects
--   for insert with check (bucket_id = 'avatars');