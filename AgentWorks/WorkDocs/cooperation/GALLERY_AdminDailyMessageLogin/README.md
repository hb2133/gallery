# 관리자 하루 문구와 로그인 진입 UI

## Summary
- 공통 헤더의 Archive 텍스트를 관리자 하루 문구로 교체하고 숨겨진 관리자 로그인 진입 UI를 추가한다.

## Background
- 메인과 각 카테고리 화면에서 상단 왼쪽의 A 브랜드 UI를 각각 구현하고 있었다.
- 관리자가 이용자에게 노출할 하루 문구와 일반 이용자에게 방해되지 않는 로그인 진입 방식이 필요하다.

## Scope
- 모든 공통 헤더에 동일한 관리자 브랜드 컴포넌트를 적용한다.
- A 박스의 일반 클릭은 기존 홈 이동을 유지하고 Ctrl+클릭에서만 로그인 모달을 연다.
- 실제 인증 API 연결은 이번 예시 UI 범위에 포함하지 않는다.

## References
- `src/components/AdminBrand/`
- `src/core/localization/ArchiveStrings.ts`

## Current Status
- 구현 및 검증 완료
