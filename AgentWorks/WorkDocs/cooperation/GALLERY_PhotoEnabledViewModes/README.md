# 사진 게시글 보기방식 아이콘 선택

## Summary
- 책넘김과 상하좌우 아이콘을 각각 눌러 한 개 또는 두 개 보기 방식을 선택한다.

## Background
- ON/OFF 문구는 제거하고, 이전 아이콘 방식으로 하나 또는 두 개를 선택하는 후속 요청이 반영됐다.

## Scope
- 작성·편집 아이콘 UI, 게시글 저장/조회, 서버 초기 상태, 상세 보기 전환 버튼 표시 조건.

## References
- `src/components/PhotoViewModeSelector/`
- `src/managers/PhotoPostManager.ts`
- `supabase/migrations/20260810160000_photo_post_enabled_view_modes.sql`

## Current Status
- 구현과 원격 마이그레이션은 완료했다. 실제 두 방식 ON 저장값의 서버 첫 HTML 검증은 남아 있다.
