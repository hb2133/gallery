# Task

## Context
- 사진 편집의 카테고리 상호작용을 영상 편집과 통일한다.

## Current Understanding
- native select를 panel-local listbox로 교체하고 기존 Draft Category만 갱신하면 저장 흐름은 유지된다.

## Observed Issues
- 추가 차단 문제 없음.

## Decision Notes
- 옵션 hover/선택은 검은 배경, 화살표는 펼침 시 180도 회전한다.

## Initial Render Harness
- 기존 편집 Draft 최초 state를 그대로 사용하며 새 저장값은 없다.

## Fix Notes
- `카테고리 없음` 포함 listbox, Escape 닫힘, 선택 후 닫힘, 화살표 회전을 추가했다.

## Result
- lint/build 통과.

## History Index
- 아직 분리된 이력이 없다.
