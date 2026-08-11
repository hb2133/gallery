# 네트워크 개발 환경 이미지 업로드 ID 생성 수정

## Summary
- HTTP 네트워크 개발 환경에서 이미지 업로드와 텍스트 레이어 추가가 실패하는 문제를 수정했다.

## Background
- `crypto.randomUUID()`는 secure context가 아닌 `http://192.168.0.41`에서 제공되지 않는다.

## Scope
- 썸네일·내용 이미지·텍스트 레이어 임시 ID.
- 사진 게시글·카드·폰트·시작 페이지 Storage ID.
- 개발 번들 캐시 갱신과 실제 제공 번들 확인.

## References
- `src/core/identity/UniqueId.ts`
- `src/panels/layered/PhotoPostComposerLayeredPanel/`
- `src/managers/PhotoPostManager.ts`

## Current Status
- 수정 및 검증 완료.
