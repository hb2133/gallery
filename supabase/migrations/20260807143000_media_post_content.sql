alter table public.media_posts
add column if not exists content text not null default '';

update public.media_posts
set content = case id
    when 'sample-field-note' then
        '빛과 바람이 지나가는 짧은 순간을 천천히 기록한 영상입니다.'
    when 'sample-youtube-player' then
        '웹 플레이어의 움직임과 화면 구성을 살펴보기 위한 테스트 영상입니다.'
    when 'sample-big-buck-bunny' then
        '넓은 들판과 숲을 배경으로 펼쳐지는 Blender Foundation의 오픈 무비입니다.'
    when 'sample-sintel' then
        '차가운 산과 기억을 따라가는 짧은 판타지 애니메이션입니다.'
    when 'sample-placeholder-motion' then
        '영상 게시판의 반복 재생과 상세 팝업을 확인하기 위한 테스트 신호입니다.'
    else content
end
where id in (
    'sample-field-note',
    'sample-youtube-player',
    'sample-big-buck-bunny',
    'sample-sintel',
    'sample-placeholder-motion'
);
