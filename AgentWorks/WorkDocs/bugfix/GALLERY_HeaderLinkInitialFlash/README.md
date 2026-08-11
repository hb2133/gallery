# 헤더 링크 기본값 깜빡임 제거

## Summary
- 새로고침 시 기본 `Instagram` 링크가 실제 설정값보다 먼저 보이던 현상을 제거했다.

## Background
- 한마디는 설정 로드 여부를 확인했지만 헤더 링크는 기본 설정을 즉시 렌더링하고 있었다.

## Scope
- 설정 로드 전 헤더 링크 숨김
- 캐시 또는 Supabase 설정 준비 후 실제 링크 표시

## References
- `src/panels/base/GalleryBasePanel/GalleryBasePanel.tsx`
- `src/panels/base/GalleryBasePanel/sections/HeaderSection/HeaderSection.tsx`

## Current Status
- 구현과 정적 검사 및 프로덕션 빌드를 완료했다.
