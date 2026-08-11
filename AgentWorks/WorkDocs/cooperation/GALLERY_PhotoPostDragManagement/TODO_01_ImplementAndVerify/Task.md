# Task

## Context
- 사진 게시판에 영상 게시판과 같은 게시물 순서 관리가 필요하다.

## Current Understanding
- 영구 `sort_order`와 Controller drag snapshot/rollback 흐름이 필요하다.

## Observed Issues
- 기존 사진 편집 저장은 게시물을 목록 첫 위치로 이동시켰다.

## Decision Notes
- 영상 관리 패턴을 재사용하고 편집 저장은 기존 배열 위치를 유지하게 했다.

## Initial Render Harness
- SSOT는 Supabase `photo_posts.sort_order`다.
- `InitialAppStateManager`가 서버에서 sort order로 조회해 첫 HTML과 Client state에 전달한다.
- 원격 7개 행의 0부터 시작하는 순서와 production `/gallery` 첫 HTML을 확인했다.

## Implementation Notes
- `글쓰기`, `게시물 관리` 버튼과 관리 중 드래그 힌트를 추가했다.
- 저장 실패 시 드래그 전 snapshot으로 복구한다.

## Result
- 이동 순수 함수 테스트, ESLint, production build, migration/SSR 검증 통과.

## History Index
- 아직 분리된 이력이 없다.
