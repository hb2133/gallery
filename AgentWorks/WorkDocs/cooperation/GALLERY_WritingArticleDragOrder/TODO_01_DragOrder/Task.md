# Task

## Context
- 관리자 로그인 시 Writing 게시글을 드래그로 재정렬하고 순서를 유지한다.
- 버그 수정이면 `Bug Context`로 바꿔도 된다.

## Current Understanding
- 현재 기준 원인, 설계 방향, 작업 가설을 적는다.

## Observed Issues
- 런타임에서 확인된 현상이나 새로 발견된 문제를 적는다.

## Decision Notes
- 방향이 바뀐 이유와 폐기한 가설을 적는다.

## Initial Render Harness
- `writing_page_settings.article_order`를 초기 앱 상태에서 읽어 서버 첫 HTML과 hydration에 같은 순서를 사용한다.

## Implementation Notes
- 관리자에게만 카드 draggable을 열고 드래그 진입 시 전체 글 ID 순서를 갱신한다.
- 드래그 종료 시 기존 `article_order` JSONB에 저장하며 실패하면 이전 순서로 복구한다.

## Result
- 타입 검사와 린트를 통과했고 비관리자 카드에는 draggable이 노출되지 않는다.

## History Index
- 아직 분리된 이력이 없다.
