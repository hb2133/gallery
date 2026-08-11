# Task

## Context
- 카테고리 이름을 변경할 경로가 없고 소속 게시물을 보면서 편집하기 어려웠다.

## Current Understanding
- 더블클릭 시 먼저 해당 필터를 선택하고 Enter 또는 포커스 이탈로 저장하며 Escape로 취소한다.

## Observed Issues
- 추가 차단 문제 없음.

## Decision Notes
- 기존 컨트롤러와 저장 경로를 재사용하고 새 추상화는 추가하지 않았다.

## Initial Render Harness
- 카테고리와 게시물은 기존 서버 초기 데이터 조회 경로에서 읽으므로 변경된 저장값이 다음 요청의 첫 HTML에 반영된다.

## Fix Notes
- 관리자 권한 RPC가 설정 카테고리와 소속 게시물을 함께 갱신한다. 각 화면 상태도 새 이름과 활성 필터로 즉시 동기화한다.

## Result
- 구현 완료. `npm run lint`와 `npm run build`를 통과했다.

## History Index
- 아직 분리된 이력이 없다.
