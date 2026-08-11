# Task

## Bug Context
- 사진 카드가 페이지 아래쪽에 있을 때 상세 팝업을 열면 화면 중앙이 아니라 문서 아래쪽에 표시된다.

## Current Understanding
- 공통 route 진입 애니메이션이 `body > main`에 최종 `transform: translateY(0)`을 유지한다.
- transform이 적용된 조상은 `position: fixed` 자식의 containing block이 되어 팝업의 viewport 고정을 깨뜨린다.

## Observed Issues
- 상세 backdrop 자체는 `position: fixed; inset: 0`이지만 변형된 `<main>` 아래에서 렌더링된다.

## Decision Notes
- route 진입 효과는 유지하되 최상위 `<main>`에서는 위치 transform을 사용하지 않는다.
- 공통 `PanelLayerHost`에서 body portal을 사용해 이후 조상 transform 회귀도 차단한다.

## Initial Render Harness
- 저장형 기능이 아니므로 해당 없음.

## Fix Notes
- `RoutePanelEnter`를 opacity 전환만 사용하도록 변경했다.
- 사진 상세, 새 게시글, 썸네일 수정, 페이지 설정 등 모든 layered panel을 `document.body`로 portal 렌더링한다.
- 사진 게시판 왼쪽 상단 `Back to index`를 `Back`으로 변경했다.

## Result
- 모든 layered panel이 `document.body` 아래에서 viewport 기준으로 렌더링된다.
- route 진입 페이드는 유지되며 최상위 `<main>`에는 transform이 남지 않는다.
- 사진 게시판 상단 링크는 `Back`으로 표시된다.
- TypeScript, ESLint, production build, diff check를 통과했다.

## History Index
- 아직 분리된 이력이 없다.
