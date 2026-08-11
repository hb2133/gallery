# Task

## Context
- 긴글 탐색과 편집 화면의 밀도, 배치, 드래그 피드백을 개선한다.

## Current Understanding
- 카테고리 누락은 `nowrap + overflow-x` 배치가 원인이다.
- 보기 설정은 0px 세 번째 열 위에 absolute로 겹쳐 있어 글 영역 안처럼 보였다.
- 드래그 순서는 drop에서만 갱신되어 주변 항목이 반응하지 않았다.

## Observed Issues
- 아래 방향 이동은 제거 후 대상 인덱스를 다시 계산하면 같은 위치에 머무르므로 제거 전 대상 인덱스를 사용해야 한다.

## Decision Notes
- 카테고리는 별도 토글이나 스크롤 없이 CSS wrap으로 모두 노출한다.
- 드래그는 새 의존성 없이 native drag와 Web Animations FLIP 전환을 사용한다.
- 편집기는 별도 미리보기 없이 입력 자체가 결과와 비슷한 WYSIWYG 레이아웃을 사용한다.

## Initial Render Harness
- 기존 `InitialAppState`와 Supabase 저장 계약은 변경하지 않았다.
- 이번 변경은 동일한 서버 초기 카테고리와 순서를 표시하는 CSS 및 클라이언트 드래그 미리보기다.

## Implementation Notes
- 카테고리를 여러 줄 flex wrap으로 전환했다.
- 데스크톱 grid의 세 번째 열을 실제 보기 설정 여백으로 확보했다.
- 드래그 진입 때 순서를 미리 갱신하고 각 항목의 이전·현재 위치 차이를 180ms로 보간한다.
- 취소된 드래그는 시작 순서로 복원하고 drop된 순서만 저장한다.
- 제목·요약·본문을 무테 인라인 편집으로 바꾸고 서식 도구를 compact sticky bar로 구성했다.

## Result
- 순수 순서 이동 검증, TypeScript, 전체 ESLint, 프로덕션 build가 통과했다.

## History Index
- 아직 분리된 이력이 없다.
