# Task

## Context
- 메인 좌측 상단 안내 두 줄을 제거한다.

## Current Understanding
- 기존 그리드 자동 배치를 명시적 열 배치로 바꾸어 중앙 위치를 유지했다.

## Observed Issues
- 없음.

## Decision Notes
- 기능과 aria label은 유지했다.

## Initial Render Harness
- 해당 없음. 정적 UI 제거다.

## Fix Notes
- 안내 마크업과 `.BoxHeading` CSS를 제거했다.

## Result
- ESLint와 Next.js 프로덕션 빌드 통과.

## History Index
- 아직 분리된 이력이 없다.
