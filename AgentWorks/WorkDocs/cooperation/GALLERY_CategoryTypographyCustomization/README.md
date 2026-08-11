# 카테고리 및 목적지 타이포그래피 설정

## Summary
- 네 카테고리의 바깥 이름과 전개 후 게시판 이동 글자를 각각 스타일링할 수 있게 했다.

## Background
- 기존 카테고리 설정은 바깥 이름과 이미지만 변경할 수 있었고 목적지 글자는 고정 문자열이었다.

## Scope
- 카테고리 이름 텍스트·폰트·크기·색상
- 게시판 이동 글자 텍스트·폰트·크기·색상
- HeroSection 표시 연결
- 캐시, 서버 초기 상태와 Supabase 저장 확장

## References
- `src/panels/layered/StartPageCustomizationLayeredPanel/`
- `src/panels/base/GalleryBasePanel/sections/HeroSection/HeroSection.tsx`
- `src/managers/StartPageCustomizationManager.ts`
- `supabase/migrations/20260729123000_start_page_category_typography.sql`

## Current Status
- 구현, 원격 DB 반영과 전체 검증을 완료했다.
