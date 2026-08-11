# Writing Scroll Jitter

## Summary
- Writing 스크롤 보기의 페이지 경계 떨림을 수정했다.

## Background
- 스크롤 진행률 갱신으로 `ReaderPage`가 바뀔 때 전체 페이지 DOM이 교체되고 있었다.

## Scope
- 스크롤 리더 페이지 key 안정화와 브라우저 회귀 검증

## References
- `src/panels/base/WritingBasePanel/sections/WritingArchiveSection/WritingArchiveSection.tsx`

## Current Status
- 수정 및 타입·린트·실제 스크롤 검증 완료
