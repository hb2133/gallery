# Task

## Context
- 표지 그라데이션이 항상 표시되어 원본 썸네일이 평소에도 어두워 보였다.

## Current Understanding
- 기존 ::after 그라데이션은 유지하고 opacity 상태만 카드 상호작용에 연결한다.

## Observed Issues
- 추가 차단 문제 없음.

## Decision Notes
- 기존 컴포넌트와 상태 흐름을 유지하는 최소 변경을 적용했다.

## Initial Render Harness
- 저장 기능 변경이 아니므로 해당 없음.

## Fix Notes
- 기본 opacity를 0으로 두고 hover와 focus-within에서 1로 전환하며 220ms 페이드를 적용했다.

## Result
- `npm run lint`와 `npm run build` 통과.

## History Index
- 아직 분리된 이력이 없다.
