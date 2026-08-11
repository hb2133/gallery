# Task

## Context
- 굵기 선택 범위를 통상적인 9단계로 확장하고 위쪽 메뉴의 앵커 간격을 바로잡는다.

## Current Understanding
- 기존 FontWeight JSON 필드를 그대로 사용하되 허용값 정규화만 확장한다.
- 위쪽 메뉴는 예상 높이 좌표를 빼는 대신 버튼 위 좌표에 두고 자신의 실제 높이 100%만큼 이동해야 한다.

## Observed Issues
- 추가 차단 문제 없음.

## Decision Notes
- 새 폰트 시스템 없이 CSS 표준 숫자 굵기 100–900과 네이티브 select를 사용했다.

## Initial Render Harness
- SSOT와 저장 필드는 기존 photo_card_customizations의 TextLayers.FontWeight다.
- 기존 서버 초기 상태 경로와 동일한 NormalizePhotoCardTextLayers가 100–900 값을 보존한다.

## Fix Notes
- Thin, Extra Light, Light, Regular, Medium, Semi Bold, Bold, Extra Bold, Black을 5행 스크롤 선택 상자로 제공한다.
- 위쪽 메뉴는 버튼 top에서 8px 위에 배치한 뒤 translateY(-100%)를 적용해 실제 메뉴 하단이 버튼에 붙는다.
- 위·아래 가용 높이를 메뉴 max-height로 사용해 화면 밖 잘림을 줄였다.

## Result
- `npm run lint`와 `npm run build` 통과.

## History Index
- 아직 분리된 이력이 없다.
