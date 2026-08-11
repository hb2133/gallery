# Task

## Context
- 레퍼런스처럼 내용 이미지 위에서 두 보기방식 중 하나를 선택하고 작성·편집 모두 저장해야 했다.

## Current Understanding
- 공통 라디오형 컴포넌트를 두 패널이 공유하고 photo_posts의 단일 enum 성격 컬럼을 SSOT로 사용한다.

## Observed Issues
- 원격 기존 게시글은 모두 book이므로 비기본값 scroll의 서버 첫 HTML은 실제 선택 저장 후 추가 확인이 필요하다.

## Decision Notes
- 두 boolean 대신 `book | scroll` 단일 값과 DB check constraint를 사용해 동시에 두 방식이 선택되는 상태를 원천 차단했다.

## Initial Render Harness
- `photo_posts.default_view_mode`를 `load_photo_posts()`와 `unlock_photo_post()`가 반환하고 서버 초기 상태와 클라이언트 재조회가 같은 정규화를 사용한다. production `/gallery` 첫 HTML에서 현재 저장값 `DefaultViewMode:"book"`과 HTTP 200을 확인했다.

## Implementation Notes
- 공통 PhotoViewModeSelector를 작성·편집 내용 이미지 상단에 배치하고 role=radio/aria-checked로 단일 선택을 제공했다.
- 작성과 편집 저장, 복사·붙여넣기, 공개/잠금해제 RPC, 상세 화면 최초 보기까지 선택값을 연결했다.
- 새 글 작성의 페이지 순서 UI도 선택·삭제·이미지 추가와 내부 스크롤을 사용하는 레퍼런스형 구성으로 맞췄다.

## Result
- `npm run lint`, `npm run build`, production `/gallery` HTTP 200 통과. 원격 migration `20260810150000` 적용 및 목록 일치를 확인했다.

## History Index
- 아직 분리된 이력이 없다.
