# Task

## Context
- 기존 3:4 비율이 요청한 A5 표지 비율과 달랐다.

## Current Understanding
- A5 규격의 가로 148, 세로 210 비율을 CSS에 직접 사용한다.

## Observed Issues
- 추가 차단 문제 없음.

## Decision Notes
- 기존 컨트롤러와 저장 경로를 재사용하고 새 추상화는 추가하지 않았다.

## Initial Render Harness
- 저장 기능 변경이 아니므로 해당 없음.

## Fix Notes
- 두 표지 렌더링 영역을 aspect-ratio: 148 / 210으로 변경했다.

## Result
- 구현 완료. `npm run lint`와 `npm run build`를 통과했다.

## History Index
- 아직 분리된 이력이 없다.
