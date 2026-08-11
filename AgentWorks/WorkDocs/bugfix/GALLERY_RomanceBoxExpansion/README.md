# 로맨스 박스 펼침 애니메이션 복원

## Summary
- 로맨스 선택 시 이미지 슬롯과 이동 글자가 중앙에서 최종 십자 배치로 펼쳐지도록 애니메이션을 복원했다.

## Background
- 로맨스의 최종 좌표가 초기 배치 좌표와 같아 기존 전환에서 움직임이 발생하지 않았다.

## Scope
- 로맨스 상태 전용 이미지 마스크 및 타일 이동 애니메이션.
- 기존 최종 배치와 다른 카테고리 애니메이션은 유지.

## References
- `src/panels/base/GalleryBasePanel/GalleryBasePanel.module.css`

## Current Status
- 구현 및 production build 검증 완료.
