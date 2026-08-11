# 영상 페이지 행별 카드 개수 설정

## Summary
- 영상 페이지 설정에서 한 줄의 영상 카드 개수를 1~5개로 조절한다.

## Background
- 기존 그리드는 desktop 5개로 고정되어 관리자가 밀도를 조절할 수 없었다.

## Scope
- 페이지 설정 메뉴, 행 개수 LayeredPanel, Supabase 저장, 서버 초기 상태, 그리드 CSS.

## References
- `src/panels/layered/MediaGridColumnsLayeredPanel/`
- `supabase/migrations/20260810162000_media_grid_columns.sql`

## Current Status
- 구현과 원격 마이그레이션 완료. 비기본 개수 저장의 첫 HTML 검증은 남아 있다.
