# Task

## Context
- 책넘김 페이지 배경이 투명해졌고 펼친 두 페이지 사이에 공백이 보였다.

## Current Understanding
- contain으로 생긴 페이지 내부 여백을 투명 처리한 것이 원인이므로 페이지는 불투명하게 유지하고 이미지가 페이지를 채우게 해야 한다.

## Observed Issues
- 추가 차단 문제 없음.

## Decision Notes
- 투명 배경 방식은 폐기하고 불투명 종이 배경과 cover 이미지 맞춤을 사용했다.

## Initial Render Harness
- 저장 기능 변경이 아니므로 해당 없음.

## Fix Notes
- 스테이지 좌우 패딩을 제거하고 페이지와 이미지 배경을 #f7f7f5로 복원했다. 이미지를 cover로 채우고 페이지 외곽에 같은 색 1px 확장을 적용해 중앙 이음새를 막았다.

## Result
- `npm run lint`와 `npm run build` 통과.

## History Index
- 아직 분리된 이력이 없다.
