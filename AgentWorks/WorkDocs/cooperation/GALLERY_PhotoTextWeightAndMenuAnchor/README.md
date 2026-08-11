# 사진 텍스트 굵기 선택과 메뉴 위치 개선

## Summary
- 사진 텍스트 굵기를 100–900 범위의 스크롤 선택 상자로 확장했다.
- 위쪽 플로팅 설정 메뉴를 대상 `::` 버튼 바로 위에 붙도록 수정했다.

## Background
- 굵기 선택이 Regular/Bold 두 단계뿐이었고, 위쪽 메뉴 위치가 고정 예상 높이를 사용해 버튼과 멀어졌다.

## Scope
- PhotoCardTextLayer 굵기 타입·정규화와 PhotoCardEditor 설정 메뉴 UI·위치 계산.

## References
- src/managers/PhotoCardCustomizationManager.ts
- src/panels/layered/PhotoCardEditorLayeredPanel/

## Current Status
- 완료. lint와 production build를 통과했다.
