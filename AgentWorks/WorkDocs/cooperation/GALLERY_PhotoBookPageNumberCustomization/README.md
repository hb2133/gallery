# 책넘김 페이지 번호 위치와 색상 투명도 설정

## Summary
- 책넘김 페이지의 번호를 페이지 안쪽 좌우 하단에 숫자로 표시하고, 글자 색상과 투명도를 게시글별로 설정할 수 있게 했다.

## Background
- 기존에는 페이지 번호가 검은 배경의 `0p` 형태로 표시되었고 게시글별 스타일 설정이 없었다.

## Scope
- 책 좌우 페이지 번호 배치, 숫자 표기, 작성·편집 UI, Supabase 저장 및 서버 초기 상태 연결.

## References
- `src/components/PhotoPageNumberStyleControl/`
- `src/panels/layered/ImageDetailLayeredPanel/`
- `supabase/migrations/20260810153000_photo_page_number_style.sql`

## Current Status
- 구현, 마이그레이션, 린트와 빌드는 완료했다. 비기본 저장값으로 서버 첫 HTML을 검증하는 하네스 항목은 남아 있다.
