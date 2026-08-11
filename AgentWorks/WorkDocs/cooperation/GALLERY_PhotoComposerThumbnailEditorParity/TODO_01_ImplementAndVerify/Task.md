# Task

## Context
- 사진 새 글 작성창의 썸네일 설정이 게시글 편집창의 최신 UI와 달랐다.

## Current Understanding
- 기존 작성 상태와 저장 인터페이스는 유지하고 썸네일 조작 UI를 편집창과 동일하게 맞춘다.

## Observed Issues
- 런타임에서 확인된 현상이나 새로 발견된 문제를 적는다.

## Decision Notes
- 카테고리 토글, 우측 썸네일 교체, 공개 상태, 텍스트 일괄 선택·삭제, 플로팅 설정을 동일하게 제공한다.

## Initial Render Harness
- 기존 작성 상태를 그대로 사용하며 서버 첫 화면에 영향을 주지 않는다.

## Fix Notes
- A5 캔버스와 우측 검사기 순서를 맞추고 `::` 설정 메뉴에 5단계 굵기·폰트·크기·색상·위치를 넣었다.

## Result
- lint와 production build를 통과했다.

## History Index
- 아직 분리된 이력이 없다.
