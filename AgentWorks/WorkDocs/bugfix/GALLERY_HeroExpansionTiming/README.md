# 카테고리 전개 효과 타이밍 동기화

## Summary
- 현재 카테고리별 배치 모양을 유지하면서 이미지 마스크 박스와 투명 패널·글자의 이동 타이밍을 동기화했다.

## Background
- 앞쪽 BoxTile은 이동했지만 뒤쪽 합성 이미지는 최종 마스크 위치에 바로 나타나 이미지 박스가 움직이지 않는 것처럼 보였다.
- 박스 transform과 배경, 그림자, 글자 opacity도 서로 다른 시간으로 움직였다.

## Scope
- 이미지 마스크 5개의 이동 애니메이션 복구
- 기존 카테고리별 배치 좌표 유지
- 관련 시각 전환을 동일한 480ms easing으로 통일

## References
- `src/panels/base/GalleryBasePanel/GalleryBasePanel.module.css`

## Current Status
- 구현과 전체 검증을 완료했다.
