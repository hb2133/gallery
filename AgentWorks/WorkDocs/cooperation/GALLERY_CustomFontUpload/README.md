# 사용자 웹폰트 업로드 및 적용

## Summary
- 관리자가 폰트 파일을 업로드해 카테고리 바깥·중앙·목적지 글자에 웹폰트로 적용할 수 있게 했다.

## Background
- 직접 font-family 입력은 방문자 기기에 폰트가 없으면 동일하게 표시되지 않는다.

## Scope
- WOFF2·WOFF·TTF·OTF 업로드
- Supabase Storage 버킷과 관리자 정책
- 세 타이포그래피 영역별 업로드 UI
- 저장된 URL 기반 동적 @font-face

## References
- `src/managers/StartPageCustomizationManager.ts`
- `src/panels/layered/StartPageCustomizationLayeredPanel/`
- `src/panels/base/GalleryBasePanel/sections/HeroSection/HeroSection.tsx`
- `supabase/migrations/20260729130000_start_page_font_storage.sql`

## Current Status
- 후속 요청으로 홈페이지의 폰트 업로드 UI·실행·적용 기능을 제거했다.
- 기존 원격 Storage 파일은 파괴적으로 삭제하지 않고 보존했다.
