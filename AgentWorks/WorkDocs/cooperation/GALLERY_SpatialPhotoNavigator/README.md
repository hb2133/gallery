# 사진 2차원 배치 및 상하좌우 탐색

## Summary
- 사진을 5×5 맵에 배치하고 상세 보기에서 상하좌우 인접 사진으로 이동한다.

## Background
- 기존 2번 보기는 사진 배열의 이전·다음만 제공하는 가로 슬라이드였다.

## Scope
- `photo_posts.image_layout` 좌표 저장.
- 새 게시글과 편집기의 관리자 배치 UI.
- 인접 사진이 있는 방향에만 표시되는 네 방향 화살표와 전환 모션.

## References
- `Reference/Image_01.png`
- `src/panels/layered/ImageDetailLayeredPanel/`
- `src/managers/PhotoPostManager.ts`
- `supabase/migrations/20260730160000_photo_post_image_layout.sql`

## Current Status
- 원격 migration 적용 및 구현 검증 완료.
