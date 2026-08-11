# Task

## Context
- 영상 게시판을 `01 영상.gif`의 5열 무빙 썸네일 갤러리와 유사하게 변경한다.
- 관리자 작성창에서 로컬 영상 또는 YouTube 링크를 선택해 게시한다.

## Current Understanding
- 레퍼런스는 대형 타이틀 아래 5열 카드, 3:2에 가까운 영상 썸네일, 작은 제목/제작사/번호로 구성된다.
- 별도 GIF 변환 파이프라인 없이 HTML video와 YouTube iframe의 muted autoplay loop가 필요한 시각 효과를 제공한다.

## Observed Issues
- 기존 미디어 데이터는 클라이언트 정적 배열이고 영상 업로드/작성/저장 경로가 없다.

## Decision Notes
- 실제 GIF 생성은 용량 증가와 변환 서버가 필요하므로 요청된 화면 효과를 네이티브 반복 재생으로 구현한다.

## Initial Render Harness
- 저장값: media_posts의 제목, 제작사, 소스 유형, 영상 URL, YouTube ID.
- SSOT: Supabase `media_posts`와 `media-post-videos` 공개 버킷.
- `LoadInitialAppState`가 서버에서 게시물을 읽고 Provider를 통해 Controller 최초 state에 직접 주입한다.
- 브라우저 재조회는 후속 동기화에만 쓰며 최초 표시를 대체하지 않는다.

## Implementation Notes
- MediaBasePanel을 데스크톱 5열 반응형 그리드와 작은 메타 정보 레이아웃으로 변경했다.
- 업로드 영상은 8초 구간을 무음 반복하고 YouTube는 privacy-enhanced embed의 3~11초 구간을 반복한다.
- 관리자 설정 버튼에서 영상/YouTube 작성창을 열고 Supabase 저장 후 즉시 목록 앞에 반영한다.
- media_posts 공개 조회/admin insert RLS와 50MB 공개 영상 버킷을 추가했다.
- 로컬 MP4 1건과 YouTube 4건을 migration으로 추가했다.

## Result
- YouTube 주소 파서/미리보기 구간 검사 통과.
- `npx tsc --noEmit`, `npm run lint -- --quiet`, `npm run build` 통과.
- Supabase migration 원격 반영 및 REST 조회에서 샘플 5건 확인.
- 별도 production server의 `/media` 첫 HTML에서 저장 제목 5개와 YouTube ID 확인.

## History Index
- 아직 분리된 이력이 없다.
