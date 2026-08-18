alter table public.writing_page_settings
add column if not exists heading_text text not null default
    '오래 생각한 것은
긴 문장으로 남깁니다.',
add column if not exists heading_style jsonb not null default
    '{"Font": "inherit", "Size": 72, "Color": null}'::jsonb,
add column if not exists description_text text not null default
    '일과 생활 사이에서 발견한 생각을 천천히 읽는 공간입니다.',
add column if not exists description_style jsonb not null default
    '{"Font": "inherit", "Size": 11, "Color": null}'::jsonb;

alter table public.writing_page_settings
drop constraint if exists writing_page_heading_style_is_object,
add constraint writing_page_heading_style_is_object
check (jsonb_typeof(heading_style) = 'object'),
drop constraint if exists writing_page_description_style_is_object,
add constraint writing_page_description_style_is_object
check (jsonb_typeof(description_style) = 'object');
