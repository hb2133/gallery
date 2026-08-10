alter table public.start_page_settings
add column if not exists category_box_layouts jsonb not null default
'{
    "architecture": [13, 8, 14, 18, 12],
    "portraits": [13, 12, 14, 15, 18],
    "journeys": [13, 9, 17, 19, 7],
    "journal": [13, 12, 14, 15, 11]
}'::jsonb;

do $$
begin
    if not exists
    (
        select 1
        from pg_constraint
        where conname = 'start_page_category_box_layouts_is_object'
    )
    then
        alter table public.start_page_settings
        add constraint start_page_category_box_layouts_is_object
        check (jsonb_typeof(category_box_layouts) = 'object');
    end if;
end
$$;
