# 시작 설정 포커스와 2단 메뉴 수정

## Summary
- 카테고리명 입력 시 포커스가 Close 버튼으로 이동하는 문제를 수정하고 시작 설정을 2단 메뉴로 구성한다.

## Background
- 카테고리명을 입력할 때 Controller 상태 변경으로 close callback이 새로 생성되며 focus effect가 재실행됐다.
- 시작 페이지 톱니 버튼이 카테고리 편집창을 바로 열어 추가 설정을 확장할 상위 메뉴가 없었다.

## Scope
- 최초 진입 1회만 입력 포커스 적용
- 시작 페이지 설정 상위 메뉴 추가
- `카테고리 설정` 버튼형 항목에서 기존 편집창 진입
- 편집창에서 설정 목록으로 돌아가기
- 향후 설정 항목을 같은 목록에 추가할 수 있는 구조

## References
- `src/panels/layered/PageCustomizationLayeredPanel/`
- `src/panels/layered/StartPageCustomizationLayeredPanel/`
- `src/panels/base/GalleryBasePanel/controller/GalleryBasePanelController.ts`

## Current Status
- 수정과 검증 완료
