# Task

## Context
- 사진 드래그 표시를 영상 카드와 맞추고 화살표 표시 상태를 바로잡는다.

## Current Understanding
- `ImageFrame:focus-within`이 마우스 클릭 포커스까지 hover 표시로 처리했다.

## Observed Issues
- 사진 전환 후 클릭 전 hover 반응이 불안정하고 클릭한 화살표가 고정됐다.

## Decision Notes
- 실제 이미지 박스인 `Panel:hover`와 개별 `focus-visible`만 사용한다.

## Initial Render Harness
- 새 저장값 없음. 기존 게시물 관리 state와 저장 순서를 사용한다.

## Fix Notes
- 이미지 위 드래그 badge를 제거하고 하단에 드래그/편집 바를 배치했다.
- mouse focus를 전체 컨트롤 표시 조건에서 제외했다.

## Result
- ESLint, diff check, production TypeScript/build 통과.

## History Index
- 아직 분리된 이력이 없다.
