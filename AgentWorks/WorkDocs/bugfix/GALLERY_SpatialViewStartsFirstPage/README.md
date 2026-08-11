# 상하좌우 보기 전환 시 첫 페이지 초기화

## Summary
- 책 보기에서 상하좌우 보기로 전환할 때 항상 첫 페이지부터 시작하도록 수정한다.

## Background
- 두 보기 방식이 같은 `ActiveImageIndex`를 공유해 책에서 보던 페이지가 상하좌우 보기에도 이어졌다.

## Scope
- 상하좌우 보기 전환 시 활성 이미지와 전환 방향 초기화.

## References
- `src/panels/base/GalleryIndexBasePanel/controller/GalleryIndexBasePanelController.ts`

## Current Status
- 수정 및 검증 완료.
