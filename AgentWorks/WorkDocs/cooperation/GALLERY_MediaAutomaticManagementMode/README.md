# 영상 게시판 자동 관리자 관리 모드

## Summary
- 영상 게시판에서 게시물 관리 버튼을 제거하고 로그인 상태를 관리 모드의 단일 기준으로 사용한다.

## Background
- 사진 게시판과 마찬가지로 관리자는 즉시 편집·정렬 UI를 보고 비로그인 방문자는 일반 열람 UI만 봐야 한다.

## Scope
- 영상 BasePanel Controller의 관리 상태, 상단 관리자 액션, Section/Panel props 정리.

## References
- `src/panels/base/MediaBasePanel/`

## Current Status
- 완료. 별도 관리 토글 없이 인증 상태에 따라 자동 전환된다.
