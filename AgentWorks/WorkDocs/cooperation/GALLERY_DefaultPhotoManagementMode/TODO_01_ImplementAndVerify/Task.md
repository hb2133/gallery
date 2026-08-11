# Task

## Context
- 관리자는 사진 게시판에서 기본으로 게시물 순서·편집 UI를 본다.

## Current Understanding
- 인증 여부가 관리 모드의 완전한 조건이므로 별도 state와 toggle이 필요 없다.

## Observed Issues
- 없음.

## Decision Notes
- `IsManaging = IsAuthenticated`로 처리해 로그아웃 시에도 즉시 일반 모드로 복귀한다.

## Initial Render Harness
- 저장 기능을 추가하지 않았고 기존 SSR 인증 상태를 재사용했다.

## Fix Notes
- 관리 버튼과 전용 스타일, toggle 함수를 제거했다.

## Result
- ESLint와 Next.js 프로덕션 빌드 통과.

## History Index
- 아직 분리된 이력이 없다.
