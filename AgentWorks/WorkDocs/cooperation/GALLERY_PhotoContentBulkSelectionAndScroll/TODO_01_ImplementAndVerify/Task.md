# Task

## Context
- 이미지가 많아질수록 전체 EDIT 패널이 길어지고 개별 X 버튼으로만 삭제할 수 있었다.

## Current Understanding
- 이미지 목록 자체에 제한 높이와 스크롤을 주고, 명시적인 선택 모드에서 체크한 페이지만 한 번에 삭제한다.

## Observed Issues
- 추가 차단 문제 없음.

## Decision Notes
- 선택 모드에서는 페이지 번호 자리에 체크박스를 표시하고 드래그를 잠가 선택과 정렬 동작이 충돌하지 않게 했다.

## Initial Render Harness
- 기존 게시글 저장 흐름을 그대로 사용하며 새 저장값은 추가하지 않아 해당 없음.

## Implementation Notes
- 내용 이미지 제목줄에 이미지 추가·선택·삭제 버튼을 배치했다. 선택 시 번호를 체크박스로 바꾸고 선택된 이미지의 blob URL을 정리한 뒤 일괄 제거한다. 개별 X 버튼은 제거하고 이미지 목록에 독립 세로 스크롤을 적용했다.

## Result
- `npm run lint`와 `npm run build` 통과.

## History Index
- 아직 분리된 이력이 없다.
