# 시작 박스 시각 개선 및 헤더 링크 설정

## Summary
- 카테고리 선택 후 합성 이미지의 흐린 인상을 제거하고 라이트 테마 목적지 호버를 절제했다.
- 시작 페이지 설정에 오른쪽 상단 외부 링크의 텍스트와 URL을 관리하는 기능을 추가했다.

## Background
- 합성 이미지가 애니메이션 완료 후에도 `opacity: .82`로 유지됐다.
- 펼쳐진 목적지 타일의 라이트 테마 호버가 검은 오버레이, 큰 그림자와 확대를 함께 사용했다.
- 헤더 외부 링크는 `GalleryHeaderLinks` 상수로 고정돼 관리자가 변경할 수 없었다.

## Scope
- 합성 이미지 최종 불투명도 조정
- 라이트 테마 목적지 타일 호버 강도 축소
- 링크 텍스트·URL 편집 LayeredPanel
- 링크 조합별 표시·비활성·숨김 처리
- 시작 페이지 설정 캐시 및 Supabase 저장 구조 확장
- 원격 Supabase 마이그레이션 적용

## References
- `src/panels/base/GalleryBasePanel/`
- `src/panels/layered/StartPageLinkLayeredPanel/`
- `src/managers/StartPageCustomizationManager.ts`
- `supabase/migrations/20260729120000_start_page_header_link.sql`

## Current Status
- 구현, 원격 DB 반영, 정적 검사와 프로덕션 빌드를 완료했다.
