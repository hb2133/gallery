alter table public.start_page_settings
add column if not exists header_link jsonb not null default
'{
    "Text": "Instagram",
    "Url": "https://www.instagram.com/"
}'::jsonb;

do $$
begin
    if not exists
    (
        select 1
        from pg_constraint
        where conname = 'start_page_header_link_is_object'
    )
    then
        alter table public.start_page_settings
        add constraint start_page_header_link_is_object
        check (jsonb_typeof(header_link) = 'object');
    end if;
end
$$;
