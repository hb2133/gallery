# Task

## Bug Context
- 새 게시글에서 썸네일, 내용 이미지 업로드와 텍스트 레이어 추가 시 ISSUE가 발생한다.

## Current Understanding
- 브라우저 로그에서 세 경로 모두 `crypto.randomUUID is not a function`으로 중단됨을 확인했다.

## Observed Issues
- secure context가 아닌 LAN HTTP 주소에서는 `randomUUID()`가 없다.
- 기존 개발 캐시가 수정 전 번들을 계속 제공해 캐시 재생성이 필요했다.

## Decision Notes
- `randomUUID`, `getRandomValues`, 시간 기반 fallback 순서의 공통 ID 함수를 사용한다.
- 프로젝트 전체 직접 호출을 교체해 다른 관리자 업로드에서도 재발하지 않게 한다.

## Initial Render Harness
- 작성 중 임시 ID 생성 호환 수정이며 서버 초기 저장 상태에는 영향이 없다.

## Fix Notes
- `CreateUniqueId()`를 추가하고 `src/`의 직접 `crypto.randomUUID()` 호출을 모두 제거했다.
- 개발 캐시를 재생성해 현재 `/gallery`가 새 helper 포함 번들을 제공한다.

## Result
- insecure-context fallback UUID 200개 형식·중복 검증 통과.
- 현재 제공 중인 gallery 번들에 직접 `crypto.randomUUID()` 호출이 0개이고 helper가 포함됨을 확인했다.
- TypeScript와 관련 ESLint 검증을 통과했다.

## History Index
- 아직 분리된 이력이 없다.
