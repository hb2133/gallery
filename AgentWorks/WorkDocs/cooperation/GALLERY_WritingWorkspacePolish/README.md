# Writing Workspace Layout And Drag Polish

## Summary
- 긴글 화면의 카테고리, 보기 설정, 목록 정렬과 편집 경험을 현대적인 문서 앱 형태로 다듬는다.

## Background
- 카테고리가 한 줄 가로 스크롤에 가려지고 보기 설정이 글 위에 겹쳤다.
- 글 순서는 드롭 이후에만 바뀌어 드래그 중 위치를 예상하기 어려웠다.
- 편집 화면이 읽기 화면과 다른 박스형 입력 폼이라 작성 결과를 바로 가늠하기 어려웠다.

## Scope
- 카테고리 여러 줄 표시
- 본문 밖 오른쪽 보기 설정 열
- 드래그 중 실시간 순서 미리보기와 항목 이동 애니메이션
- 읽기 화면과 같은 타이포그래피의 인라인 문서 편집기

## References
- `src/panels/base/WritingBasePanel/`

## Current Status
- 구현과 전체 정적 검증 완료.
