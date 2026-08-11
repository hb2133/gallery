# Task

## Context
- 썸네일 변경을 별도 업로드 버튼이 아닌 이미지 직접 클릭 방식으로 바꿔야 했다.

## Current Understanding
- 기존 파일 입력을 썸네일 미리보기 전체에 겹치면 저장 흐름을 바꾸지 않고 요구 상호작용을 제공할 수 있다.

## Observed Issues
- 추가 차단 문제 없음.

## Decision Notes
- 버튼을 제거하고 label로 감싼 현재 이미지 자체를 클릭 대상으로 사용했다.

## Initial Render Harness
- 저장 구조와 초기 상태를 변경하지 않아 해당 없음.

## Fix Notes
- 미리보기 전체에 투명 file input을 배치하고 호버·focus-within에서 수정 오버레이를 표시했다.

## Result
- `npm run lint` 통과.

## History Index
- 아직 분리된 이력이 없다.
