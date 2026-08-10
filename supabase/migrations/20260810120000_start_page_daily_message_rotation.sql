alter table public.start_page_settings
add column if not exists daily_message_rotation_seconds integer not null default 10;

alter table public.start_page_settings
drop constraint if exists start_page_daily_message_rotation_seconds_range;

alter table public.start_page_settings
add constraint start_page_daily_message_rotation_seconds_range
check (daily_message_rotation_seconds between 3 and 3600);
