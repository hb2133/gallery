# 사진 페이지 설정 초기 렌더링 깜빡임 제거

## Summary
- 사진 카테고리와 카드 썸네일·텍스트 설정을 서버 첫 HTML에 주입해 새로고침 깜빡임을 제거했다.

## Background
- 클라이언트가 기본 상태로 먼저 렌더링된 뒤 Supabase 공개 설정을 불러와 화면을 교체했다.

## Scope
- 사진 카테고리 서버 초기 상태
- 카드 썸네일·텍스트·카테고리 서버 초기 상태
- 브라우저 재조회와 서버 초기값 연결

## References
- `src/managers/InitialAppStateManager.ts`
- `src/app/shell/InitialAppStateProvider.tsx`
- `src/panels/base/GalleryIndexBasePanel/controller/GalleryIndexBasePanelController.ts`

## Current Status
- 구현과 실제 저장 데이터 기반 초기 HTML 검증을 완료했다.
