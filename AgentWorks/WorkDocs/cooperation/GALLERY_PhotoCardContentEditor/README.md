# 사진 카드 썸네일 및 내용 이미지 통합 편집

## Summary
- 기존 `EDIT` 팝업에서 썸네일과 게시글 내용 이미지를 함께 수정한다.

## Background
- 기존 편집기는 카드 썸네일과 텍스트만 저장할 수 있었다.

## Scope
- `썸네일 수정`, `내용 이미지` 토글형 편집 영역.
- 기존 내용 이미지 제거, 새 이미지 추가, 1~20장 검증.
- 내용 이미지 5×5 좌표 배치 저장.

## References
- `src/panels/layered/PhotoCardEditorLayeredPanel/`
- `src/managers/PhotoPostManager.ts`
- `src/panels/base/GalleryIndexBasePanel/`

## Current Status
- 구현 및 검증 완료.
