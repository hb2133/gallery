# 관리 상태 사진 상세 열기 복구

## Summary
- 관리자 관리 상태에서도 사진 카드를 누르면 게시글 상세 내용이 열리도록 복구했다.

## Background
- 관리자 로그인 시 관리 상태가 기본 활성화되면서 카드 전체 상세 버튼이 disabled되어 내용 보기가 막혔다.

## Scope
- GalleryIndexBasePanel의 카드 상세 버튼 활성 조건.

## References
- src/panels/base/GalleryIndexBasePanel/GalleryIndexBasePanel.tsx

## Current Status
- 완료. lint와 production build를 통과했다.
