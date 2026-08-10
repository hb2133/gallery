with samples as
(
    select
        number,
        (array[
            'M7lc1UVf-VE',
            'aqz-KE-bpKQ',
            'eRsGyueVLvQ',
            'ScMzIvxBSi4'
        ])[1 + ((number - 6) % 4)] as youtube_id
    from generate_series(6, 27) as number
)
insert into public.media_posts
(
    id,
    title,
    content,
    studio,
    source_type,
    sort_order,
    video_url,
    youtube_id,
    created_at
)
select
    format('sample-motion-%s', lpad(number::text, 2, '0')),
    format('Motion Study %s', lpad(number::text, 2, '0')),
    format('영상 게시판의 목록, 재생, 편집과 정렬을 확인하기 위한 테스트 영상 %s입니다.', number),
    case
        when number % 6 = 0 then 'ARCHIVE STUDIO'
        else 'MOTION TEST LAB'
    end,
    case
        when number % 6 = 0 then 'upload'
        else 'youtube'
    end,
    number - 1,
    case
        when number % 6 = 0 then '/videos/field-note.mp4'
        else format(
            'https://www.youtube.com/watch?v=%s',
            youtube_id
        )
    end,
    case
        when number % 6 = 0 then ''
        else youtube_id
    end,
    '2026-08-02T01:00:00Z'::timestamptz
        - ((number - 6) * interval '5 days')
from samples
on conflict (id) do nothing;
