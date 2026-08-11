# Task

## Context
- 스크롤 보기에서 일정 페이지 경계를 지날 때 화면이 떨린다.

## Current Understanding
- 스크롤 위치에서 계산한 `ReaderPage` 상태가 페이지 컴포넌트 key에 포함되어 있었다.

## Observed Issues
- 페이지 경계를 넘을 때 key가 모두 바뀌어 React가 전체 페이지 DOM을 교체하고 브라우저 스크롤 기준점이 재설정됐다.

## Decision Notes
- 스크롤 이벤트 자체는 유지하고 페이지 고유 제목을 안정적인 key로 사용했다.

## Initial Render Harness
- 해당 없음

## Fix Notes
- `ReaderPage` key에서 변경되는 `ReaderPage` 상태를 제거했다.

## Result
- 전체 스크롤에서 DOM 교체 0회, 첫 페이지 노드 유지, `scrollTop` 단조 증가를 확인했다.
- TypeScript와 대상 ESLint가 통과했다.

## History Index
- 아직 분리된 이력이 없다.
