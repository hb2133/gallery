create table if not exists public.photo_card_customizations
(
    card_id text primary key,
    thumbnail_url text not null,
    text_layers jsonb not null default '[]'::jsonb,
    updated_at timestamptz not null default timezone('utc', now())
);

alter table public.photo_card_customizations enable row level security;

drop policy if exists "Photo card customizations are public"
on public.photo_card_customizations;
create policy "Photo card customizations are public"
on public.photo_card_customizations
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert photo card customizations"
on public.photo_card_customizations;
create policy "Admins can insert photo card customizations"
on public.photo_card_customizations
for insert
to authenticated
with check (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

drop policy if exists "Admins can update photo card customizations"
on public.photo_card_customizations;
create policy "Admins can update photo card customizations"
on public.photo_card_customizations
for update
to authenticated
using (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
)
with check (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

grant select on public.photo_card_customizations to anon, authenticated;
grant insert, update on public.photo_card_customizations to authenticated;

insert into storage.buckets
(
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
)
values
(
    'photo-card-thumbnails',
    'photo-card-thumbnails',
    true,
    10485760,
    array[
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif'
    ]
)
on conflict (id) do update
set
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Photo card thumbnails are public"
on storage.objects;
create policy "Photo card thumbnails are public"
on storage.objects
for select
to public
using (bucket_id = 'photo-card-thumbnails');

drop policy if exists "Admins can upload photo card thumbnails"
on storage.objects;
create policy "Admins can upload photo card thumbnails"
on storage.objects
for insert
to authenticated
with check (
    bucket_id = 'photo-card-thumbnails'
    and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

drop policy if exists "Admins can update photo card thumbnails"
on storage.objects;
create policy "Admins can update photo card thumbnails"
on storage.objects
for update
to authenticated
using (
    bucket_id = 'photo-card-thumbnails'
    and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
)
with check (
    bucket_id = 'photo-card-thumbnails'
    and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

drop policy if exists "Admins can delete photo card thumbnails"
on storage.objects;
create policy "Admins can delete photo card thumbnails"
on storage.objects
for delete
to authenticated
using (
    bucket_id = 'photo-card-thumbnails'
    and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);
