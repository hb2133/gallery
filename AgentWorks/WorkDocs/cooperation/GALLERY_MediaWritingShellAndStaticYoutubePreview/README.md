# 영상 게시판 글쓰기 셸과 정적 YouTube 썸네일

## Summary
- 영상 게시판 셸을 글쓰기 게시판과 통일하고 YouTube 카드를 정적 썸네일로 표시한다.
- 관리자 전용 글쓰기, 편집, 삭제, 드래그 순서 관리 기능을 추가한다.

## Background
- 영상 페이지의 헤더/제목 규격이 글쓰기 게시판과 다르고 A 홈 링크가 안정적으로 동작하지 않는다.
- YouTube iframe 썸네일은 반복 경계에서 YouTube UI를 노출한다.

## Scope
- 글쓰기 게시판과 동일한 상단 셸 및 내부 제목 비율
- 공통 A 로고의 Next 내부 홈 이동
- YouTube 정적 썸네일과 상세 팝업 전용 iframe
- 관리자 전용 글쓰기/게시물 관리 UI
- 게시물 내용 편집, 삭제, drag reorder와 서버 저장

## References
- `WritingBasePanel`
- `GALLERY_MediaVideoPopupAndHover`

## Current Status
- 구현과 검증 완료
