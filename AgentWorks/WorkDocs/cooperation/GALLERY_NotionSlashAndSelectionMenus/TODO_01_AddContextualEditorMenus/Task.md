# Task

## Context
- 입력 흐름을 끊지 않고 블록과 선택 텍스트 서식을 변경하는 문맥 메뉴가 필요하다.

## Current Understanding
- Notion 공식 문서 기준 `/`는 블록 메뉴를 열고 텍스트 highlight는 선택 서식 메뉴를 연다.
- 현재 contentEditable selection Range를 복제·복원하면 새 편집기 의존성 없이 같은 핵심 동작을 구현할 수 있다.

## Observed Issues
- 메뉴 버튼으로 포커스가 이동하면 선택 범위가 풀리므로 mousedown 기본 동작을 막고 저장 Range를 복원해야 한다.

## Decision Notes
- 접근할 수 없는 공유 문서 대신 Notion 공식 도움말의 공개 동작을 기준으로 구현했다.
- 기존 상단 도구 모음은 유지하고 문맥 메뉴만 추가해 모바일과 키보드 fallback을 보존한다.

## Initial Render Harness
- 저장 HTML과 초기 상태 계약은 변경하지 않는 편집 중 전용 UI다.
- 메뉴 위치와 선택 Range는 클라이언트 상호작용 상태이며 서버 첫 HTML에 영향을 주지 않는다.

## Implementation Notes
- caret 직전 문자가 `/`이면 해당 위치 아래에 8개 블록 종류 메뉴를 표시한다.
- 명령 선택 시 `/`를 제거하고 저장된 caret에 블록 명령을 적용한다.
- 텍스트 선택 Range 위에 서식 바를 배치하고 메뉴 조작 전 Range를 복원한다.
- Escape로 두 문맥 메뉴를 닫을 수 있다.

## Result
- slash trigger 순수 함수 검증, TypeScript, 전체 ESLint, 프로덕션 build가 통과했다.

## History Index
- 아직 분리된 이력이 없다.
