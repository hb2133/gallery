# 카테고리 고급 타이포그래피 편집

## Summary
- 카테고리 바깥·선택 후 중앙·게시판 이동 글자 스타일을 분리했다.
- 직접 font-family 입력과 안정적인 숫자 크기 편집을 추가했다.

## Background
- 카테고리 바깥과 중앙 글자가 같은 스타일을 공유했고 목적지 설정이 카테고리 카드 안에 섞여 있었다.
- 제어된 숫자 입력이 빈 값 순간 최소값 8을 강제로 넣었다.

## Scope
- 임의 CSS font-family 입력
- 크기 입력 완료 시 8~64px 보정
- 카테고리 바깥·중앙 스타일 분리
- 게시판 이동 글자 설정 별도 섹션
- 캐시·서버 초기 상태·Supabase 저장 확장

## References
- `src/panels/layered/StartPageCustomizationLayeredPanel/`
- `src/panels/base/GalleryBasePanel/sections/HeroSection/HeroSection.tsx`
- `supabase/migrations/20260729124500_start_page_category_center_typography.sql`

## Current Status
- 구현, 원격 DB 반영과 전체 검증을 완료했다.
