# Task

## Context
- 페이지 탐색과 필터를 검증할 수 있도록 긴 글 데이터를 충분히 확장한다.

## Current Understanding
- 페이지당 8개 구조에서 기존 3개만으로는 두 번째 페이지가 생성되지 않는다.

## Observed Issues
- 없음

## Decision Notes
- 기존 글 3개는 유지하고 여러 카테고리에 걸친 테스트 글 10개를 추가한다.

## Implementation Notes
- 디자인 노트, 생활 기록, 마케팅 칼럼, 작업 기록 카테고리로 테스트 글을 구성했다.
- 각 글에 제목, 요약, 날짜, 읽기 시간과 본문 세 문단을 작성했다.

## Result
- 총 13개 글 확인
- 첫 페이지 8개와 두 번째 페이지 버튼 확인
- ESLint와 TypeScript 검사 통과
- `/writing` HTTP 200 확인

## History Index
- 아직 분리된 이력이 없다.
