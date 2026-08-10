create extension if not exists pgcrypto with schema extensions;

alter table public.photo_card_customizations
add column if not exists is_password_protected boolean not null default false;

create table if not exists public.photo_post_access
(
    card_id text primary key
        references public.photo_posts(id) on delete cascade,
    password_hash text not null,
    updated_at timestamptz not null default timezone('utc', now())
);

alter table public.photo_post_access enable row level security;
revoke all on public.photo_post_access from public, anon, authenticated;

drop policy if exists "Photo posts are public" on public.photo_posts;
drop policy if exists "Admins can read photo posts" on public.photo_posts;
create policy "Admins can read photo posts"
on public.photo_posts
for select
to authenticated
using (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

revoke select on public.photo_posts from anon;
grant select on public.photo_posts to authenticated;

create or replace function public.load_photo_posts()
returns table
(
    id text,
    title text,
    description text,
    category text,
    image_paths jsonb,
    image_layout jsonb,
    cover_image_path text,
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
        posts.sort_order,
        posts.created_at,
        coalesce(customizations.is_password_protected, false)
    from public.photo_posts as posts
    left join public.photo_card_customizations as customizations
        on customizations.card_id = posts.id
    order by posts.sort_order asc, posts.created_at desc;
$$;

create or replace function public.unlock_photo_post(
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

create or replace function public.set_photo_post_password(
    target_post_id text,
    next_password text
)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
    normalized_password text := btrim(next_password);
    is_protected boolean := normalized_password <> '';
begin
    if coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') <> 'admin' then
        raise exception 'Admin authentication is required.';
    end if;

    if not exists (
        select 1
        from public.photo_posts
        where photo_posts.id = target_post_id
    ) then
        raise exception 'Photo post not found.';
    end if;

    if is_protected and (
        char_length(normalized_password) < 4
        or char_length(normalized_password) > 72
    ) then
        raise exception 'Password must be 4 to 72 characters.';
    end if;

    if is_protected then
        insert into public.photo_post_access
        (
            card_id,
            password_hash,
            updated_at
        )
        values
        (
            target_post_id,
            crypt(normalized_password, gen_salt('bf', 10)),
            timezone('utc', now())
        )
        on conflict (card_id) do update
        set
            password_hash = excluded.password_hash,
            updated_at = excluded.updated_at;
    else
        delete from public.photo_post_access
        where card_id = target_post_id;
    end if;

    update public.photo_card_customizations
    set
        is_password_protected = is_protected,
        updated_at = timezone('utc', now())
    where card_id = target_post_id;

    return is_protected;
end;
$$;

revoke all on function public.load_photo_posts() from public;
revoke all on function public.unlock_photo_post(text, text) from public;
revoke all on function public.set_photo_post_password(text, text) from public;

grant execute on function public.load_photo_posts() to anon, authenticated;
grant execute on function public.unlock_photo_post(text, text) to anon, authenticated;
grant execute on function public.set_photo_post_password(text, text) to authenticated;
