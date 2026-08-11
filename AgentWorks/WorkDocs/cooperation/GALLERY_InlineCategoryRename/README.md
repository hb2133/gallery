# 게시판 카테고리 더블클릭 이름 변경

## Summary
- 사진·영상·글 게시판에서 관리자 더블클릭으로 카테고리 이름을 바로 변경할 수 있게 했다.

## Background
- 카테고리 이름을 변경할 경로가 없고 소속 게시물을 보면서 편집하기 어려웠다.

## Scope
- 세 게시판 카테고리 인라인 UI, 컨트롤러 상태 갱신, Supabase 원자적 이름 변경 함수.

## References
- src/managers/ArchiveCategoryManager.ts, src/panels/base/*BasePanel/, supabase/migrations/20260810130000_archive_category_rename.sql

## Current Status
- 완료. lint와 production build를 통과했다.
