create or replace function public.rename_archive_category(
    board_name text,
    current_name text,
    next_name text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
    normalized_name text := btrim(next_name);
begin
    if coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') <> 'admin' then
        raise exception 'Admin authentication is required.';
    end if;

    if
        btrim(current_name) = ''
        or normalized_name = ''
        or normalized_name = '전체'
        or char_length(normalized_name) > 20
    then
        raise exception 'Invalid category name.';
    end if;

    case board_name
        when 'photo' then
            if exists (
                select 1
                from public.photo_page_settings
                where id = true
                  and categories ? normalized_name
                  and normalized_name <> current_name
            ) then
                raise exception 'Category already exists.';
            end if;

            update public.photo_page_settings
            set
                categories = (
                    select jsonb_agg(
                        to_jsonb(
                            case
                                when item.value = current_name
                                    then normalized_name
                                else item.value
                            end
                        )
                        order by item.position
                    )
                    from jsonb_array_elements_text(categories)
                        with ordinality as item(value, position)
                ),
                updated_at = timezone('utc', now())
            where id = true
              and categories ? current_name;

            if not found then
                raise exception 'Category not found.';
            end if;

            update public.photo_posts
            set category = normalized_name,
                updated_at = timezone('utc', now())
            where category = current_name;

            update public.photo_card_customizations
            set category = normalized_name,
                updated_at = timezone('utc', now())
            where category = current_name;

        when 'media' then
            if exists (
                select 1
                from public.media_page_settings
                where id = true
                  and normalized_name = any(categories)
                  and normalized_name <> current_name
            ) then
                raise exception 'Category already exists.';
            end if;

            update public.media_page_settings
            set categories = array_replace(
                    categories,
                    current_name,
                    normalized_name
                ),
                updated_at = timezone('utc', now())
            where id = true
              and current_name = any(categories);

            if not found then
                raise exception 'Category not found.';
            end if;

            update public.media_posts
            set category = normalized_name,
                updated_at = timezone('utc', now())
            where category = current_name;

        when 'writing' then
            if exists (
                select 1
                from public.writing_page_settings
                where id = true
                  and categories ? normalized_name
                  and normalized_name <> current_name
            ) then
                raise exception 'Category already exists.';
            end if;

            update public.writing_page_settings
            set
                categories = (
                    select jsonb_agg(
                        to_jsonb(
                            case
                                when item.value = current_name
                                    then normalized_name
                                else item.value
                            end
                        )
                        order by item.position
                    )
                    from jsonb_array_elements_text(categories)
                        with ordinality as item(value, position)
                ),
                updated_at = timezone('utc', now())
            where id = true
              and categories ? current_name;

            if not found then
                raise exception 'Category not found.';
            end if;

            update public.writing_posts
            set category = normalized_name,
                updated_at = timezone('utc', now())
            where category = current_name;

        else
            raise exception 'Unknown archive board.';
    end case;
end;
$$;

revoke all on function public.rename_archive_category(text, text, text)
from public, anon;

grant execute on function public.rename_archive_category(text, text, text)
to authenticated;
