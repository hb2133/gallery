create extension if not exists pgcrypto with schema extensions;

alter table public.writing_posts
add column if not exists is_password_protected boolean not null default false;

alter table public.writing_posts
add column if not exists thumbnail_url text not null default '/images/journal-01.webp';

alter table public.writing_posts
add column if not exists text_layers jsonb not null default '[]'::jsonb;

do $$
declare
    post record;
    content jsonb;
begin
    for post in
        select id, content_html
        from public.writing_posts
    loop
        begin
            content := post.content_html::jsonb;

            if content ->> 'version' = '1' then
                update public.writing_posts
                set
                    thumbnail_url = coalesce(
                        nullif(content ->> 'image', ''),
                        thumbnail_url
                    ),
                    text_layers = coalesce(
                        content -> 'text_layers',
                        text_layers
                    )
                where id = post.id;
            end if;
        exception when others then
            null;
        end;
    end loop;
end
$$;

create table if not exists public.writing_post_access
(
    post_id text primary key
        references public.writing_posts(id) on delete cascade,
    password_hash text not null,
    password_value text,
    updated_at timestamptz not null default timezone('utc', now())
);

alter table public.writing_post_access enable row level security;
revoke all on public.writing_post_access from public, anon, authenticated;

drop policy if exists "Public writing posts are readable"
on public.writing_posts;
drop policy if exists "Admins can read writing posts"
on public.writing_posts;
create policy "Admins can read writing posts"
on public.writing_posts
for select
to authenticated
using (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

revoke select on public.writing_posts from anon;
grant select on public.writing_posts to authenticated;

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
        posts.category,
        posts.title,
        posts.summary,
        case
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
        posts.is_password_protected,
        posts.is_password_protected
            and coalesce(
                auth.jwt() -> 'app_metadata' ->> 'role',
                ''
            ) <> 'admin',
        posts.thumbnail_url,
        posts.text_layers,
        posts.updated_at
    from public.writing_posts as posts
    where
        posts.is_private = false
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

create or replace function public.set_writing_post_password(
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
        from public.writing_posts
        where writing_posts.id = target_post_id
    ) then
        raise exception 'Writing post not found.';
    end if;

    if is_protected and (
        char_length(normalized_password) < 4
        or char_length(normalized_password) > 72
    ) then
        raise exception 'Password must be 4 to 72 characters.';
    end if;

    if is_protected then
        insert into public.writing_post_access
        (
            post_id,
            password_hash,
            password_value,
            updated_at
        )
        values
        (
            target_post_id,
            crypt(normalized_password, gen_salt('bf', 10)),
            normalized_password,
            timezone('utc', now())
        )
        on conflict (post_id) do update
        set
            password_hash = excluded.password_hash,
            password_value = excluded.password_value,
            updated_at = excluded.updated_at;
    else
        delete from public.writing_post_access
        where post_id = target_post_id;
    end if;

    update public.writing_posts
    set
        is_password_protected = is_protected,
        updated_at = timezone('utc', now())
    where id = target_post_id;

    return is_protected;
end;
$$;

create or replace function public.get_writing_post_password(
    target_post_id text
)
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
    stored_password text;
begin
    if coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') <> 'admin' then
        raise exception 'Admin authentication is required.';
    end if;

    select password_value
    into stored_password
    from public.writing_post_access
    where post_id = target_post_id;

    return stored_password;
end;
$$;

revoke all on function public.load_writing_posts() from public;
revoke all on function public.unlock_writing_post(text, text) from public;
revoke all on function public.set_writing_post_password(text, text) from public;
revoke all on function public.get_writing_post_password(text) from public;

grant execute on function public.load_writing_posts() to anon, authenticated;
grant execute on function public.unlock_writing_post(text, text) to anon, authenticated;
grant execute on function public.set_writing_post_password(text, text)
to authenticated;
grant execute on function public.get_writing_post_password(text)
to authenticated;
