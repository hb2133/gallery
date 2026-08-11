# Task

## Context
- 사진 게시판과 같은 인라인 영상 카테고리 관리를 제공한다.

## Current Understanding
- 기존 `SaveMediaPageCustomization`을 재사용하면 설정 팝업과 SSOT가 유지된다.

## Observed Issues
- 선택 중인 카테고리를 삭제하면 필터 fallback이 필요하다.

## Decision Notes
- 별도 API 없이 기존 저장 action과 사진 게시판 UI 패턴을 재사용했다.

## Initial Render Harness
- SSOT는 `media_page_settings.categories`다.
- 서버 초기 상태의 카테고리를 그대로 렌더링하고 저장 후 같은 snapshot shape을 갱신한다.

## Implementation Notes
- 관리자에게만 삭제와 추가 입력을 노출한다.
- 마지막 카테고리 삭제를 막고 삭제된 활성 필터는 전체로 돌린다.

## Result
- source TypeScript, ESLint, production build 통과.

## History Index
- 아직 분리된 이력이 없다.
