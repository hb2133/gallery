# Task

## Context
- 사진 책넘김 UI를 제공된 두 PNG의 화면 구성과 맞춘다.

## Current Understanding
- 페이지 넘김 엔진은 그대로 두고 패널 chrome과 목차만 바꾸면 된다.

## Observed Issues
- 기존 페이지 바로가기는 작은 숫자 버튼 목록이라 레퍼런스 목차와 달랐다.

## Decision Notes
- 새 컴포넌트나 의존성 없이 기존 이미지 목록과 CSS overlay를 재사용했다.

## Initial Render Harness
- 새 저장값은 없다. 기존 서버 초기 사진 게시물의 이미지 목록을 사용한다.

## Implementation Notes
- 좌상단 목차 버튼과 4열 썸네일 목차, 우상단 보기/닫기 버튼을 배치했다.
- 책 배경을 흰색으로 바꾸고 현재/전체 페이지를 우하단에 표시했다.

## Result
- TypeScript, ESLint, production build를 통과했다.

## History Index
- 아직 분리된 이력이 없다.
