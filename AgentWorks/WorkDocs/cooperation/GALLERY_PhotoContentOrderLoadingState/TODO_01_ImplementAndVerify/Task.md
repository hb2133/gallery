# Task

## Context
- 내용 이미지가 많은 게시글에서 페이지 순서 편집을 열 때 썸네일 렌더링으로 지연이 발생한다.

## Current Understanding
- 편집 영역을 먼저 표시하고 브라우저 이미지 디코딩이 끝날 때까지 목록 대신 로딩 상태를 보여준다.

## Observed Issues
- 런타임에서 확인된 현상이나 새로 발견된 문제를 적는다.

## Decision Notes
- 이미지 URL 집합이 바뀔 때만 다시 준비하며 단순 순서 이동에서는 재로딩하지 않는다.

## Initial Render Harness
- 클라이언트 편집 오버레이의 로딩 상태이므로 해당 없음.

## Fix Notes
- 모든 미리보기의 load/decode 완료 전 회전 아이콘과 안내 문구를 표시한다.

## Result
- lint와 production build를 통과했다.

## History Index
- 아직 분리된 이력이 없다.
