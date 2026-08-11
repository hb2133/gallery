# Task

## Context
- 작성 연월이 플레이어 좌하단에 표시되는 위치를 수정한다.

## Current Understanding
- 절대 위치 요소를 본문 정보 grid로 이동하면 요구 좌표가 유지된다.

## Observed Issues
- 날짜가 영상 컨트롤과 같은 시각 레이어에 있었다.

## Decision Notes
- 제목 아래 본문/날짜 2열 배치로 정리했다.

## Initial Render Harness
- 해당 없음. 기존 게시물 날짜를 그대로 표시한다.

## Fix Notes
- 날짜 absolute 스타일을 제거하고 본문과 같은 높이의 우측 열에 배치했다.

## Result
- TypeScript, ESLint, production build 통과.

## History Index
- 아직 분리된 이력이 없다.
