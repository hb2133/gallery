# 사진 상세 팝업 화면 중앙 정렬 복원

## Summary
- route 진입 애니메이션 이후 사진 상세 팝업이 문서 좌표계에 묶이는 회귀를 수정한다.

## Background
- 페이지 아래쪽의 사진 카드를 열면 팝업도 아래쪽에 표시되어 휠을 내려야 했다.

## Scope
- 최상위 `<main>`의 transform containing block 제거.
- 모든 layered panel을 `document.body`에 portal 렌더링해 상위 layout 좌표계에서 분리.
- route 진입 페이드 유지.
- 사진 상세 팝업의 viewport 중앙 정렬 확인.
- 사진 게시판 상단 링크 문구를 `Back`으로 단순화.

## References
- `src/design/GlobalDesign.global.tsx`
- `src/app/panel_layer/PanelLayerHost.tsx`
- `src/panels/layered/ImageDetailLayeredPanel/ImageDetailLayeredPanel.module.css`

## Current Status
- 수정 및 검증 완료.
