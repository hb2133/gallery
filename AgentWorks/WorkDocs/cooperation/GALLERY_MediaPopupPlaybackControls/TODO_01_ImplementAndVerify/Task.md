# Task

## Context
- 영상 상세 팝업에 일반 영상 플레이어 수준의 직접 조작 UI가 필요했다.

## Current Understanding
- 업로드 영상은 HTMLVideoElement, YouTube는 iframe postMessage로 제어한다.

## Observed Issues
- 소스 종류별 상태 이벤트 계약이 달라 하나의 표시 상태로 정규화해야 했다.

## Decision Notes
- 새 플레이어 의존성 없이 브라우저 영상 API와 YouTube Player API를 사용했다.

## Initial Render Harness
- 해당 없음. 팝업은 기존 서버 초기 게시물 snapshot에서 선택한 항목을 사용한다.

## Implementation Notes
- 재생/일시정지, 탐색 바, 음소거, 배속, 전체화면/축소를 구현했다.
- 작성 연월을 영상 왼쪽 하단에 표시한다.

## Result
- 단위 테스트, TypeScript, ESLint, production build 통과.

## History Index
- 아직 분리된 이력이 없다.
