# Task

## Context
- 문맥 메뉴만 사용하는 간결한 편집 화면으로 정리하고 입력·출력 타이포그래피를 일치시킨다.

## Current Understanding
- 상단 도구 모음은 `/` 메뉴와 선택 텍스트 메뉴가 같은 기능을 제공해 중복이다.
- `input type=text`는 줄바꿈할 수 없으므로 제목을 자동 높이 textarea로 바꿔야 한다.

## Observed Issues
- contentEditable과 메타 입력의 focus selector가 currentColor outline을 강제로 표시했다.

## Decision Notes
- 저장·취소·비공개 같은 문서 액션은 유지하고 본문 서식 위젯만 숨긴다.
- 브라우저 native `field-sizing: content`를 사용해 별도 높이 측정 상태를 만들지 않는다.

## Initial Render Harness
- 저장 데이터와 서버 초기 상태 계약은 변경하지 않는 관리자 편집 UI 수정이다.

## Implementation Notes
- 기존 EditorToolbar를 hidden 처리해 상단 서식 위젯을 노출하지 않는다.
- 제목과 요약을 무테 자동 높이 textarea로 변경했다.
- 편집 메타와 본문 focus outline을 제거했다.
- 제목 폭, 글꼴, 크기, 줄 높이를 읽기 화면 제목과 동일하게 유지했다.

## Result
- TypeScript, 전체 ESLint, 프로덕션 build가 통과했다.

## History Index
- 아직 분리된 이력이 없다.
