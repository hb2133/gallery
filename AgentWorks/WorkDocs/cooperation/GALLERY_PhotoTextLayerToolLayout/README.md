# 사진 텍스트 레이어 도구 재구성

## Summary
- 텍스트 목록을 선택·삭제·설정 중심으로 정리하고 설정 버튼에서만 상세 편집창을 열도록 했다.

## Background
- 레이어 선택과 상세 수정 항목이 한꺼번에 노출되어 목록과 설정의 관계가 불명확했다.

## Scope
- 사진 카드 편집기 텍스트 목록, 상세 설정 패널, 글자 굵기 저장·렌더링.

## References
- src/panels/layered/PhotoCardEditorLayeredPanel/, src/managers/PhotoCardCustomizationManager.ts

## Current Status
- 완료. lint와 production build를 통과했다.
