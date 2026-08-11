# 초기 테마 및 한마디 깜빡임 개선

## Summary
- 다크모드 새로고침 시 테마 문구와 중앙 박스가 반대로 보이던 초기 깜빡임을 제거했다.
- 시작 페이지 설정을 캐시해 한마디가 Supabase 응답 뒤에 늦게 나타나는 현상을 줄였다.

## Background
- `<html>`에는 초기 테마 스크립트가 적용됐지만 시작 패널이 별도 React 상태로 테마를 다시 지정했다.
- 한마디는 Supabase 설정 로드 전까지 빈 배열을 전달해 말풍선을 렌더링하지 않았다.

## Scope
- HTML 테마 속성을 시작 페이지 시각 상태의 단일 기준으로 사용
- 테마 전환 버튼 문구를 CSS로 즉시 전환
- 시작 페이지 설정의 로컬 캐시 읽기·쓰기
- 캐시 우선 표시 후 Supabase 최신값 동기화
- 한마디 무작위 선택을 페인트 전 마이크로태스크로 반영

## References
- `src/managers/ThemeManager.ts`
- `src/managers/StartPageCustomizationManager.ts`
- `src/panels/base/GalleryBasePanel/`
- `src/components/AdminBrand/AdminBrand.tsx`

## Current Status
- 구현과 정적 검사 및 프로덕션 빌드를 완료했다.
