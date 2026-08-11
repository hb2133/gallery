# 사진 게시물 드래그 순서 관리

## Summary
- 사진 글쓰기 문구와 게시물 관리 드래그 순서 저장을 구현했다.

## Background
- 사진 게시물에는 영구 순서 필드와 관리 모드가 없었다.

## Scope
- 상단 버튼, 관리 모드, 드래그 UI, `photo_posts.sort_order`, SSR 순서 조회.

## References
- `supabase/migrations/20260807190000_photo_post_management.sql`
- `src/panels/base/GalleryIndexBasePanel/`

## Current Status
- 원격 DB 적용 및 전체 검증 완료.
