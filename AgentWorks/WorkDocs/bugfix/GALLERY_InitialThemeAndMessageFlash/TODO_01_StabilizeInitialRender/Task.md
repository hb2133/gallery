# Task

## Bug Context
- 다크모드에서 새로고침하면 테마 버튼이 잠시 `Dark`로 보인 뒤 `Light`로 바뀌었다.
- 중앙 타일도 잠시 검은색으로 보인 뒤 흰색으로 바뀌었다.
- 한마디 말풍선은 설정 로드가 끝난 뒤에 나타났다.

## Current Understanding
- 초기 스크립트는 `<html data-theme>`를 페인트 전에 설정하고 있었다.
- 시작 패널의 `data-theme`는 `IsDarkTheme=false`로 서버 렌더링돼 초기 스크립트와 충돌했다.
- 한마디는 `IsStartCustomizationLoaded` 전까지 의도적으로 빈 배열을 전달했다.

## Observed Issues
- 테마 시각 상태가 HTML 속성과 패널 React 상태 두 곳에서 관리됐다.
- Supabase 왕복 시간이 말풍선 표시 시간에 직접 반영됐다.

## Decision Notes
- 시각 테마는 이미 페인트 전에 적용되는 HTML 속성을 단일 기준으로 사용한다.
- 정적 렌더링은 유지하면서 브라우저 캐시를 먼저 표시하고 Supabase를 최신 원본으로 동기화한다.
- 캐시가 없는 최초 방문은 Supabase 응답 후 캐시가 생성된다.

## Fix Notes
- 시작 패널의 로컬 `data-theme`를 제거하고 다크모드 CSS 선택자를 HTML 속성 기준으로 변경했다.
- 테마 버튼의 `Dark`와 `Light` 문구를 HTML 테마 속성에 따라 CSS로 전환한다.
- 시작 페이지 카테고리·이미지·한마디 설정을 버전이 있는 localStorage 캐시에 저장한다.
- 캐시는 레이아웃 단계에서 읽고, Supabase 최신값 로드 및 관리자 저장 시 갱신한다.
- 한마디 무작위 선택에서 지연 타이머를 제거하고 페인트 전 마이크로태스크를 사용한다.

## Result
- 다크모드 초기 페인트부터 올바른 버튼 문구와 흰색 중앙 타일이 적용된다.
- 캐시가 생성된 이후 새로고침에서는 한마디를 네트워크 응답 전에 표시할 수 있다.
- ESLint, TypeScript 검사와 Next.js 프로덕션 빌드가 통과했다.

## History Index
- 아직 분리된 이력이 없다.
