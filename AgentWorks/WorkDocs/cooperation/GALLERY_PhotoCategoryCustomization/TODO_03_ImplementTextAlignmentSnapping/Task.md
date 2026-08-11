# Task

## Context
- 썸네일 텍스트를 PPT처럼 중앙 또는 다른 텍스트 좌표에 자동 정렬해야 한다.

## Current Understanding
- 저장 좌표는 기존 백분율 X/Y를 그대로 사용하고 드래그 중인 요소의 실제 크기로 정렬 기준을 계산한다.

## Decision Notes
- 이동 텍스트의 왼쪽·중앙·오른쪽과 위·중앙·아래 anchor를 비교한다.
- 캔버스 중앙과 다른 모든 텍스트 anchor를 정렬 target으로 사용한다.
- 1.25% 이내의 가장 가까운 target에 스냅한다.

## Initial Render Harness
- 기존 저장 좌표 형식과 서버 초기 상태를 그대로 사용하므로 초기 렌더링 데이터 계약은 바뀌지 않는다.

## Implementation Notes
- pointer 이동 시 실제 DOM 크기를 백분율로 환산한다.
- 가장 가까운 가로·세로 anchor를 독립적으로 스냅한다.
- 스냅 중 파란 가이드 선을 표시하고 drag 종료 시 제거한다.

## Result
- 중앙 및 다른 텍스트 anchor에 근접하면 자동 정렬되고 가이드가 표시된다.
- TypeScript, ESLint와 Next.js 프로덕션 빌드가 통과했다.

## History Index
- 아직 분리된 이력이 없다.
