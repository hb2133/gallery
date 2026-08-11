# 헤더 초기 상태 깜빡임 제거 및 개발 표시 숨김

## Summary
- 한마디, 외부 링크와 관리자 설정 버튼을 서버 첫 HTML부터 실제 상태로 렌더링한다.
- Next.js 개발 모드의 왼쪽 하단 `N` 표시를 비활성화했다.

## Background
- 인증과 시작 설정이 브라우저 hydration 이후에만 준비돼 헤더 요소가 늦게 나타났다.

## Scope
- Supabase 서버 초기 상태 로드
- 인증·시작 설정 Provider 초기값 주입
- 시작 패널과 공통 AdminBrand의 서버 초기값 사용
- Next.js 개발 표시 비활성화

## References
- `src/managers/InitialAppStateManager.ts`
- `src/app/shell/InitialAppStateProvider.tsx`
- `src/app/shell/AuthSessionProvider.tsx`
- `src/app/layout.tsx`
- `next.config.ts`

## Current Status
- 구현과 정적 검사 및 동적 서버 렌더링 프로덕션 빌드를 완료했다.
