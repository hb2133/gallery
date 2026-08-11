# Task

## Context
- Writing 카드 외곽을 메인화면_2 레퍼런스보다 더 한지답게 만들고 호버 시 나머지 카드를 어둡게 한다.
- 버그 수정이면 `Bug Context`로 바꿔도 된다.

## Current Understanding
- 현재 기준 원인, 설계 방향, 작업 가설을 적는다.

## Observed Issues
- 런타임에서 확인된 현상이나 새로 발견된 문제를 적는다.

## Decision Notes
- 방향이 바뀐 이유와 폐기한 가설을 적는다.

## Initial Render Harness
- 저장형 기능이 아니며 글 ID 기반 결정적 외곽선을 서버와 클라이언트에서 동일하게 생성한다.

## Implementation Notes
- 외곽 점 간격을 촘촘히 하고 좌우의 간헐적인 찢김 깊이를 키웠다.
- 가는 교차 섬유 질감을 얹고 비활성 카드는 채도와 밝기를 낮췄다.

## Result
- 카드별 외곽이 174개 이상의 점으로 생성되고 호버 중 비활성 카드 필터가 적용됨을 브라우저로 확인했다.

## History Index
- 아직 분리된 이력이 없다.
