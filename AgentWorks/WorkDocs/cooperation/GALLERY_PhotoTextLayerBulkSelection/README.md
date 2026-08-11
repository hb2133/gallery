# 사진 텍스트 레이어 일괄 선택 삭제

## Summary
- 사진 카드 편집기의 텍스트 레이어를 체크박스로 복수 선택하고 한 번에 삭제할 수 있게 했다.
- 각 텍스트 행의 설정 버튼은 해당 행에 붙는 박스형 편집 UI를 연다.

## Background
- 선택과 삭제 버튼이 각 행에 반복되어 여러 텍스트를 정리하기 불편했다.
- 설정 항목이 목록 아래 공용 영역에 나타나 어느 텍스트의 설정인지 파악하기 어려웠다.

## Scope
- PhotoCardEditorLayeredPanel의 텍스트 레이어 선택·삭제·설정 UI.

## References
- src/panels/layered/PhotoCardEditorLayeredPanel/

## Current Status
- 완료. lint와 production build를 통과했다.
