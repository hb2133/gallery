# Task

## Context
- 별도 위치 설정 모드로 이동해야 해서 설정과 결과를 한 화면에서 파악하기 어려웠다.

## Current Understanding
- 중앙 13번은 고정하고 채워진 셀만 빈 셀로 이동하며 기존 저장 함수를 재사용한다.

## Observed Issues
- 추가 차단 문제 없음.

## Decision Notes
- 기존 컨트롤러와 저장 경로를 재사용하고 새 추상화는 추가하지 않았다.

## Initial Render Harness
- 이동 결과는 기존 StartPageCustomization 저장 경로를 사용하며 서버 첫 렌더링도 동일한 저장값을 사용한다.

## Fix Notes
- 별도 위치 설정 버튼을 제거하고 drag/drop 및 선택 후 빈 칸 클릭 동작을 추가했다.

## Result
- 구현 완료. `npm run lint`와 `npm run build`를 통과했다.

## History Index
- 아직 분리된 이력이 없다.
