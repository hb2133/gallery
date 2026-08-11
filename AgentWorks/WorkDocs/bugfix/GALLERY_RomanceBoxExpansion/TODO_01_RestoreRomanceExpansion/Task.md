# Task

## Context
- 시작 페이지에서 로맨스만 선택 시 박스 펼침 움직임이 보이지 않는다.

## Current Understanding
- 로맨스의 최종 십자 좌표와 idle 상태 타일 및 기존 마스크 애니메이션 시작 좌표가 동일하다.

## Observed Issues
- 좌표 변화가 없어서 480ms transition이 있어도 시각적인 이동이 발생하지 않는다.

## Decision Notes
- 최종 배치는 바꾸지 않고 로맨스에만 중앙 시작점 keyframe을 적용한다.
- 이미지 마스크와 이동 글자 타일에 같은 시간과 easing을 사용한다.

## Initial Render Harness
- 저장형 기능이 아니며 사용자 선택 뒤 실행되는 애니메이션이므로 해당 없음.

## Fix Notes
- `RomanceCompositeTilesExpand`로 다섯 이미지 마스크를 중앙에서 최종 위치로 이동시킨다.
- `RomanceTileExpand`로 네 이동 타일도 중앙에서 동시에 펼친다.
- `prefers-reduced-motion` 기존 규칙은 새 애니메이션에도 그대로 적용된다.

## Result
- Next.js production build 통과.

## History Index
- 아직 분리된 이력이 없다.
