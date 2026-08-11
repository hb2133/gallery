# Task

## Context
- 비공개 게시글에서는 제한 공개 입력 영역을 표시하지 않는다.

## Current Understanding
- UI를 숨길 때 기존 비밀번호를 자동 해제하면 데이터 손실이므로 저장 요청은 null로 유지해야 한다.

## Observed Issues
- 추가 차단 문제 없음.

## Decision Notes
- 비공개는 표시 우선순위만 바꾸며 제한 공개 값 자체는 보존한다.

## Initial Render Harness
- 기존 서버 초기 `IsPrivate` 값을 편집 Draft 최초 state에 직접 사용한다.

## Fix Notes
- `Draft.IsPrivate`일 때 제한 공개 Section을 렌더링하지 않고 PasswordUpdate를 null로 고정했다.

## Result
- lint/build 통과.

## History Index
- 아직 분리된 이력이 없다.
