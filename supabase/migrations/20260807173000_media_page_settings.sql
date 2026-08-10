create table if not exists public.media_page_settings
(
    id boolean primary key default true check (id),
    heading_text text not null default 'Motion Archive',
    heading_size smallint not null default 76
        check (heading_size between 24 and 160),
    heading_color text null
        check (
            heading_color is null
            or heading_color ~ '^#[0-9A-Fa-f]{6}$'
        ),
    description_text text not null default
        '움직이는 이미지와 짧은 기록을 모은 영상 아카이브.',
    description_size smallint not null default 11
        check (description_size between 8 and 64),
    description_color text null
        check (
            description_color is null
            or description_color ~ '^#[0-9A-Fa-f]{6}$'
        ),
    updated_at timestamptz not null default timezone('utc', now())
);

alter table public.media_page_settings enable row level security;

drop policy if exists "Media page settings are public"
on public.media_page_settings;
create policy "Media page settings are public"
on public.media_page_settings
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert media page settings"
on public.media_page_settings;
create policy "Admins can insert media page settings"
on public.media_page_settings
for insert
to authenticated
with check (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

drop policy if exists "Admins can update media page settings"
on public.media_page_settings;
create policy "Admins can update media page settings"
on public.media_page_settings
for update
to authenticated
using (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
)
with check (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

grant select on public.media_page_settings to anon, authenticated;
grant insert, update on public.media_page_settings to authenticated;

insert into public.media_page_settings (id)
values (true)
on conflict (id) do nothing;
