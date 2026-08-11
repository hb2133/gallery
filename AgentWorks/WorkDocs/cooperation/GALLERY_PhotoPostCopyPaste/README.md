# 사진 게시글 편집값 복사 및 새 게시글 붙여넣기

## Summary
- 사진 게시글 편집창의 현재 값을 임시 복사하고 새 게시글 작성창에 한 번에 붙여넣는다.

## Background
- 기존 내용 이미지는 문자열 URL을 저장 입력으로 재사용할 수 있다.
- 썸네일 저장 입력은 파일만 받으므로 기존 썸네일 URL 재사용을 지원하도록 확장해야 한다.

## Scope
- 카테고리, 공개 상태, 썸네일, 텍스트 레이어, 내용 이미지와 5×5 배치를 복사한다.
- 복사본은 현재 페이지의 관리자 컨트롤러 메모리에만 보관하며 새로고침 후에는 유지하지 않는다.
- 붙여넣은 게시글을 저장하면 새 게시글 ID로 생성하고 원본은 변경하지 않는다.

## References
- `src/panels/base/GalleryIndexBasePanel/`
- `src/panels/layered/PhotoCardEditorLayeredPanel/`
- `src/panels/layered/PhotoPostComposerLayeredPanel/`
- `src/managers/PhotoPostManager.ts`

## Current Status
- 구현 및 검증 완료
