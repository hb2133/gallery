# 사진 관리자 기본 관리 모드

## Summary
- 사진 게시판은 관리자 로그인 시 관리 모드가 기본 활성화되며 게시물 관리 버튼은 제거했다.

## Background
- 관리자는 사진 게시판 진입 후 매번 관리 버튼을 눌러야 했다.

## Scope
- `IsManaging`을 인증 상태에서 파생하고 toggle UI·로직·CSS를 제거했다.

## References
- `src/panels/base/GalleryIndexBasePanel/`

## Current Status
- 구현과 빌드 검증 완료.
