# Task

## Bug Context
- 커스텀 링크를 저장해도 새로고침 직후 기본 `Instagram`이 잠시 표시됐다.

## Current Understanding
- `StartCustomization`의 기본 링크를 로드 완료 여부와 무관하게 HeaderSection에 전달한 것이 원인이다.

## Observed Issues
- 한마디와 링크의 초기 렌더 정책이 서로 달랐다.

## Decision Notes
- 임의 기본값을 표시하지 않고 실제 설정이 준비될 때까지 링크를 숨긴다.
- 캐시가 있으면 기존 페인트 전 캐시 초기화 경로로 실제 설정이 바로 표시된다.

## Fix Notes
- 설정 로드 전에는 HeaderSection에 `null` 링크를 전달한다.
- HeaderSection은 null 링크를 빈 텍스트·URL 상태로 처리해 아무 버튼도 렌더링하지 않는다.

## Result
- 새로고침 시 기본 Instagram 링크가 먼저 표시되지 않는다.
- ESLint, TypeScript 검사와 Next.js 프로덕션 빌드가 통과했다.

## History Index
- 아직 분리된 이력이 없다.
