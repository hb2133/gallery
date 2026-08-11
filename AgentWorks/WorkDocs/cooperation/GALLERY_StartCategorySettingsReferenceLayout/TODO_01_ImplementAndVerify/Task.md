# Task

## Context
- 레퍼런스와 같이 카테고리 설정을 한눈에 파악할 수 있게 한다.

## Current Understanding
- 탭으로 한 카테고리만 편집하고 배치를 좌측 그리드에 즉시 반영하면 반복 UI를 제거할 수 있다.

## Observed Issues
- 없음.

## Decision Notes
- 최초에는 메인 화면 위치 드래그를 유지했으나 이후 `GALLERY_SettingsPreviewBoxDrag` 작업에서 설정 미리보기 직접 이동으로 변경했다.

## Initial Render Harness
- 기존 `InitialAppState.StartPageCustomization`과 draft 상태를 그대로 사용하여 SSR 경로를 변경하지 않았다.

## Fix Notes
- 4개 탭, 이미지 분할 미리보기, 선택 항목 편집 패널을 구현했다.

## Result
- ESLint와 Next.js 프로덕션 빌드 통과.

## History Index
- 아직 분리된 이력이 없다.
