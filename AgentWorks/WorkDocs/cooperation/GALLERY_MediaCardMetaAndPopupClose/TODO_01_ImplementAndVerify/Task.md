# Task

## Context
- 영상 카드에서 설명은 왼쪽, 날짜는 오른쪽에 두고 팝업의 날짜/X 배경을 제거한다.

## Current Understanding
- 카드 메타 DOM 순서와 flex 정렬, 팝업 절대 위치 CSS만 조정하면 된다.

## Observed Issues
- 추가 차단 문제 없음.

## Decision Notes
- 닫기 버튼은 영상 프레임 바깥 우측 상단에 두되 모바일 간격도 별도로 유지한다.

## Initial Render Harness
- 저장 기능 변경이 아니므로 해당 없음.

## Fix Notes
- 설명/날짜 순서를 바꾸고 space-between을 적용했다.
- 날짜와 X 배경을 투명하게 만들고 X를 프레임 바깥 대각선 우측 상단으로 옮겼다.

## Result
- lint/build 통과, `/media` 200 확인.

## History Index
- 아직 분리된 이력이 없다.
