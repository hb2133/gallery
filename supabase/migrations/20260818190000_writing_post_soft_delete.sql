alter table public.writing_posts
add column if not exists is_deleted boolean not null default false;

create index if not exists writing_posts_is_deleted_idx
on public.writing_posts (is_deleted);

create or replace function public.load_writing_posts()
returns table
(
    id text,
    category text,
    title text,
    summary text,
    content_html text,
    is_private boolean,
    is_password_protected boolean,
    is_content_locked boolean,
    thumbnail_url text,
    text_layers jsonb,
    updated_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
    select
        posts.id,
        case when posts.is_deleted then '' else posts.category end,
        case when posts.is_deleted then '' else posts.title end,
        case when posts.is_deleted then '' else posts.summary end,
        case
            when posts.is_deleted then '{"version":1,"is_deleted":true}'
            when
                posts.is_password_protected = false
                or coalesce(
                    auth.jwt() -> 'app_metadata' ->> 'role',
                    ''
                ) = 'admin'
                then posts.content_html
            else ''
        end,
        posts.is_private,
        case
            when posts.is_deleted then false
            else posts.is_password_protected
        end,
        posts.is_deleted
            or (
                posts.is_password_protected
                and coalesce(
                    auth.jwt() -> 'app_metadata' ->> 'role',
                    ''
                ) <> 'admin'
            ),
        case
            when posts.is_deleted then '/images/journal-01.webp'
            else posts.thumbnail_url
        end,
        case
            when posts.is_deleted then '[]'::jsonb
            else posts.text_layers
        end,
        posts.updated_at
    from public.writing_posts as posts
    where
        posts.is_deleted
        or posts.is_private = false
        or coalesce(
            auth.jwt() -> 'app_metadata' ->> 'role',
            ''
        ) = 'admin'
    order by posts.updated_at desc;
$$;

create or replace function public.unlock_writing_post(
    target_post_id text,
    candidate_password text
)
returns table
(
    id text,
    category text,
    title text,
    summary text,
    content_html text,
    is_private boolean,
    is_password_protected boolean,
    is_content_locked boolean,
    thumbnail_url text,
    text_layers jsonb,
    updated_at timestamptz
)
language sql
stable
security definer
set search_path = public, extensions
as $$
    select
        posts.id,
        posts.category,
        posts.title,
        posts.summary,
        posts.content_html,
        posts.is_private,
        posts.is_password_protected,
        false,
        posts.thumbnail_url,
        posts.text_layers,
        posts.updated_at
    from public.writing_posts as posts
    join public.writing_post_access as access
        on access.post_id = posts.id
    where posts.id = target_post_id
      and posts.is_deleted = false
      and (
          posts.is_private = false
          or coalesce(
              auth.jwt() -> 'app_metadata' ->> 'role',
              ''
          ) = 'admin'
      )
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
