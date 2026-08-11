# Task

## Context
- 영상 팝업 컨트롤의 형태와 간격, 날짜 표기를 다듬는다.

## Current Understanding
- 볼륨 range를 absolute 세로 요소로 바꾸면 컨트롤 가로폭에 영향을 주지 않는다.

## Observed Issues
- 기존 설정 SVG는 톱니보다 방사형 아이콘에 가까웠다.

## Decision Notes
- 외부 아이콘 패키지 없이 표준 톱니 글리프와 native range를 사용했다.

## Initial Render Harness
- 새 저장값 없음. 기존 게시물 날짜 snapshot을 사용한다.

## Implementation Notes
- 볼륨 hover/focus 시 세로 슬라이더가 나타난다.
- 날짜를 `2026.08.` 형식으로 정규화했다.

## Result
- 날짜 단위 테스트, ESLint, production build 통과.

## History Index
- 아직 분리된 이력이 없다.
