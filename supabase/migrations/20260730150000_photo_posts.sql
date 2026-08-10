create table if not exists public.photo_posts
(
    id text primary key,
    title text not null,
    description text not null default '',
    category text,
    image_paths jsonb not null default '[]'::jsonb,
    cover_image_path text not null,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    constraint photo_posts_image_paths_is_array
        check (jsonb_typeof(image_paths) = 'array')
);

alter table public.photo_posts enable row level security;

drop policy if exists "Photo posts are public"
on public.photo_posts;
create policy "Photo posts are public"
on public.photo_posts
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert photo posts"
on public.photo_posts;
create policy "Admins can insert photo posts"
on public.photo_posts
for insert
to authenticated
with check (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

drop policy if exists "Admins can update photo posts"
on public.photo_posts;
create policy "Admins can update photo posts"
on public.photo_posts
for update
to authenticated
using (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
)
with check (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

drop policy if exists "Admins can delete photo posts"
on public.photo_posts;
create policy "Admins can delete photo posts"
on public.photo_posts
for delete
to authenticated
using (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

grant select on public.photo_posts to anon, authenticated;
grant insert, update, delete on public.photo_posts to authenticated;

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
    'photo-post-images',
    'photo-post-images',
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

drop policy if exists "Photo post images are public"
on storage.objects;
create policy "Photo post images are public"
on storage.objects
for select
to public
using (bucket_id = 'photo-post-images');

drop policy if exists "Admins can upload photo post images"
on storage.objects;
create policy "Admins can upload photo post images"
on storage.objects
for insert
to authenticated
with check (
    bucket_id = 'photo-post-images'
    and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

drop policy if exists "Admins can update photo post images"
on storage.objects;
create policy "Admins can update photo post images"
on storage.objects
for update
to authenticated
using (
    bucket_id = 'photo-post-images'
    and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
)
with check (
    bucket_id = 'photo-post-images'
    and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

drop policy if exists "Admins can delete photo post images"
on storage.objects;
create policy "Admins can delete photo post images"
on storage.objects
for delete
to authenticated
using (
    bucket_id = 'photo-post-images'
    and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);
