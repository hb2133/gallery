alter table public.media_page_settings
add column if not exists grid_columns smallint not null default 3;

do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conname = 'media_page_settings_grid_columns_valid'
    ) then
        alter table public.media_page_settings
        add constraint media_page_settings_grid_columns_valid
        check (grid_columns between 1 and 5);
    end if;
end
$$;
