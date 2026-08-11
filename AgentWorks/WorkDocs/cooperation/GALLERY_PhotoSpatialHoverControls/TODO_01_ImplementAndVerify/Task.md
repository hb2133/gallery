# Task

## Context
- 상하좌우 사진 프레임과 컨트롤 노출 시점을 조정한다.

## Current Understanding
- Shell과 Panel 양쪽에 1:1을 지정하고 opacity/pointer-events로 컨트롤을 전환한다.

## Observed Issues
- 터치 환경은 hover가 없어 컨트롤을 숨기면 조작할 수 없다.

## Decision Notes
- 데스크톱 hover/focus만 숨김을 적용하고 touch에서는 항상 표시한다.

## Initial Render Harness
- 해당 없음. 기존 게시물 보기 설정을 사용한다.

## Implementation Notes
- 가로 스크롤 Panel에 `aspect-ratio: 1`을 강제했다.
- 화살표와 페이지 점을 hover/focus에서만 표시한다.

## Result
- ESLint와 production build 통과.

## History Index
- 아직 분리된 이력이 없다.
