# Task

## Context
- 첫 페이지에서 SF 위치에 스릴러를, 스릴러 위치에 SF를 표시한다.

## Current Understanding
- `GenreByCategory`가 장르 문구와 고정 위치 카테고리를 연결한다.

## Observed Issues
- 기존 `journal` 위치는 스릴러, `portraits` 위치는 SF로 매핑되어 있었다.

## Decision Notes
- 위치 클래스와 페이지 목적지는 건드리지 않고 두 장르 문자열의 매핑만 교환한다.

## Implementation Notes
- `journal`을 SF로, `portraits`를 스릴러로 변경했다.

## Result
- 프로덕션 빌드 통과
- 메인 페이지 HTTP 200 확인

## History Index
- 아직 분리된 이력이 없다.
