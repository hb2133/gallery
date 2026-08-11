# 영상 카드 번호 제거와 볼륨 범위 수정

## Summary
- 영상 카드 우측 하단의 순번 표시를 제거했다.
- 세로 음량 슬라이더가 최솟값과 최댓값까지 이동하도록 수정했다.

## Background
- 카드의 `[01]` 형식 표시는 사용자에게 필요하지 않았다.
- range input의 상하 padding이 실제 트랙 이동 범위를 줄이고 있었다.

## Scope
- 영상 카드 메타 표시와 팝업 음량 제어 CSS만 수정했다.

## References
- `src/panels/base/MediaBasePanel/sections/MediaArchiveSection/MediaArchiveSection.tsx`
- `src/panels/layered/MediaVideoDetailLayeredPanel/MediaVideoDetailLayeredPanel.module.css`

## Current Status
- 구현과 프로덕션 빌드 검증을 완료했다.
