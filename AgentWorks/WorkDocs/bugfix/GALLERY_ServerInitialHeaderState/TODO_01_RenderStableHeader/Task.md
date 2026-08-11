# Task

## Bug Context
- 새로고침 시 말풍선, 링크 버튼과 관리자 톱니가 보이지 않다가 늦게 나타났다.
- 개발 환경 왼쪽 하단에 Next.js `N` 표시가 노출됐다.

## Current Understanding
- 서버 HTML에는 localStorage 설정과 브라우저 인증 결과가 없어 조건부 요소가 빠졌다.
- 서버 Supabase client로 인증·설정을 읽어 Client Provider 초기 상태에 직렬화해야 한다.

## Observed Issues
- 캐시를 레이아웃 effect에서 적용해도 JS hydration 이전의 서버 첫 페인트는 바꿀 수 없다.

## Decision Notes
- 자리 예약이나 opacity 숨김이 아니라 실제 데이터를 서버 렌더링한다.
- 사용자별 관리자 세션을 읽으므로 페이지는 정적 생성 대신 요청별 동적 서버 렌더링을 사용한다.

## Fix Notes
- `LoadInitialAppState`가 관리자 이메일과 시작 설정을 병렬 조회한다.
- RootLayout이 초기 상태를 AuthSessionProvider와 InitialAppStateProvider에 전달한다.
- Gallery Controller와 공통 한마디 Manager가 서버 초기 설정으로 상태를 시작한다.
- `next.config.ts`의 `devIndicators`를 false로 설정했다.

## Result
- 첫 HTML부터 실제 말풍선·링크·관리자 설정 버튼 상태가 렌더링된다.
- 모든 route가 요청별 동적 서버 렌더링으로 빌드된다.
- ESLint, TypeScript 검사와 Next.js 프로덕션 빌드가 통과했다.

## History Index
- 아직 분리된 이력이 없다.
