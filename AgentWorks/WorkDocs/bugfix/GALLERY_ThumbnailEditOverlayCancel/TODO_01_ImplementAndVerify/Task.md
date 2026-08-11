# Task

## Bug Context
- 썸네일 파일 선택창을 열고 취소하면 마우스가 떠나도 `수정` 오버레이가 남았다.

## Current Understanding
- label의 `:focus-within` 스타일과 file input 포커스 유지가 원인이다.

## Observed Issues
- 런타임에서 확인된 현상이나 새로 발견된 문제를 적는다.

## Decision Notes
- 방향이 바뀐 이유와 폐기한 가설을 적는다.

## Initial Render Harness
- 저장 기능 변경이 아니므로 해당 없음.

## Fix Notes
- 오버레이는 hover에서만 보이게 하고 file change 후 input을 blur 처리했다.

## Result
- lint/build 통과.

## History Index
- 아직 분리된 이력이 없다.
