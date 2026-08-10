alter table public.start_page_settings
add column if not exists category_text_styles jsonb not null default
'{
    "architecture": {"Color": "#777777", "Font": "sans", "Size": 20},
    "portraits": {"Color": "#777777", "Font": "sans", "Size": 20},
    "journeys": {"Color": "#777777", "Font": "sans", "Size": 20},
    "journal": {"Color": "#777777", "Font": "sans", "Size": 20}
}'::jsonb,
add column if not exists destination_labels jsonb not null default
'{
    "architecture": "02. 영상·음악",
    "portraits": "01. 사진",
    "journeys": "03. 긴 글",
    "journal": "04. 한 줄 메모"
}'::jsonb,
add column if not exists destination_text_styles jsonb not null default
'{
    "architecture": {"Color": "#ffffff", "Font": "sans", "Size": 10},
    "portraits": {"Color": "#ffffff", "Font": "sans", "Size": 10},
    "journeys": {"Color": "#ffffff", "Font": "sans", "Size": 10},
    "journal": {"Color": "#ffffff", "Font": "sans", "Size": 10}
}'::jsonb;

do $$
begin
    if not exists
    (
        select 1
        from pg_constraint
        where conname = 'start_page_category_text_styles_is_object'
    )
    then
        alter table public.start_page_settings
        add constraint start_page_category_text_styles_is_object
        check (jsonb_typeof(category_text_styles) = 'object');
    end if;

    if not exists
    (
        select 1
        from pg_constraint
        where conname = 'start_page_destination_labels_is_object'
    )
    then
        alter table public.start_page_settings
        add constraint start_page_destination_labels_is_object
        check (jsonb_typeof(destination_labels) = 'object');
    end if;

    if not exists
    (
        select 1
        from pg_constraint
        where conname = 'start_page_destination_text_styles_is_object'
    )
    then
        alter table public.start_page_settings
        add constraint start_page_destination_text_styles_is_object
        check (jsonb_typeof(destination_text_styles) = 'object');
    end if;
end
$$;
