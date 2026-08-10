create table if not exists public.start_page_settings
(
    id text primary key,
    category_labels jsonb not null,
    category_images jsonb not null,
    updated_at timestamptz not null default now(),
    updated_by uuid references auth.users(id)
);

alter table public.start_page_settings enable row level security;

drop policy if exists "Start page settings are public" on public.start_page_settings;
create policy "Start page settings are public"
on public.start_page_settings
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert start page settings" on public.start_page_settings;
create policy "Admins can insert start page settings"
on public.start_page_settings
for insert
to authenticated
with check (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

drop policy if exists "Admins can update start page settings" on public.start_page_settings;
create policy "Admins can update start page settings"
on public.start_page_settings
for update
to authenticated
using (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
)
with check (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

grant select on public.start_page_settings to anon, authenticated;
grant insert, update on public.start_page_settings to authenticated;

insert into public.start_page_settings
(
    id,
    category_labels,
    category_images
)
values
(
    'default',
    '{
        "architecture": "로맨스",
        "portraits": "스릴러",
        "journeys": "다큐",
        "journal": "SF"
    }'::jsonb,
    '{
        "architecture": "/images/architecture-01.webp",
        "portraits": "/images/portrait-01.webp",
        "journeys": "/images/journey-01.webp",
        "journal": "/images/journal-01.webp"
    }'::jsonb
)
on conflict (id) do nothing;

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
    'start-page-images',
    'start-page-images',
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

drop policy if exists "Start page images are public" on storage.objects;
create policy "Start page images are public"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'start-page-images');

drop policy if exists "Admins can upload start page images" on storage.objects;
create policy "Admins can upload start page images"
on storage.objects
for insert
to authenticated
with check (
    bucket_id = 'start-page-images'
    and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

drop policy if exists "Admins can update start page images" on storage.objects;
create policy "Admins can update start page images"
on storage.objects
for update
to authenticated
using (
    bucket_id = 'start-page-images'
    and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
)
with check (
    bucket_id = 'start-page-images'
    and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

drop policy if exists "Admins can delete start page images" on storage.objects;
create policy "Admins can delete start page images"
on storage.objects
for delete
to authenticated
using (
    bucket_id = 'start-page-images'
    and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);
