# Task

## Bug Context
- 사진, 영상·음악, 긴 글, 한 줄 메모 등 다른 게시판에서 시작페이지의 한마디 설정이 반영되지 않았다.

## Current Understanding
- 다른 게시판은 `Messages` 없이 AdminBrand를 사용해 컴포넌트의 고정 기본 문장이 표시됐다.
- 공통 Manager가 캐시와 Supabase 설정을 제공하도록 연결한다.

## Observed Issues
- 페이지별 AdminBrand의 데이터 원본이 시작페이지와 달랐다.

## Decision Notes
- 시작페이지처럼 문장을 직접 제공하는 경우 기존 값을 우선한다.
- 문장을 제공하지 않는 게시판만 공통 설정을 자체 로드해 불필요한 중복 요청을 피한다.

## Fix Notes
- `useStartPageDailyMessages` Manager hook을 추가했다.
- 캐시 문장을 페인트 전에 반영하고 Supabase 최신 설정으로 다시 동기화한다.
- AdminBrand의 고정 기본 문장을 제거하고 공통 Manager 결과를 사용한다.

## Result
- 모든 게시판에서 시작페이지에 저장한 목록 중 한 문장이 무작위로 표시된다.
- 설정 문장이 0개면 모든 게시판에서 말풍선이 숨겨진다.
- ESLint, TypeScript 검사와 Next.js 프로덕션 빌드가 통과했다.

## History Index
- 아직 분리된 이력이 없다.
