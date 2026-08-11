# 사진 카드 공개 상태 및 삭제 관리

## Summary
- 사진 카드에 공개/비공개와 삭제 상태를 추가했다.
- 상세 팝업은 정보 영역 없이 사진만 표시하고 책 보기를 기본값으로 변경했다.

## Background
- 비공개 카드는 관리자에게만 보여야 하며 삭제된 정적 기본 카드가 다시 나타나지 않아야 한다.

## Scope
- Supabase 카드 상태 저장과 서버 초기 상태 반영.
- 편집창 공개 전환, 삭제 확인 경고 및 삭제 처리.
- 관리자용 비공개 배지.
- 상세 팝업 사진 전용 레이아웃과 보기 버튼 순서 변경.

## References
- `src/managers/PhotoCardCustomizationManager.ts`
- `src/managers/InitialAppStateManager.ts`
- `src/panels/base/GalleryIndexBasePanel/`
- `src/panels/layered/PhotoCardEditorLayeredPanel/`
- `src/panels/layered/ImageDetailLayeredPanel/`
- `supabase/migrations/20260730143000_photo_card_visibility.sql`

## Current Status
- 원격 마이그레이션, 구현 및 정적 검증 완료.
