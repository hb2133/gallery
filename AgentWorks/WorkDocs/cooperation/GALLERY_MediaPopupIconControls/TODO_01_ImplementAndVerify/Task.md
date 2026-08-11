# Task

## Context
- 텍스트 영상 컨트롤을 표준적인 아이콘과 볼륨 슬라이더로 바꾼다.

## Current Understanding
- 브라우저 영상 API와 YouTube 명령 모두 0~1 UI 값으로 정규화할 수 있다.

## Observed Issues
- YouTube는 volume을 0~100으로 전달한다.

## Decision Notes
- 외부 아이콘 패키지 없이 inline SVG와 native range를 사용했다.

## Initial Render Harness
- 해당 없음. 재생 중 로컬 상태다.

## Implementation Notes
- 볼륨 아이콘 hover/focus 시 range가 펼쳐지고 클릭 시 음소거된다.
- 설정과 전체화면/축소를 SVG 아이콘으로 교체했다.

## Result
- 볼륨 parser 단위 테스트와 전체 검증 통과.

## History Index
- 아직 분리된 이력이 없다.
