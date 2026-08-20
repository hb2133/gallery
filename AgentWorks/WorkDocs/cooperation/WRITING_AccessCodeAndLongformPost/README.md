# Writing 접근 코드 및 장문 게시글

## Summary
- 게시글 접근 코드 입력을 로그인 비밀번호로 오인하지 않도록 브라우저 자동완성 의미를 수정한다.
- Writing 기본 게시글에 10페이지 분량의 장문 글을 추가한다.

## Background
- 공용 비밀번호 팝업의 `current-password`가 Chrome 저장 제안을 유발한다.
- Writing 기본 글은 서버 초기 상태에서도 사용하는 `WritingArticles`가 SSOT다.

## Scope
- 공용 접근 코드 폼의 자동완성 속성 수정
- 10페이지 Writing 글 1개 추가 및 검증

## References
- `src/panels/layered/PhotoPasswordLayeredPanel/PhotoPasswordLayeredPanel.tsx`
- `src/panels/base/WritingBasePanel/controller/WritingBasePanelState.ts`

## Current Status
- 구현 및 검증 완료
