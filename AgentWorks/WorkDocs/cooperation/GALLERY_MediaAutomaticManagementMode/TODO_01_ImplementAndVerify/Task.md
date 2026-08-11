# Task

## Context
- 영상 게시판의 수동 게시물 관리 버튼을 없애고 관리자 로그인 여부로 관리 상태를 자동 결정한다.

## Current Understanding
- 별도 `IsManaging` state와 토글은 인증 상태를 중복 표현하므로 `IsAuthenticated`를 직접 사용하면 된다.

## Observed Issues
- 추가 차단 문제 없음.

## Decision Notes
- 관리자용 글쓰기 버튼은 유지하고 관리 모드 토글만 제거했다.

## Initial Render Harness
- 인증 SSOT는 서버에서 주입되는 `AuthSessionProvider`이며 Controller 최초 렌더부터 같은 값을 사용한다.

## Fix Notes
- `IsManaging = IsAuthenticated`로 단순화하고 토글 함수와 관련 props 및 버튼을 제거했다.

## Result
- `npm run lint`, `npm run build` 통과, 프로덕션 `/media` 200 응답과 관련 토글 문자열 제거 확인.

## History Index
- 아직 분리된 이력이 없다.
