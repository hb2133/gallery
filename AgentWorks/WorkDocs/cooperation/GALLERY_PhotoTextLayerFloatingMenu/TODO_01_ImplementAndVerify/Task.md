# Task

## Context
- 행 내부 설정 박스가 목록 높이를 늘려 텍스트 목록 탐색을 방해했다.

## Current Understanding
- 가벼운 설정 메뉴이므로 새 LayeredPanel 없이 document.body 포털과 fixed 위치를 사용한다.

## Observed Issues
- 추가 차단 문제 없음.

## Decision Notes
- 기존 패널과 상태 흐름을 유지하는 최소 변경을 선택했다.

## Initial Render Harness
- 저장 기능 변경이 아니므로 해당 없음.

## Fix Notes
- `설정` 문구를 `::` 아이콘으로 바꾸고 버튼 위치를 기준으로 메뉴를 화면 안쪽에 배치했다. 투명 백드롭 바깥 클릭과 Escape로 닫는다.

## Result
- `npm run lint`와 `npm run build` 통과.

## History Index
- 아직 분리된 이력이 없다.
