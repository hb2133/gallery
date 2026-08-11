# 사진 호버 편집 제거 및 배포

## Summary
- 사진 카드 호버 시 나오던 썸네일 편집 버튼을 제거했다.
- 게시물 관리 모드의 하단 편집 버튼은 유지했다.
- 검증한 작업본을 Vercel 프로덕션에 배포했다.

## Background
- 게시물 관리 모드에서 이미 순서 변경과 편집을 함께 제공하므로 일반 호버 편집 버튼은 중복이었다.

## Scope
- `GalleryIndexBasePanel`의 호버 편집 마크업과 전용 CSS만 제거했다.
- 로컬 빌드 후 Vercel `gallery` 프로덕션으로 배포했다.

## References
- `src/panels/base/GalleryIndexBasePanel/GalleryIndexBasePanel.tsx`
- `src/panels/base/GalleryIndexBasePanel/GalleryIndexBasePanel.module.css`
- Vercel deployment `dpl_J6MmJszUZvhTdsgFZjhpYAgHBAg8`

## Current Status
- 구현, 검증, 프로덕션 배포를 완료했다.
