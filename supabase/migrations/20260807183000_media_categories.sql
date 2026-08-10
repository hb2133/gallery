alter table public.media_page_settings
add column if not exists categories text[] not null default
    array['기록', '작업', '여행']::text[];

alter table public.media_posts
add column if not exists category text not null default '기록';

alter table public.media_posts
drop constraint if exists media_posts_category_length;
alter table public.media_posts
add constraint media_posts_category_length
check (
    char_length(btrim(category)) between 1 and 20
);

update public.media_posts
set category = case
    when studio = 'BLENDER FOUNDATION' then '작업'
    when studio = 'MOTION TEST LAB' then '여행'
    else '기록'
end;
