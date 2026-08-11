# Task

## Context
- 페이지 순서 편집의 빨간색·파란색 방향 표시를 부드러운 파스텔 톤으로 바꾼다.

## Current Understanding
- 작성기와 편집기가 각 CSS 모듈에 같은 방향 스타일을 중복 보유한다.

## Observed Issues
- 다음 방향 `#ff2f2f`, 복귀 방향 `#1f7dff`가 고채도 원색이다.

## Decision Notes
- 다음 방향은 `#f2a7a7`, 복귀 방향은 `#9ebcf2`로 통일하고 글자는 대비되는 어두운 색을 사용한다.

## Initial Render Harness
- 저장값을 변경하지 않는 스타일 수정이므로 해당 없음.

## Fix Notes
- 작성기와 카드 편집기의 방향 버튼 색상을 동일한 파스텔 팔레트로 변경했다.

## Result
- 전체 ESLint, diff 검사와 실행 중인 개발 서버의 `/gallery` 200 응답을 확인했다.

## History Index
- 아직 분리된 이력이 없다.
