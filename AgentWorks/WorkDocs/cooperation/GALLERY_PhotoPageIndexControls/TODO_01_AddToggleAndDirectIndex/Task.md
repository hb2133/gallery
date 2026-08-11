# Task

## Context
- 스크롤 페이지 바로가기를 선택적으로 숨기고, 번호 입력으로 대량 페이지에 바로 이동할 수 있어야 한다.

## Current Understanding
- 기존 `OpenIndexedPage`가 목록 버튼과 직접 입력 양쪽의 이동 경로로 재사용될 수 있다.

## Observed Issues
- 상시 목록 아래에 조작 영역이 없어 표시 여부와 직접 이동을 제어할 수 없다.

## Decision Notes
- 목록은 기본 열린 상태로 두고 하단 토글로 숨긴다.
- 네이티브 숫자 input의 min/max/step 검증을 사용한다.

## Initial Render Harness
- 저장 기능이 아닌 패널 로컬 UI 상태이므로 해당 없음.

## Fix Notes
- 페이지 목록 아래에 번호 입력 폼과 열기·숨기기 토글을 추가했다.
- 열린 목록의 현재 페이지 자동 스크롤을 유지했다.
- 목록 토글이 닫히면 번호 입력 폼도 함께 숨기고 입력칸의 `#` placeholder를 제거했다.

## Result
- TypeScript, 대상 ESLint, diff 검사와 재시작한 개발 서버의 `/gallery` 200 응답을 확인했다.
- 입력칸의 `#` placeholder가 소스에서 제거된 것을 확인했다.

## History Index
- 아직 분리된 이력이 없다.
