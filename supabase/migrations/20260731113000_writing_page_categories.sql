create table if not exists public.writing_page_settings
(
    id boolean primary key default true check (id),
    categories jsonb not null default
        '["기타 마케팅 칼럼", "디자인 노트", "생활 기록", "작업 기록"]'::jsonb,
    article_order jsonb not null default '[]'::jsonb,
    updated_at timestamptz not null default timezone('utc', now())
);

alter table public.writing_page_settings enable row level security;

drop policy if exists "Writing page settings are public"
on public.writing_page_settings;
create policy "Writing page settings are public"
on public.writing_page_settings
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert writing page settings"
on public.writing_page_settings;
create policy "Admins can insert writing page settings"
on public.writing_page_settings
for insert
to authenticated
with check (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

drop policy if exists "Admins can update writing page settings"
on public.writing_page_settings;
create policy "Admins can update writing page settings"
on public.writing_page_settings
for update
to authenticated
using (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
)
with check (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

grant select on public.writing_page_settings to anon, authenticated;
grant insert, update on public.writing_page_settings to authenticated;

insert into public.writing_page_settings
(
    id,
    categories,
    article_order
)
values
(
    true,
    '["기타 마케팅 칼럼", "디자인 노트", "생활 기록", "작업 기록"]'::jsonb,
    '[]'::jsonb
)
on conflict (id) do nothing;

create table if not exists public.writing_posts
(
    id text primary key,
    category text not null default '',
    title text not null default '',
    summary text not null default '',
    content_html text not null default '',
    is_private boolean not null default false,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

alter table public.writing_posts enable row level security;

drop policy if exists "Public writing posts are readable"
on public.writing_posts;
create policy "Public writing posts are readable"
on public.writing_posts
for select
to anon, authenticated
using (
    is_private = false
    or auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

drop policy if exists "Admins can insert writing posts"
on public.writing_posts;
create policy "Admins can insert writing posts"
on public.writing_posts
for insert
to authenticated
with check (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

drop policy if exists "Admins can update writing posts"
on public.writing_posts;
create policy "Admins can update writing posts"
on public.writing_posts
for update
to authenticated
using (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
)
with check (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

grant select on public.writing_posts to anon, authenticated;
grant insert, update on public.writing_posts to authenticated;

insert into storage.buckets
(
    id,
    name,
    public,
    file_size_limit
)
values
(
    'writing-post-assets',
    'writing-post-assets',
    true,
    26214400
)
on conflict (id) do update
set
    public = excluded.public,
    file_size_limit = excluded.file_size_limit;

drop policy if exists "Writing post assets are public"
on storage.objects;
create policy "Writing post assets are public"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'writing-post-assets');

drop policy if exists "Admins can upload writing post assets"
on storage.objects;
create policy "Admins can upload writing post assets"
on storage.objects
for insert
to authenticated
with check (
    bucket_id = 'writing-post-assets'
    and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);
