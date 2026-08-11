# Task

## Context
- 2번 스타일에서 다음 페이지의 이동 방향이 달라지면 화살표 위치가 순간적으로 바뀐다.

## Current Understanding
- 같은 역할의 버튼은 React에서 유지되지만 방향 클래스가 서로 다른 위치 속성을 사용해 보간되지 않았다.

## Observed Issues
- 좌우는 left/right, 상하는 top/bottom을 혼용해 CSS transition이 위치를 이어서 계산할 수 없다.

## Decision Notes
- 모든 방향을 left/top 좌표로 통일하고 420ms easing으로 이동시킨다.
- 새 애니메이션 상태나 타이머는 추가하지 않는다.

## Initial Render Harness
- 저장값을 변경하지 않는 클라이언트 표시 전환이므로 해당 없음.

## Fix Notes
- 방향을 `data-direction`으로 표현하고 left/top/transform 전환을 추가했다.
- hover 미세 이동과 reduced-motion 예외를 유지했다.

## Result
- TypeScript, 전체 ESLint, diff 검사와 실행 중인 개발 서버의 `/gallery` 200 응답을 확인했다.

## History Index
- 아직 분리된 이력이 없다.
