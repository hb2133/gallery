# 시작 페이지 카테고리 및 이미지 설정

## Summary
- 관리자가 시작 페이지의 네 카테고리 이름과 선택 이미지를 수정하고 Supabase에 저장한다.

## Background
- 시작 페이지 설정 팝업은 항목 안내만 제공하고 실제 입력과 저장 기능이 없었다.
- 선택 이미지가 네 방향 박스마다 독립적으로 반복되어 한 장의 이미지처럼 이어지지 않았다.

## Scope
- 네 카테고리 이름 입력과 저장
- 카테고리별 이미지 업로드와 정사각형 미리보기
- Supabase 설정 테이블, Storage bucket과 RLS
- 선택 이미지 한 장을 전체 Stage에 배치하고 다섯 박스 영역으로 마스킹
- 공개 설정 조회와 관리자 전용 쓰기 검증

## References
- `supabase/migrations/20260729080833_start_page_customization.sql`
- `src/managers/StartPageCustomizationManager.ts`
- `src/panels/layered/StartPageCustomizationLayeredPanel/`
- `src/panels/base/GalleryBasePanel/`

## Current Status
- 구현, 원격 Supabase 적용과 검증 완료
