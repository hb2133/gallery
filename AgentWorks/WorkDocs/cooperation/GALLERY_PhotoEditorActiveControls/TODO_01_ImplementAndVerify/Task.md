# Task

## Context
- 기존 기호 중심 표시는 어느 페이지가 활성화됐는지 구분하기 어려웠다.

## Current Understanding
- 기존 선택 상태를 그대로 사용해 시각적 상태만 명확하게 한다.

## Observed Issues
- 추가 차단 문제 없음.

## Decision Notes
- 기존 컨트롤러와 저장 경로를 재사용하고 새 추상화는 추가하지 않았다.

## Initial Render Harness
- 저장 기능 변경이 아니므로 해당 없음.

## Fix Notes
- 활성 버튼에 data-active를 연결하고 검은 배경·밝은 글자 스타일을 적용했다.

## Result
- 구현 완료. `npm run lint`와 `npm run build`를 통과했다.

## History Index
- 아직 분리된 이력이 없다.
