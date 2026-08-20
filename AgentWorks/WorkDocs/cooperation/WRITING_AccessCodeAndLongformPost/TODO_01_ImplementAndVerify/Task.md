# Task

## Context
- Chrome 비밀번호 저장 제안을 막고 Writing에 읽기 테스트용 장문 글을 추가한다.

## Current Understanding
- 접근 코드 입력이 `current-password`로 선언되어 Chrome이 계정 비밀번호로 해석한다.
- 공용 팝업에서 `one-time-code`로 의미를 바로잡으면 Gallery와 Writing에 함께 적용된다.
- 새 글은 기존 `WritingArticles`에 두어 서버 첫 렌더링과 클라이언트가 같은 값을 사용한다.

## Observed Issues
- 별도 계정명 없이 비밀번호 필드만 제출해도 저장 제안이 표시된다.

## Decision Notes
- 입력 타입을 텍스트로 바꾸는 우회는 마스킹 보안을 해치므로 사용하지 않는다.
- 별도 DB 시드 체계는 만들지 않고 기존 기본 게시글 경로를 재사용한다.

## Initial Render Harness
- 새 글의 SSOT는 `WritingArticles`이며 서버 초기 상태와 클라이언트 병합 모두 같은 모듈을 사용한다.
- 새 저장 기능은 추가하지 않는다.

## Implementation Notes
- 폼 자동완성을 끄고 접근 코드 입력을 `one-time-code`로 지정한다.
- 5개 문단이 화면에서 약 15~30줄로 흐르는 10페이지 글을 추가한다.

## Result
- ESLint와 TypeScript 검사가 통과했다.
- 프로덕션 빌드가 통과했다.
- `/writing` 서버 첫 HTML에서 새 글 제목을 확인했다.
- 장문 글의 10페이지와 총 50개 문단을 확인했다.

## History Index
- 아직 분리된 이력이 없다.
