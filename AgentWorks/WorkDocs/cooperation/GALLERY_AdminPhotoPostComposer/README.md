# 관리자 사진 게시글 작성 및 업로드

## Summary
- 관리자 전용 사진 게시글 작성창과 다중 이미지 업로드를 구현했다.
- 게시된 글은 카드, 카테고리 필터, 책/스크롤 상세 보기에 연결된다.

## Background
- 기존 사진 게시글은 코드에 고정되어 관리자가 새 글을 만들 수 없었다.

## Scope
- Supabase `photo_posts` 및 공개 이미지 Storage.
- 관리자 전용 제목·카테고리·공개 상태 작성 UI.
- 선택 썸네일 1장과 필수 내용 이미지 1~20장을 분리한 토글형 업로드 UI.
- 기존 `EDIT` 팝업과 같은 상단 단일 아코디언 및 썸네일/내용 작업 공간 구조.
- 작성 단계에서도 기존 `EDIT`와 동일한 다중 텍스트 레이어·타이포그래피·드래그 정렬 경험.
- 서버 초기 게시글 로딩과 동적 상세 포토북 연결.

## References
- `src/managers/PhotoPostManager.ts`
- `src/managers/InitialAppStateManager.ts`
- `src/panels/layered/PhotoPostComposerLayeredPanel/`
- `src/panels/base/GalleryIndexBasePanel/`
- `supabase/migrations/20260730150000_photo_posts.sql`

## Current Status
- 구현 및 검증 완료.
