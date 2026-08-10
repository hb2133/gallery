alter table public.photo_posts
add column if not exists image_layout jsonb not null
default '[]'::jsonb;

update public.photo_posts
set image_layout =
(
    select coalesce(
        jsonb_agg(
            jsonb_build_object(
                'image_path',
                image_path.value #>> '{}',
                'x',
                ((image_path.ordinality - 1) % 5)::integer,
                'y',
                ((image_path.ordinality - 1) / 5)::integer
            )
            order by image_path.ordinality
        ),
        '[]'::jsonb
    )
    from jsonb_array_elements(image_paths)
        with ordinality as image_path(value, ordinality)
)
where jsonb_array_length(image_layout) = 0;

do $$
begin
    if not exists
    (
        select 1
        from pg_constraint
        where conname = 'photo_posts_image_layout_is_array'
    )
    then
        alter table public.photo_posts
        add constraint photo_posts_image_layout_is_array
        check (jsonb_typeof(image_layout) = 'array');
    end if;
end
$$;
