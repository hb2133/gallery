# Task

## Context
- 페이지 순서 편집의 선택·삭제·이미지 추가 버튼이 위아래로 표시됐다.

## Current Understanding
- `.ContentEditorHeading > div`의 grid 규칙이 설명과 작업 버튼 컨테이너 모두에 적용된 것이 원인이었다.

## Observed Issues
- 추가 차단 문제 없음.

## Decision Notes
- 별도 구조를 추가하지 않고 설명 컨테이너만 grid를 사용하도록 선택자를 좁혔다.

## Initial Render Harness
- 저장 기능 변경이 아니므로 해당 없음.

## Fix Notes
- 작업 버튼 컨테이너의 flex가 정상 적용되게 하고 JSX 순서를 선택·삭제·이미지 추가로 변경했다.

## Result
- `npm run lint` 통과.

## History Index
- 아직 분리된 이력이 없다.
