# Task

## Bug Context
- 2번 스타일에서 화살표가 새 방향 위치로 이동하기 전 계속 클릭하면 이전 방향 버튼으로 다음 페이지가 중복 이동한다.

## Current Understanding
- `ImageSwipe` state만 중복 전환을 막고 있어 첫 `SetImageSwipe`가 렌더되기 전에는 연속 클릭이 같은 이전 closure를 통과할 수 있다.

## Observed Issues
- 전환 중 버튼이 시각적으로 남아 있고 disabled 상태가 아니어서 반복 입력이 가능해 보인다.

## Decision Notes
- 렌더 주기와 무관하게 즉시 갱신되는 ref를 전환 잠금으로 사용한다.
- 새 페이지와 화살표 방향이 렌더되는 다음 animation frame까지 잠금을 유지한다.

## Initial Render Harness
- 저장값이나 첫 렌더를 변경하지 않는 클라이언트 상호작용 수정이므로 해당 없음.

## Fix Notes
- `IsImageTransitionLockedReference`로 버튼 및 포인터 전환의 중복 진입을 차단했다.
- 전환 중 화살표 버튼에 native disabled를 적용했다.
- 전환 완료 후 다음 animation frame에 잠금을 해제한다.

## Result
- TypeScript, 전체 ESLint, 프로덕션 build가 통과했다.

## History Index
- 아직 분리된 이력이 없다.
