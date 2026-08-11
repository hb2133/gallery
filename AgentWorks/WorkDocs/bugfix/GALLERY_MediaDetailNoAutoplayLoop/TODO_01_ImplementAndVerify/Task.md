# Task

## Bug Context
- 영상 상세 진입 시 자동재생되고 재생이 끝나면 반복됐다.

## Current Understanding
- YouTube embed 파라미터·초기 playVideo 명령과 upload video의 autoPlay/loop 속성이 원인이다.

## Observed Issues
- 런타임에서 확인된 현상이나 새로 발견된 문제를 적는다.

## Decision Notes
- 방향이 바뀐 이유와 폐기한 가설을 적는다.

## Initial Render Harness
- 저장 기능 변경이 아니므로 해당 없음.

## Fix Notes
- YouTube autoplay/loop/playlist와 초기 playVideo를 제거하고 upload video의 autoPlay/loop를 제거했다.

## Result
- lint/build 통과.

## History Index
- 아직 분리된 이력이 없다.
