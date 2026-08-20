# Task

## Bug Context
- Writing 직사각형 썸네일 외곽이 불규칙한 종이 가장자리로 표시된다.

## Current Understanding
- `CreatePaperEdge`가 게시글별 polygon을 만들고 `.BookCard`의 `clip-path`에 전달한다.

## Observed Issues
- 외곽만 제거하면 되므로 썸네일 내부 오버레이와 호버 레이아웃은 변경할 필요가 없다.

## Decision Notes
- CSS 덮어쓰기 대신 생성 함수와 사용처를 삭제해 불필요한 런타임 계산도 함께 제거한다.

## Initial Render Harness
- 저장 기능 변경 없음.

## Fix Notes
- 랜덤 종이 외곽 생성 함수, CSS 변수, `clip-path`와 관련 transition을 제거했다.

## Result
- 관련 참조가 남지 않은 것을 확인했고 ESLint, TypeScript와 diff 검사가 통과했다.

## History Index
- 아직 분리된 이력이 없다.
