alter table public.photo_page_settings
add column if not exists heading_text text not null default
    'What have we collected?',
add column if not exists heading_style jsonb not null default
    '{
        "Font": "inherit",
        "Size": 82,
        "Color": null
    }'::jsonb;

do $$
begin
    if not exists
    (
        select 1
        from pg_constraint
        where conname = 'photo_page_heading_style_is_object'
    )
    then
        alter table public.photo_page_settings
        add constraint photo_page_heading_style_is_object
        check (jsonb_typeof(heading_style) = 'object');
    end if;
end
$$;
