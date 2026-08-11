# Task

## Context
- 텍스트 목록 상단에 추가·선택·삭제를 모으고 복수 선택 삭제를 제공한다.
- 상세 설정은 선택한 행에 붙는 별도 박스로 표시한다.

## Current Understanding
- 저장 모델은 바꾸지 않고 편집 중인 Draft.TextLayers 배열과 로컬 선택 상태만 갱신하면 된다.

## Observed Issues
- 추가 차단 문제 없음.

## Decision Notes
- 새 선택 컴포넌트 없이 네이티브 checkbox와 기존 배열 filter를 사용했다.
- 설정 박스는 전역 팝업이 아니라 대상 행 내부에 렌더링해 모바일과 스크롤 환경에서도 연결 관계를 유지한다.

## Initial Render Harness
- 저장 스키마 변경 없음. 기존 PhotoCardCustomization 저장 경로를 그대로 사용하며 선택 모드는 편집 세션 로컬 상태다.

## Fix Notes
- 상단 버튼을 추가·선택·삭제로 변경하고 + 기호를 제거했다.
- 선택 모드에서는 01, 02 번호 대신 체크박스를 표시한다.
- 삭제는 체크된 모든 레이어를 한 번에 Draft에서 제거한다.
- 각 행에는 설정 버튼만 유지하고 상세 도구를 행 내부 박스로 펼친다.

## Result
- `npm run lint`와 `npm run build` 통과.

## History Index
- 아직 분리된 이력이 없다.
