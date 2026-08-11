# Task

## Context
- 기존 순차 로테이션은 즉시 교체되어 전환이 끊겨 보였다.

## Current Understanding
- 저장 구조를 바꾸지 않고 표시 span의 key 기반 진입 애니메이션만 적용한다.

## Observed Issues
- 추가 차단 문제 없음.

## Decision Notes
- 기존 컨트롤러와 저장 경로를 재사용하고 새 추상화는 추가하지 않았다.

## Initial Render Harness
- 저장값과 서버 초기 렌더링 경로는 기존 DailyMessages/rotation 설정을 그대로 사용하므로 변경 없음.

## Fix Notes
- 520ms 페이드·상향 이동을 적용하고 prefers-reduced-motion에서는 애니메이션을 제거했다.

## Result
- 구현 완료. `npm run lint`와 `npm run build`를 통과했다.

## History Index
- 아직 분리된 이력이 없다.
