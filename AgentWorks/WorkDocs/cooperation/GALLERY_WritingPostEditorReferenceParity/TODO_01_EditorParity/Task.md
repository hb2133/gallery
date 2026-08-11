# Task

## Context
- Writing 글쓰기와 편집창을 게시글 설정.png 및 Gallery 편집 흐름에 맞춘다.
- 버그 수정이면 `Bug Context`로 바꿔도 된다.

## Current Understanding
- 현재 기준 원인, 설계 방향, 작업 가설을 적는다.

## Observed Issues
- 런타임에서 확인된 현상이나 새로 발견된 문제를 적는다.

## Decision Notes
- 방향이 바뀐 이유와 폐기한 가설을 적는다.

## Initial Render Harness
- 기존 Writing 글 저장 SSOT와 서버 첫 렌더링 경로를 변경하지 않았다.

## Implementation Notes
- 전체 흰색 편집 캔버스와 썸네일 수정/본문 페이지 구획을 적용했다.
- 좌측 표지 캔버스와 우측 썸네일, 카테고리, 공개 상태, 텍스트 설정 순서로 구성했다.

## Result
- 새 글과 편집이 같은 구조를 사용하며 기존 저장 계약을 유지한다.

## History Index
- 아직 분리된 이력이 없다.
