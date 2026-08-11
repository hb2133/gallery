# 사진 게시판 카테고리 및 썸네일 관리자 편집

## Summary
- 관리자만 사진 카테고리를 추가·삭제하고 카드 썸네일과 텍스트 레이어를 편집할 수 있게 했다.

## Background
- 카테고리가 정적 데이터에서 파생되어 관리자가 변경할 수 없었다.
- 카드 하단 메타 정보는 불필요했고 썸네일 구성을 직접 편집할 방법이 없었다.

## Scope
- 고정 `전체`와 관리자 전용 카테고리 추가·삭제
- 카드 하단 기간·카테고리·글귀 제거
- 관리자 전용 카드 수정 아이콘
- 썸네일 교체, 카드 카테고리와 다중 텍스트 레이어 편집 팝업
- Supabase 공개 조회 및 관리자 전용 저장

## References
- `src/panels/base/GalleryIndexBasePanel/`
- `src/panels/layered/PhotoCardEditorLayeredPanel/`
- `src/managers/PhotoPageCategoryManager.ts`
- `src/managers/PhotoCardCustomizationManager.ts`
- `supabase/migrations/20260730120000_photo_page_categories.sql`
- `supabase/migrations/20260730123000_photo_card_customizations.sql`
- `supabase/migrations/20260730130000_photo_card_category.sql`

## Current Status
- 구현, 원격 마이그레이션과 전체 검증을 완료했다.
