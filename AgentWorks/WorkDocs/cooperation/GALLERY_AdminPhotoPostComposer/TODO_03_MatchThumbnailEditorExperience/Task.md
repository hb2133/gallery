# Task

## Context
- 새 게시글의 썸네일 설정은 기존 카드 `EDIT`와 시각 구조 및 편집 기능이 달라 이미지와 텍스트를 정확히 구성하기 어렵다.

## Requirements
- 썸네일 캔버스와 이미지 선택·변경·제거 액션을 명확하게 배치한다.
- 단일 제목 입력을 다중 텍스트 레이어로 대체한다.
- 각 텍스트의 내용, 폰트, 크기, 색상, 좌표를 편집하고 캔버스에서 드래그할 수 있게 한다.
- 중앙 및 다른 텍스트와의 스냅 정렬을 기존 편집기와 같은 방식으로 제공한다.
- 카테고리, 공개 상태, 내용 이미지 1~20장 규칙은 유지한다.

## Initial Render Harness
- 새 게시글 작성창은 관리자 상호작용으로만 열리며 작성 초안은 영속 상태가 아니다.
- 게시 결과는 기존 `photo_posts`와 `photo_card_customizations`에 함께 저장한다.
- 저장된 `text_layers`는 서버 초기 상태의 `NormalizePhotoCardCustomizations` 경로를 그대로 사용해 첫 HTML에 반영한다.

## Related Bug
- 중복 이미지 URL이 있는 게시글에서 좌표를 URL의 첫 일치 항목으로 찾으면, 저장한 위치와 뷰어의 인접 방향 판정이 달라진다.
- 이미지 순서와 레이아웃 순서를 우선 대응시켜 상하좌우 화살표를 복구한다.
- 빠른 내용 이미지 드래그에서 재배치 이벤트와 FLIP 애니메이션이 중첩된다.
- 작성기와 편집기의 드래그 반영 간격을 제한하고 이전 애니메이션을 취소하며, 드롭 시 마지막 슬롯을 확정한다.

## Adjacent UX Refinements
- 사진 카테고리 필터는 Chrome View Transition으로 기존 목록과 새 목록을 교차 전환한다.
- 시작 페이지의 사진·영상음악·긴글·한줄메모 이동은 전체 새로고침 대신 App Router의 클라이언트 이동을 사용한다.
- 새 route의 첫 프레임에는 짧은 공통 진입 애니메이션을 적용하고 reduced-motion 설정을 존중한다.

## Implementation Notes
- 작성기 썸네일 영역을 3:4 캔버스, 이미지 액션, 카테고리·공개 설정, 텍스트 레이어 인스펙터로 재구성했다.
- 텍스트 레이어 배열을 게시 시 `photo_card_customizations.text_layers`에 직접 저장한다.
- 중복 이미지 URL은 레이아웃 후보를 순서대로 한 번씩 소비하고, 뷰어는 같은 순번의 좌표를 우선 사용한다.
- 빠른 드래그는 72ms 간격으로 재배치를 반영하고 이전 FLIP 애니메이션을 취소하며 드롭 지점을 최종 반영한다.
- 카테고리 그리드는 View Transition을 사용하고, 시작 목적지 이동은 App Router client navigation으로 변경했다.

## Verification
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- production `/gallery` 첫 HTML에서 저장된 `ImageLayout`, `TextLayers`, 사용자 텍스트를 확인했다.
- 원격 `architecture-archive`의 1페이지 `(3,3)` 기준 오른쪽 이웃이 20페이지 `(4,3)`으로 판정됨을 확인했다.
- `git diff --check`
