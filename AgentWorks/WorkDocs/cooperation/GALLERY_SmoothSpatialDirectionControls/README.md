# 2번 스타일 방향 화살표 위치 전환

## Summary
- 2번 스타일에서 페이지 방향이 바뀔 때 화살표가 새 위치로 부드럽게 이동하도록 한다.

## Background
- 방향별 left/right/top/bottom 배치가 즉시 교체되어 화살표가 새로 생성되는 듯 보였다.

## Scope
- 화살표 DOM을 유지하고 left/top 좌표를 전환한다.
- 모션 감소 설정에서는 기존처럼 전환을 제거한다.

## References
- `src/panels/layered/ImageDetailLayeredPanel/`

## Current Status
- 구현과 정적 검증 및 개발 서버 컴파일 완료.
