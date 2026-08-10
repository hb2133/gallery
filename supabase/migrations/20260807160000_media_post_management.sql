alter table public.media_posts
add column if not exists sort_order bigint not null default 0;

with ordered_posts as
(
    select
        id,
        row_number() over (
            order by created_at desc, id asc
        ) - 1 as next_order
    from public.media_posts
)
update public.media_posts as posts
set sort_order = ordered_posts.next_order
from ordered_posts
where posts.id = ordered_posts.id;

drop policy if exists "Admins can update media posts"
on public.media_posts;
create policy "Admins can update media posts"
on public.media_posts
for update
to authenticated
using (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
)
with check (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

drop policy if exists "Admins can delete media posts"
on public.media_posts;
create policy "Admins can delete media posts"
on public.media_posts
for delete
to authenticated
using (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

grant update, delete on public.media_posts to authenticated;

drop policy if exists "Admins can delete media post videos"
on storage.objects;
create policy "Admins can delete media post videos"
on storage.objects
for delete
to authenticated
using (
    bucket_id = 'media-post-videos'
    and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);
