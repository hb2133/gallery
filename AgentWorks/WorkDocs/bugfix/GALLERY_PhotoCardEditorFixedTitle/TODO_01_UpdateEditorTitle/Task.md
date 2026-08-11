# Task

## Context
- 썸네일 수정 팝업에 카드 제목 대신 고정 제목이 필요하다.

## Current Understanding
- `CardTitle` prop은 팝업 제목 한 곳에서만 사용됐다.

## Observed Issues
- 없음.

## Decision Notes
- 보조 문구를 제거하고 제목을 `EDIT`으로 고정하며 미사용 prop을 제거한다.

## Initial Render Harness
- 저장형 기능이 아니며 팝업 정적 문구 변경이므로 해당 없음.

## Fix Notes
- `PHOTO CARD EDITOR` 문구를 제거하고 팝업 h2를 `EDIT`으로 변경했으며 `CardTitle` 전달과 타입을 제거했다.

## Result
- TypeScript, 대상 ESLint, diff check 통과.

## History Index
- 아직 분리된 이력이 없다.
