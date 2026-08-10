alter table public.start_page_settings
add column if not exists category_center_text_styles jsonb not null default
'{
    "architecture": {"Color": "#777777", "Font": "sans", "Size": 20},
    "portraits": {"Color": "#777777", "Font": "sans", "Size": 20},
    "journeys": {"Color": "#777777", "Font": "sans", "Size": 20},
    "journal": {"Color": "#777777", "Font": "sans", "Size": 20}
}'::jsonb;

do $$
begin
    if not exists
    (
        select 1
        from pg_constraint
        where conname =
            'start_page_category_center_text_styles_is_object'
    )
    then
        alter table public.start_page_settings
        add constraint start_page_category_center_text_styles_is_object
        check (jsonb_typeof(category_center_text_styles) = 'object');
    end if;
end
$$;
