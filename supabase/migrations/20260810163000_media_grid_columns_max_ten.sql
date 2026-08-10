alter table public.media_page_settings
drop constraint if exists media_page_settings_grid_columns_valid;

alter table public.media_page_settings
add constraint media_page_settings_grid_columns_valid
check (grid_columns between 1 and 10);
