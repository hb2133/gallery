update public.start_page_settings
set daily_message_rotation_seconds = 15
where id = 'default'
  and daily_message_rotation_seconds = 10;
