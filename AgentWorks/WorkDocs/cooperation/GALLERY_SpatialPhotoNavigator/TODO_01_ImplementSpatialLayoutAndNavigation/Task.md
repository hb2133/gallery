# Task

## Context
- 가로 보기에서 사진을 좌우뿐 아니라 상하좌우로 배치하고 탐색해야 한다.

## Current Understanding
- 레퍼런스는 칸 단위 2차원 연결 맵이다.
- 사진이 없는 위치는 이동할 수 없어야 하므로 단순 배열 순서와 별도 좌표가 필요하다.

## Observed Issues
- `image_paths`는 순서만 저장해 상하 관계를 표현할 수 없다.
- 기존 상세 UI는 이전·다음 화살표와 좌우 전환 방향만 지원한다.

## Decision Notes
- 관리자 배치판은 5×5, 게시글 사진은 최대 20장으로 두어 빈 칸을 만들 수 있게 한다.
- 사진을 포인터로 드래그하면 이동 경로의 슬롯들이 순서대로 한 칸씩 비켜나는 방식으로 재배치한다.
- 책 보기 순서는 `image_paths`를 유지하고 2번 보기만 좌표를 사용한다.

## Initial Render Harness
- 좌표 SSOT는 Supabase `photo_posts.image_layout`이다.
- 서버 초기 상태와 브라우저 동기화가 모두 `NormalizePhotoPosts`를 사용한다.
- 기존 행은 migration에서 5열 행 우선 좌표로 backfill한다.
- 좌표가 없거나 충돌하면 서버·브라우저 공통 normalize가 첫 빈 칸으로 보정한다.

## Implementation Notes
- 작성·편집 UI에 5×5 미니맵과 터치·마우스 드래그 재배치를 추가했다.
- FLIP 위치 애니메이션과 잡은 사진의 떠오름 상태를 적용했다.
- 현재 사진의 좌표에서 정확히 한 칸 인접한 사진만 탐색 대상으로 계산한다.
- 좌·우·상·하 방향에 맞는 진입 애니메이션을 추가했다.
- 원격 migration `20260730160000`을 적용하고 기존 행 backfill을 확인했다.

## Result
- 원격 migration, 기존 행 backfill, TypeScript, ESLint, production build와 서버 첫 HTML 좌표를 확인했다.

## History Index
- 아직 분리된 이력이 없다.
