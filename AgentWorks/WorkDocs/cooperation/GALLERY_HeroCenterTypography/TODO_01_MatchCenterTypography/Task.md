# Task

## Context
- 선택 후 중앙 검은 박스에 표시되는 흰 카테고리 글씨가 주변 회색 글씨보다 크다.

## Current Understanding
- WordButton과 CenterWord에 서로 다른 반응형 font-size가 지정되어 있었다.

## Observed Issues
- 중앙 글씨는 최대 28px, 주변 글씨는 최대 23px이었다.

## Decision Notes
- CenterWord가 WordButton과 같은 font-size 범위를 사용하도록 한다.

## Implementation Notes
- 데스크톱을 `clamp(17px, 1.45vw, 23px)`로 통일했다.
- 모바일을 `clamp(15px, 4.4vw, 18px)`로 통일했다.

## Result
- ESLint 통과
- 메인 페이지 HTTP 200 확인

## History Index
- 아직 분리된 이력이 없다.
