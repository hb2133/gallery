# Task

## Context
- 하단 관리 행의 편집 버튼이 카드 편집 대상과 시각적으로 떨어져 있었다.

## Current Understanding
- 드래그 핸들은 하단에 유지하고 편집 진입만 카드 내부 우측 상단에 배치한다.

## Observed Issues
- 추가 차단 문제 없음.

## Decision Notes
- 기존 컨트롤러와 저장 경로를 재사용하고 새 추상화는 추가하지 않았다.

## Initial Render Harness
- 저장 기능 변경이 아니므로 해당 없음.

## Fix Notes
- 관리 모드에서 카드 우측 상단에 항상 보이는 편집 버튼을 추가하고 하단 중복 버튼을 제거했다.

## Result
- 구현 완료. `npm run lint`와 `npm run build`를 통과했다.

## History Index
- 아직 분리된 이력이 없다.
