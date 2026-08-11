# 사진 내용 이미지 일괄 선택 삭제와 내부 스크롤

## Summary
- 사진 내용 이미지 편집에 일괄 선택·삭제를 추가하고 페이지 목록만 내부 스크롤되도록 변경했다.

## Background
- 이미지가 많으면 전체 EDIT 패널이 길어졌고 각 이미지의 X 버튼으로만 삭제할 수 있었다.

## Scope
- PhotoCardEditorLayeredPanel의 내용 이미지 선택 모드, 일괄 삭제, 페이지 목록 스크롤 영역.

## References
- src/panels/layered/PhotoCardEditorLayeredPanel/

## Current Status
- 완료. lint와 production build를 통과했다.
