# 영상 게시판 카테고리 관리

## Summary
- 영상 카테고리 저장·관리·게시물 선택·카드 호버 표시를 구현했다.

## Background
- 카테고리와 게시물은 Supabase 공개 초기 snapshot에서 함께 읽는다.

## Scope
- 관리자 설정의 카테고리 CRUD, 작성/편집 선택, 썸네일 배지, DB 스키마.

## References
- `supabase/migrations/20260807183000_media_categories.sql`
- `src/panels/base/MediaBasePanel/`

## Current Status
- 원격 DB 적용 및 초기 HTML 검증 완료.
