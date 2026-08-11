# 2번 스타일 방향 전환 중 연속 클릭 차단

## Summary
- 사진 게시글 2번 스타일의 방향 전환 중 연속 클릭으로 잘못된 방향의 다음 페이지가 열리는 문제를 수정한다.

## Background
- 첫 클릭과 React 상태 반영 사이에 추가 클릭이 들어오면 이전 화살표 방향으로 전환이 중복 예약될 수 있었다.

## Scope
- 첫 전환 요청부터 새 페이지와 방향 렌더 완료까지 동기식 입력 잠금을 유지한다.
- 전환 중 화살표 버튼을 비활성화한다.

## References
- `src/panels/layered/ImageDetailLayeredPanel/`

## Current Status
- 구현 및 전체 정적 검증 완료.
