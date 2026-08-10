alter table public.photo_posts
add column if not exists sort_order bigint not null default 0;

with ordered_posts as
(
    select
        id,
        row_number() over (
            order by created_at desc, id asc
        ) - 1 as next_order
    from public.photo_posts
)
update public.photo_posts as posts
set sort_order = ordered_posts.next_order
from ordered_posts
where posts.id = ordered_posts.id;
