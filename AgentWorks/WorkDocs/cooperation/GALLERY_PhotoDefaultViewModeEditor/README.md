# 사진 게시글 기본 보기방식 선택

## Summary
- 사진 게시글 작성·편집에서 기본 보기방식을 책넘김 또는 상하좌우 중 하나로 선택하고 저장한다.

## Background
- 기존 게시글은 모두 책넘김으로 열렸고 작성·편집 UI에 기본 보기 선택이 없었다.

## Scope
- 공통 보기방식 선택 UI, 작성·편집 저장 흐름, 원격 DB 컬럼/RPC, 상세 열기 기본 모드.

## References
- Reference/2. 사진페이지/02 사진 게시글 편집.png
- src/components/PhotoViewModeSelector/
- supabase/migrations/20260810150000_photo_post_default_view_mode.sql

## Current Status
- 구현 및 원격 마이그레이션 완료. 현재 원격 게시글이 모두 기본값(book)이어서 scroll 저장값의 서버 첫 HTML 확인은 첫 실제 저장 후 남아 있다.
