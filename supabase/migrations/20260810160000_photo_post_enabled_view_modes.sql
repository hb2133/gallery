alter table public.photo_posts
add column if not exists is_book_view_enabled boolean not null default true;

alter table public.photo_posts
add column if not exists is_scroll_view_enabled boolean not null default false;

update public.photo_posts
set
    is_book_view_enabled = default_view_mode = 'book',
    is_scroll_view_enabled = default_view_mode = 'scroll';

do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conname = 'photo_posts_has_enabled_view_mode'
    ) then
        alter table public.photo_posts
        add constraint photo_posts_has_enabled_view_mode
        check (is_book_view_enabled or is_scroll_view_enabled);
    end if;
end
$$;

drop function if exists public.load_photo_posts();
drop function if exists public.unlock_photo_post(text, text);

create function public.load_photo_posts()
returns table
(
    id text,
    title text,
    description text,
    category text,
    image_paths jsonb,
    image_layout jsonb,
    cover_image_path text,
    default_view_mode text,
    is_book_view_enabled boolean,
    is_scroll_view_enabled boolean,
    sort_order bigint,
    created_at timestamptz,
    is_password_protected boolean
)
language sql
stable
security definer
set search_path = public
as $$
    select
        posts.id,
        posts.title,
        case
            when
                coalesce(customizations.is_password_protected, false) = false
                or coalesce(
                    auth.jwt() -> 'app_metadata' ->> 'role',
                    ''
                ) = 'admin'
                then posts.description
            else ''
        end,
        posts.category,
        case
            when
                coalesce(customizations.is_password_protected, false) = false
                or coalesce(
                    auth.jwt() -> 'app_metadata' ->> 'role',
                    ''
                ) = 'admin'
                then posts.image_paths
            else '[]'::jsonb
        end,
        case
            when
                coalesce(customizations.is_password_protected, false) = false
                or coalesce(
                    auth.jwt() -> 'app_metadata' ->> 'role',
                    ''
                ) = 'admin'
                then posts.image_layout
            else '[]'::jsonb
        end,
        posts.cover_image_path,
        posts.default_view_mode,
        posts.is_book_view_enabled,
        posts.is_scroll_view_enabled,
        posts.sort_order,
        posts.created_at,
        coalesce(customizations.is_password_protected, false)
    from public.photo_posts as posts
    left join public.photo_card_customizations as customizations
        on customizations.card_id = posts.id
    order by posts.sort_order asc, posts.created_at desc;
$$;

create function public.unlock_photo_post(
    target_post_id text,
    candidate_password text
)
returns table
(
    id text,
    title text,
    description text,
    category text,
    image_paths jsonb,
    image_layout jsonb,
    cover_image_path text,
    default_view_mode text,
    is_book_view_enabled boolean,
    is_scroll_view_enabled boolean,
    sort_order bigint,
    created_at timestamptz,
    is_password_protected boolean
)
language sql
stable
security definer
set search_path = public, extensions
as $$
    select
        posts.id,
        posts.title,
        posts.description,
        posts.category,
        posts.image_paths,
        posts.image_layout,
        posts.cover_image_path,
        posts.default_view_mode,
        posts.is_book_view_enabled,
        posts.is_scroll_view_enabled,
        posts.sort_order,
        posts.created_at,
        true
    from public.photo_posts as posts
    join public.photo_post_access as access
        on access.card_id = posts.id
    where posts.id = target_post_id
      and (
          coalesce(
              auth.jwt() -> 'app_metadata' ->> 'role',
              ''
          ) = 'admin'
          or access.password_hash = crypt(
              candidate_password,
              access.password_hash
          )
      );
$$;

revoke all on function public.load_photo_posts() from public;
revoke all on function public.unlock_photo_post(text, text) from public;

grant execute on function public.load_photo_posts() to anon, authenticated;
grant execute on function public.unlock_photo_post(text, text) to anon, authenticated;
