create table if not exists public.photo_page_settings
(
    id boolean primary key default true check (id),
    categories jsonb not null default
        '["공간", "여행", "인물", "일상"]'::jsonb,
    updated_at timestamptz not null default timezone('utc', now())
);

alter table public.photo_page_settings enable row level security;

drop policy if exists "Photo page settings are public"
on public.photo_page_settings;
create policy "Photo page settings are public"
on public.photo_page_settings
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert photo page settings"
on public.photo_page_settings;
create policy "Admins can insert photo page settings"
on public.photo_page_settings
for insert
to authenticated
with check (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

drop policy if exists "Admins can update photo page settings"
on public.photo_page_settings;
create policy "Admins can update photo page settings"
on public.photo_page_settings
for update
to authenticated
using (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
)
with check (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

grant select on public.photo_page_settings to anon, authenticated;
grant insert, update on public.photo_page_settings to authenticated;

insert into public.photo_page_settings
(
    id,
    categories
)
values
(
    true,
    '["공간", "여행", "인물", "일상"]'::jsonb
)
on conflict (id) do nothing;
