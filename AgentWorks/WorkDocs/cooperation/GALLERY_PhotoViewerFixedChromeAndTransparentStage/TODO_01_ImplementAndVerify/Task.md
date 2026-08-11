# Task

## Context
- 보기 스타일 전환 시 외곽 크기가 달라져 목차·스타일·닫기·페이지 위치가 움직였고 상하좌우 보기에 불필요한 검은 배경과 하단 점 목록이 표시됐다.

## Current Understanding
- PanelShell 크기를 두 스타일이 공유하고 중앙 ImageFrame만 스타일별 크기와 내용을 갖게 한다.

## Observed Issues
- 추가 차단 문제 없음.

## Decision Notes
- 기존 컴포넌트와 상태 흐름을 유지하는 최소 변경을 적용했다.

## Initial Render Harness
- 저장 기능 변경이 아니므로 해당 없음.

## Fix Notes
- 목차를 두 보기에서 공통 제공하고 스크롤 모드 목차 선택을 활성 이미지 이동에 연결했다. 우측 하단 진행도를 공통 위치로 이동하고 하단 점 목록을 제거했다. 상하좌우 Panel/ImageFrame 배경을 투명 처리하고 정사각형 콘텐츠를 공통 셸 중앙에 배치했다. 책넘김의 투명 처리는 후속 작업에서 불투명 밀착 페이지로 교체했다.

## Result
- `npm run lint`와 `npm run build` 통과.

## History Index
- 아직 분리된 이력이 없다.
