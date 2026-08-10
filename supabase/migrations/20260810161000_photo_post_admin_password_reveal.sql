alter table public.photo_post_access
add column if not exists password_value text;

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
        on conflict (card_id) do update
        set
            password_hash = excluded.password_hash,
            password_value = excluded.password_value,
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

create or replace function public.get_photo_post_password(
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
    from public.photo_post_access
    where card_id = target_post_id;

    return stored_password;
end;
$$;

revoke all on function public.set_photo_post_password(text, text) from public;
revoke all on function public.get_photo_post_password(text) from public;

grant execute on function public.set_photo_post_password(text, text)
to authenticated;
grant execute on function public.get_photo_post_password(text)
to authenticated;
