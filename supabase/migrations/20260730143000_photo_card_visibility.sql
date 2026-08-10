alter table public.photo_card_customizations
add column if not exists is_private boolean not null default false,
add column if not exists is_deleted boolean not null default false;

create index if not exists photo_card_customizations_visibility_index
on public.photo_card_customizations (is_deleted, is_private);
