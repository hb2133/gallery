# Writing 직사각형 썸네일 종이 외곽 제거

## Summary
- Writing 목록의 직사각형 썸네일에 적용된 불규칙한 종이 외곽선을 제거한다.

## Background
- 게시글 ID로 랜덤 polygon을 만들고 `clip-path`로 카드 가장자리를 잘라 종이 질감을 표현하고 있었다.

## Scope
- Writing 목록 카드 외곽만 반듯하게 변경
- 이미지, 텍스트, 호버 크기와 내부 질감은 유지

## References
- `src/panels/base/WritingBasePanel/`

## Current Status
- 구현과 정적 검증 완료
