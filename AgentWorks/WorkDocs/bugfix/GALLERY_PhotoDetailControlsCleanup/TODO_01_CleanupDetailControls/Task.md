# Task

## Context
- 사진 상세 팝업의 닫기와 페이지 표시 UI를 더 간결하게 정리한다.

## Current Understanding
- 책 보기에서 페이지별 숫자, 페이지 바로가기, 하단 현재 페이지가 중복 표시되고 있다.

## Observed Issues
- 닫기 버튼의 `Close` 텍스트가 시각적으로 과하다.

## Decision Notes
- 닫기는 접근성 이름을 유지하면서 화면에는 `×`만 표시한다.
- 책 보기에는 각 사진 안쪽 하단에 해당 사진의 `현재/전체`를 표시한다.

## Initial Render Harness
- 사용자 상호작용 뒤 열리는 정적 컨트롤 변경이므로 해당 없음.

## Fix Notes
- `Close` 텍스트, 각 책 페이지 숫자, 개별 `01·02` 버튼, 하단 중앙 페이지 수를 제거했다.
- 닫기 버튼의 배경과 테두리를 제거하고 테마별 회색 `×`를 적용했다.
- 펼쳐진 각 사진 안쪽 하단에 `1/2`, `2/2` 형식 상태를 배치했다.

## Result
- TypeScript, 대상 ESLint, diff check 통과.

## History Index
- 아직 분리된 이력이 없다.
