# 전체 게시판 한마디 설정 공유

## Summary
- 시작페이지에서 설정한 한마디 목록을 모든 게시판의 A 로고 옆에 공통 적용했다.

## Background
- 시작페이지는 설정 문장을 전달했지만 다른 게시판의 AdminBrand는 고정 기본 문장을 사용했다.

## Scope
- 문장을 직접 전달하지 않는 AdminBrand의 공통 설정 로드
- 브라우저 캐시 우선 표시와 Supabase 최신값 동기화
- 빈 문장 목록의 전체 게시판 말풍선 숨김 처리

## References
- `src/components/AdminBrand/AdminBrand.tsx`
- `src/managers/StartPageDailyMessageManager.ts`
- `src/managers/StartPageCustomizationManager.ts`

## Current Status
- 구현과 정적 검사 및 프로덕션 빌드를 완료했다.
