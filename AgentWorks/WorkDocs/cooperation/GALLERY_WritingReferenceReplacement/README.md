# Writing Reference Replacement

## Summary
- `Reference/5. writing`의 아카이브와 글 리더 구성을 `/writing`에 재현했다.

## Background
- 기존 Writing 화면은 Supabase 글·카테고리 DB 및 편집 도구에 결합되어 있었다.
- 사용자는 기존 DB를 제거하고 레퍼런스 중심의 정적 화면으로 교체하도록 요청했다.

## Scope
- 책등형 아카이브, 부드러운 표지 호버 확장, 카테고리와 검색
- 단면·양면·스크롤 리더, 전체 페이지 목차, 본문 검색, 보기 설정
- Writing 서버 초기 DB 조회와 구형 편집/저장 코드 제거

## References
- `Reference/5. writing/`
- `src/panels/base/WritingBasePanel/`
- `src/managers/InitialAppStateManager.ts`

## Current Status
- 구현과 데스크톱·모바일 브라우저 검증, 타입 검사, 린트 및 프로덕션 빌드를 완료했다.
