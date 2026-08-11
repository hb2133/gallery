# 영상 재생 종료 프로그래스바 완료 처리

## Summary
- 영상 재생이 끝났을 때 프로그래스바를 정확히 끝 위치로 확정한다.

## Background
- 브라우저와 YouTube 플레이어의 마지막 시간 갱신이 실제 재생 길이보다 먼저 끝날 수 있다.

## Scope
- 업로드 영상과 YouTube 영상의 종료 상태 및 진행률 동기화.

## References
- `src/panels/layered/MediaVideoDetailLayeredPanel/`
- `src/panels/base/MediaBasePanel/controller/MediaBasePanelState.ts`

## Current Status
- 구현과 변경 범위 검증 완료.
