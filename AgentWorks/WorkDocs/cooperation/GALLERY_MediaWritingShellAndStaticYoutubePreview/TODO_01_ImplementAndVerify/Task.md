# Task

## Context
- 글쓰기 게시판과 영상 게시판의 상단 구조를 통일하고 YouTube 썸네일 iframe을 제거한다.
- 관리자에게만 작성/편집/삭제/순서 관리 UI를 제공한다.

## Current Understanding
- Media Page만 50px 비고정 헤더와 둥근 프레임, 초대형 제목을 사용한다.
- YouTube UI 완전 비노출은 썸네일 iframe을 정적 이미지로 바꿔야 가능하다.
- 글쓰기와 관리는 제목 옆 관리자 toolbar, 순서 이동은 카드 drag, 편집/삭제는 편집 popup이 가장 간결하다.

## Observed Issues
- media_posts에 정렬 SSOT가 없고 update/delete RLS가 없다.
- DB가 빈 배열이면 DefaultMediaPosts가 다시 나타나 삭제 결과를 되돌리는 fallback이 있다.

## Decision Notes
- 별도 관리자 페이지 대신 같은 그리드의 관리 모드를 사용한다.
- 영상 교체는 파일 orphan 처리 범위가 커지므로 편집은 제목/내용/스튜디오에 한정하고 새 영상은 글쓰기로 등록한다.

## Initial Render Harness
- 저장값: media_posts.sort_order와 기존 게시물 데이터.
- SSOT: Supabase media_posts.
- 서버 초기 조회를 sort_order 기준으로 정렬하고 빈 배열도 실제 저장 상태로 사용한다.

## Implementation Notes
- 영상 게시판의 헤더, A 홈 링크, 제목 크기를 글쓰기 게시판 셸과 통일했다.
- YouTube 목록 카드는 정적 썸네일을 사용하고 상세 팝업에서만 원본 iframe을 생성한다.
- 관리자에게만 글쓰기와 게시물 관리 버튼을 노출하고 같은 그리드에서 편집, 삭제, drag reorder를 지원한다.
- `media_posts.sort_order`와 관리자 update/delete RLS 및 영상 저장소 delete policy를 원격 DB에 적용했다.
- 서버 초기 조회가 저장된 정렬을 사용하며 빈 게시판도 fallback 샘플로 되돌리지 않는다.

## Result
- 상태 정규화 테스트, ESLint, TypeScript와 Next.js production build가 통과했다.
- `/media` 서버 첫 HTML에서 저장 게시물 내용, 정적 YouTube 썸네일, 홈 링크가 확인됐고 상세 iframe과 공개 관리 버튼은 렌더링되지 않았다.
- 원격 REST 조회에서 5개 게시물 모두 유효한 `sort_order`를 반환했다.

## History Index
- 아직 분리된 이력이 없다.
