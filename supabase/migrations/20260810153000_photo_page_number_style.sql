alter table public.photo_card_customizations
add column if not exists page_number_color text not null default '#ffffff',
add column if not exists page_number_opacity double precision not null default 0.86;

do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conname = 'photo_card_page_number_color_valid'
    ) then
        alter table public.photo_card_customizations
        add constraint photo_card_page_number_color_valid
        check (page_number_color ~ '^#[0-9A-Fa-f]{6}$');
    end if;

    if not exists (
        select 1
        from pg_constraint
        where conname = 'photo_card_page_number_opacity_valid'
    ) then
        alter table public.photo_card_customizations
        add constraint photo_card_page_number_opacity_valid
        check (page_number_opacity between 0 and 1);
    end if;
end
$$;
