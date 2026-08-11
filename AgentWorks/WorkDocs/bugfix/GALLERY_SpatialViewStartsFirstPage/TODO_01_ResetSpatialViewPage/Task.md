# Task

## Bug Context
- 책 넘김 보기에서 페이지를 이동한 뒤 상하좌우 보기로 바꾸면 해당 페이지에서 시작한다.

## Current Understanding
- 보기 전환 함수가 `ActiveViewMode`만 변경하고 `ActiveImageIndex`를 유지한다.

## Observed Issues
- 런타임에서 확인된 현상이나 새로 발견된 문제를 적는다.

## Decision Notes
- 방향이 바뀐 이유와 폐기한 가설을 적는다.

## Initial Render Harness
- 상세 팝업의 로컬 상호작용 상태이며 저장형 기능이 아니므로 해당 없음.

## Fix Notes
- `scroll` 보기 선택 시 활성 이미지 0과 전환 방향 `right`를 함께 설정한다.

## Result
- 책 보기의 현재 페이지와 무관하게 상하좌우 보기는 1페이지에서 시작한다.
- TypeScript, 관련 ESLint, diff check를 통과했다.

## Result
- 구현 또는 검증 후 최신 결과를 적는다.

## History Index
- 아직 분리된 이력이 없다.
