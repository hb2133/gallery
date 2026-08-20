# 교체 및 삭제 미디어 Storage 정리

## Summary
- 이미지 교체·삭제 후 Supabase Storage에 남는 미참조 객체를 자동 정리한다.
- 현재 원격 Storage의 미참조 객체도 실제 DB 참조와 대조해 정리한다.

## Background
- Media 영상은 기존에 삭제 정리가 있었지만 메인 이미지, Gallery 이미지·썸네일, Writing 표지는 교체·삭제 후 이전 파일이 남았다.

## Scope
- 같은 Supabase 프로젝트와 지정 버킷의 공개 URL만 삭제한다.
- DB의 모든 활성 참조를 확인하고 공유 중인 파일은 보존한다.
- 이미지 축소나 포맷 변환은 하지 않는다.

## References
- `src/core/storage/SupabaseStorageUrl.ts`
- `src/managers/StorageAssetManager.ts`
- `src/managers/PhotoPostManager.ts`
- `src/managers/WritingPostManager.ts`
- `src/managers/StartPageCustomizationManager.ts`

## Current Status
- 구현, 원격 정리 및 검증 완료
