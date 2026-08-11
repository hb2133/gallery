# Task

## Context
- 사용자가 Framer에서 Export한 데스크톱 전체 페이지를 기준으로 `/memo`를 더 정확하게 맞춘다.

## Current Understanding
- Export의 CSS 기준 크기는 1200×11195이며, 핵심은 작은 콘텐츠와 큰 여백의 대비다.
- 화면 순서는 CRT 인트로, 소개, 선택 작업, 접근 방식, 서비스 표, 검정 소개, 흰색 폼이다.

## Observed Issues
- Export 안의 일부 Code Component는 `local-module` 오류 상자로 렌더링되어 원래 리소스를 확인할 수 없다.
- 초기 모바일 `SELECTED` 제목과 중앙 원형 장식 위치를 추가 보정했다.

## Decision Notes
- 오류 상자를 복제하지 않고 정상적으로 확인되는 레이아웃과 시각 언어만 메모 데이터에 매핑한다.
- 전체 Export를 웹 자산으로 사용하지 않고 CRT와 기하 장식을 CSS로 재현해 4MB 이미지 의존을 피한다.

## Initial Render Harness
- 저장 기능 변경이 아니므로 해당 없음.

## Implementation Notes
- 전체 화면 CRT와 전원 켜짐 모션을 CSS로 추가했다.
- Hero를 230svh로 확장하고 소개 문구와 작은 메모 미디어를 큰 여백 안에 배치했다.
- 접근 방식 카드를 중앙 세로 흐름으로 바꾸고 그리드 원형·눈금선을 추가했다.
- 아카이브는 흰색 서비스 표, 소개는 검정, 작성 폼은 흰색으로 재배치했다.

## Result
- 소스 TypeScript, 변경 파일 ESLint, diff check 통과.
- 데스크톱 1200px에서 본문 높이 11444px로 Export 기준 11195px과 근접.
- 데스크톱·모바일 가로 오버플로 0.
- 아카이브 흰색, 소개 검정 섹션의 computed style을 확인했다.

## History Index
- 아직 분리된 이력이 없다.
