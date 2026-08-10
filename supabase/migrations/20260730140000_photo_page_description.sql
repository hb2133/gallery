alter table public.photo_page_settings
add column if not exists description_text text not null default
    '개인적인 장면과 작업을 한곳에 모은 시각 인덱스.',
add column if not exists description_style jsonb not null default
    '{
        "Font": "inherit",
        "FontUrl": "",
        "Size": 11,
        "Color": null
    }'::jsonb;

do $$
begin
    if not exists
    (
        select 1
        from pg_constraint
        where conname = 'photo_page_description_style_is_object'
    )
    then
        alter table public.photo_page_settings
        add constraint photo_page_description_style_is_object
        check (jsonb_typeof(description_style) = 'object');
    end if;
end
$$;
