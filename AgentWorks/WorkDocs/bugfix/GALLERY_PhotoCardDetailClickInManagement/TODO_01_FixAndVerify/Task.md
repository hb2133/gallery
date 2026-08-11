# Task

## Context
- 관리자 로그인 시 관리 상태가 기본 활성화되면서 카드 전체 상세 버튼이 disabled되어 내용 보기가 막혔다.

## Current Understanding
- 관리 상태는 드래그와 편집 버튼 노출만 제어하고 상세 보기 클릭을 차단하면 안 된다.

## Observed Issues
- 추가 차단 문제 없음.

## Decision Notes
- 기존 패널과 상태 흐름을 유지하는 최소 변경을 선택했다.

## Initial Render Harness
- 저장 기능 변경이 아니므로 해당 없음.

## Fix Notes
- CardOpenButton의 IsManaging 기반 disabled를 제거하고 불필요한 disabled 스타일도 삭제했다. 편집은 우측 상단 편집 버튼으로 유지한다.

## Result
- `npm run lint`와 `npm run build` 통과.

## History Index
- 아직 분리된 이력이 없다.
