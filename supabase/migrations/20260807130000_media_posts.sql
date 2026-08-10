create table if not exists public.media_posts
(
    id text primary key,
    title text not null,
    studio text not null default 'ARCHIVE STUDIO',
    source_type text not null check (
        source_type in ('upload', 'youtube')
    ),
    video_url text not null,
    youtube_id text not null default '',
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    check (
        (
            source_type = 'upload'
            and char_length(video_url) > 0
            and youtube_id = ''
        )
        or (
            source_type = 'youtube'
            and char_length(youtube_id) = 11
        )
    )
);

alter table public.media_posts enable row level security;

drop policy if exists "Media posts are public"
on public.media_posts;
create policy "Media posts are public"
on public.media_posts
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert media posts"
on public.media_posts;
create policy "Admins can insert media posts"
on public.media_posts
for insert
to authenticated
with check (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

grant select on public.media_posts to anon, authenticated;
grant insert on public.media_posts to authenticated;

insert into storage.buckets
(
    id,
    name,
    public,
    file_size_limit
)
values
(
    'media-post-videos',
    'media-post-videos',
    true,
    52428800
)
on conflict (id) do update
set
    public = excluded.public,
    file_size_limit = excluded.file_size_limit;

drop policy if exists "Media post videos are public"
on storage.objects;
create policy "Media post videos are public"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'media-post-videos');

drop policy if exists "Admins can upload media post videos"
on storage.objects;
create policy "Admins can upload media post videos"
on storage.objects
for insert
to authenticated
with check (
    bucket_id = 'media-post-videos'
    and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

insert into public.media_posts
(
    id,
    title,
    studio,
    source_type,
    video_url,
    youtube_id,
    created_at
)
values
    (
        'sample-field-note',
        'A Field Note in Motion',
        'ARCHIVE STUDIO',
        'upload',
        '/videos/field-note.mp4',
        '',
        '2026-08-07T01:00:00Z'
    ),
    (
        'sample-youtube-player',
        'Embedded Player Study',
        'YOUTUBE DEVELOPERS',
        'youtube',
        'https://www.youtube.com/watch?v=M7lc1UVf-VE',
        'M7lc1UVf-VE',
        '2026-08-06T01:00:00Z'
    ),
    (
        'sample-big-buck-bunny',
        'Big Buck Bunny',
        'BLENDER FOUNDATION',
        'youtube',
        'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
        'aqz-KE-bpKQ',
        '2026-08-05T01:00:00Z'
    ),
    (
        'sample-sintel',
        'Sintel',
        'BLENDER FOUNDATION',
        'youtube',
        'https://www.youtube.com/watch?v=eRsGyueVLvQ',
        'eRsGyueVLvQ',
        '2026-08-04T01:00:00Z'
    ),
    (
        'sample-placeholder-motion',
        'Placeholder Motion',
        'TEST SIGNAL',
        'youtube',
        'https://www.youtube.com/watch?v=ScMzIvxBSi4',
        'ScMzIvxBSi4',
        '2026-08-03T01:00:00Z'
    )
on conflict (id) do nothing;
