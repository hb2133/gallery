alter table public.start_page_settings
add column if not exists daily_messages jsonb not null default
'[
    "오늘은 서두르지 않아도 괜찮아요.",
    "천천히 본 장면은 오래 남습니다.",
    "좋아하는 기록부터 열어보세요.",
    "오늘의 한 장면을 가볍게 남겨보세요."
]'::jsonb;

do $$
begin
    if not exists
    (
        select 1
        from pg_constraint
        where conname = 'start_page_daily_messages_is_array'
    )
    then
        alter table public.start_page_settings
        add constraint start_page_daily_messages_is_array
        check (jsonb_typeof(daily_messages) = 'array');
    end if;
end
$$;
