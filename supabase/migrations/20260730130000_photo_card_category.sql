alter table public.photo_card_customizations
add column if not exists category text;

update public.photo_card_customizations
set category = case card_id
    when 'architecture-archive' then '공간'
    when 'journey-notes' then '여행'
    when 'portrait-studies' then '인물'
    when 'table-journal' then '일상'
    else null
end
where category is null;
