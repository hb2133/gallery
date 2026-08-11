# 사진 게시글 1번 스타일 상시 스크롤 페이지 선택

## Summary
- 사진 게시글 1번 책 보기의 오른쪽 페이지 바로가기 토글을 상시 노출되는 세로 스크롤 목록으로 교체한다.

## Background
- 기존 페이지 목록은 스크롤을 지원하지만 별도 토글을 열어야 접근할 수 있어 대량 페이지 탐색 흐름이 끊겼다.

## Scope
- 토글 버튼과 열림 상태를 제거한다.
- 오른쪽 페이지 번호 목록의 높이를 제한하고 세로 스크롤로 모든 페이지에 접근하게 한다.
- 현재 펼침면이 목록 안에서 자동으로 보이도록 유지한다.

## References
- `src/panels/layered/ImageDetailLayeredPanel/ImageDetailLayeredPanel.tsx`
- `src/panels/layered/ImageDetailLayeredPanel/ImageDetailLayeredPanel.module.css`

## Current Status
- 구현과 정적 검증 및 프로덕션 빌드 완료.
