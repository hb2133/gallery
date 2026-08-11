# Task

## Context
- 영상 게시판에서 선택한 카테고리의 게시물만 볼 수 있어야 한다.

## Current Understanding
- 기존 서버 초기 카테고리와 게시물 Category를 클라이언트 선택 상태로 필터링한다.

## Observed Issues
- 카테고리 삭제 후 선택값이 남을 수 있어 전체로 복귀하는 처리가 필요했다.

## Decision Notes
- 사진 게시판의 pill UI와 View Transition 흐름을 그대로 재사용했다.

## Initial Render Harness
- SSOT는 기존 `media_page_settings.categories`와 `media_posts.category`다.
- `InitialAppStateManager`가 전달한 값으로 첫 렌더링부터 필터 버튼을 만든다.
- production `/media` 첫 HTML에서 전체/기록/작업/여행 버튼을 확인했다.

## Implementation Notes
- Controller가 활성 카테고리와 표시 게시물을 소유한다.
- Section은 사진 게시판과 같은 pill 버튼과 필터 결과를 렌더링한다.

## Result
- 단위 테스트, TypeScript, ESLint, production build와 SSR 확인 통과.

## History Index
- 아직 분리된 이력이 없다.
