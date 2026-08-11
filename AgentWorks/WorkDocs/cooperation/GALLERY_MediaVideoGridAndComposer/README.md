# 영상 갤러리 5열 레이아웃과 관리자 게시물 작성

## Summary
- 영상 게시판을 레퍼런스 GIF처럼 5열 무빙 썸네일 갤러리로 변경한다.
- 관리자 전용 작성창에서 영상 파일 또는 YouTube 링크를 게시할 수 있게 한다.

## Background
- 기존 MediaBasePanel은 정적 2열 카드와 필터만 제공하며 저장 기능이 없다.

## Scope
- 5열 반응형 영상 그리드와 자동 반복 미리보기
- Supabase 게시물/영상 저장소와 관리자 작성 흐름
- 로컬 MP4 1건과 YouTube 링크 4건의 테스트 게시물

## References
- `Reference/3.영상페이지/01 영상.gif`
- `AgentWorks/docs/project-rules/platform/HARNESS_ENGINEERING_INITIAL_RENDER_NEXTJS_V1.md`

## Current Status
- 구현 및 검증 완료
