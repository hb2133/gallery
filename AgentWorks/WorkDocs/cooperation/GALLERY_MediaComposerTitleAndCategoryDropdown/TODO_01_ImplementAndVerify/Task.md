# Task

## Context
- 영상 작성/편집 폼에서 제목을 맨 위로 옮기고 카테고리 선택을 명확한 토글 UI로 바꾼다.

## Current Understanding
- 작성과 편집이 같은 패널을 사용하므로 한 경로만 수정하면 동작을 일관되게 유지할 수 있다.

## Observed Issues
- 추가 차단 문제 없음.

## Decision Notes
- 사진 게시판 입력창과 같은 위치의 간결한 아래 화살표를 사용하고 펼침 상태에서는 위 방향으로 회전시킨다.

## Initial Render Harness
- 기존 게시글과 카테고리 props를 패널 최초 state에 직접 사용한다. 새 저장 기능은 추가하지 않았다.

## Fix Notes
- 제목을 첫 필드로 옮겼다.
- `카테고리 없음`을 포함한 custom listbox를 추가했다.
- 토글의 `aria-expanded`와 화살표 회전, 선택 후 닫힘, Escape 닫힘을 연결했다.

## Result
- `npm run lint`, `npm run build` 통과, 프로덕션 `/media` 200 응답 확인.

## History Index
- 아직 분리된 이력이 없다.
