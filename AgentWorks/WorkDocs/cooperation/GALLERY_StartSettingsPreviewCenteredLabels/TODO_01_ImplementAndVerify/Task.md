# Task

## Context
- 미리보기 라벨이 하단의 검은 반투명 배경 위에 표시되어 실제 시작페이지와 모습이 달랐다.

## Current Understanding
- 마크업 변경 없이 small 라벨의 위치·배경·패딩만 실제 페이지 표현에 맞춘다.

## Observed Issues
- 추가 차단 문제 없음.

## Decision Notes
- 기존 컴포넌트와 상태 흐름을 유지하는 최소 변경을 적용했다.

## Initial Render Harness
- 저장 기능 변경이 아니므로 해당 없음.

## Fix Notes
- 라벨 배경과 패딩을 제거하고 left/top 50% 및 translate로 정확히 중앙 정렬했다.

## Result
- `npm run lint`와 `npm run build` 통과.

## History Index
- 아직 분리된 이력이 없다.
