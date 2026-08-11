# Continuous Writing List And Media Blocks

## Summary
- 긴글 목록을 10개 단위 바로가기가 있는 하나의 연속 스크롤로 바꾸고 편집기에 드롭형 미디어 블록을 추가한다.

## Background
- 페이지별 DOM 분할 때문에 다른 페이지 글과 드래그 순서를 바꿀 수 없었다.
- 편집기는 선택 버튼으로만 첨부할 수 있고 영상, 크기 조절, 선택 삭제를 지원하지 않았다.

## Scope
- 전체 글을 한 스크롤 목록에 렌더링
- 10개 단위 페이지 위치 바로가기와 현재 구간 추적
- 드래그 가장자리 자동 스크롤
- 이미지·영상·파일 다중 드롭 업로드
- 미디어 가로 크기 조절과 Delete 삭제
- 목록 글 drop 후 해당 글 편집기 열기

## References
- `src/panels/base/WritingBasePanel/`
- `src/managers/WritingPostManager.ts`

## Current Status
- 구현과 전체 정적 검증 완료.
