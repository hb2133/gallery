# 2번 스타일 페이지 전환 중복 애니메이션 수정

## Summary
- 사진 게시글 2번 상하좌우 보기에서 페이지 전환 완료 직전에 애니메이션이 다시 실행되는 현상을 수정한다.

## Background
- 상하좌우 이동용 `SwipeStage` 전환과 새 이미지용 `HorizontalSlide` 진입 애니메이션이 연속 실행될 수 있었다.

## Scope
- 상하좌우 페이지 넘김의 애니메이션 경로를 `SwipeStage` 하나로 통일한다.
- 중복 진입 애니메이션과 억제용 상태를 제거한다.

## References
- `src/panels/layered/ImageDetailLayeredPanel/ImageDetailLayeredPanel.tsx`
- `src/panels/layered/ImageDetailLayeredPanel/ImageDetailLayeredPanel.module.css`

## Current Status
- 구현과 정적 검증 및 프로덕션 빌드 완료.
