insert into storage.buckets
(
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
)
values
(
    'start-page-fonts',
    'start-page-fonts',
    true,
    10485760,
    null
)
on conflict (id) do update
set
    public = excluded.public,
    file_size_limit = excluded.file_size_limit;

drop policy if exists "Start page fonts are public" on storage.objects;
create policy "Start page fonts are public"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'start-page-fonts');

drop policy if exists "Admins can upload start page fonts" on storage.objects;
create policy "Admins can upload start page fonts"
on storage.objects
for insert
to authenticated
with check (
    bucket_id = 'start-page-fonts'
    and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

drop policy if exists "Admins can update start page fonts" on storage.objects;
create policy "Admins can update start page fonts"
on storage.objects
for update
to authenticated
using (
    bucket_id = 'start-page-fonts'
    and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
)
with check (
    bucket_id = 'start-page-fonts'
    and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

drop policy if exists "Admins can delete start page fonts" on storage.objects;
create policy "Admins can delete start page fonts"
on storage.objects
for delete
to authenticated
using (
    bucket_id = 'start-page-fonts'
    and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);
