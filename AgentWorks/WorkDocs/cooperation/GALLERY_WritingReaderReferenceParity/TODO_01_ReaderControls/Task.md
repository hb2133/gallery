# Task

## Context
- Writing 리더를 `writing.gif`의 목차, 보기 설정, 중앙 표시와 설정 저장 흐름에 맞춘다.

## Current Understanding
- 현재 기준 원인, 설계 방향, 작업 가설을 적는다.

## Observed Issues
- 런타임에서 확인된 현상이나 새로 발견된 문제를 적는다.

## Decision Notes
- 방향이 바뀐 이유와 폐기한 가설을 적는다.

## Initial Render Harness
- 보기 설정은 `gallery-writing-reader-preferences` 쿠키가 SSOT다.
- `LoadInitialAppState`가 요청 쿠키를 정규화해 서버 첫 HTML에 포함하고 컨트롤러 초기값으로 사용한다.

## Implementation Notes
- 목차를 표지/제목과 전체 페이지 행 목록으로 변경했다.
- 단면/양면/스크롤 메뉴와 전체 화면 아이콘을 레퍼런스 형태로 정리했다.
- 글꼴, 글자 크기, 줄/문단 간격, 좌우/상하 여백, 들여쓰기, 배경 설정을 제공한다.
- 설정 저장과 초기화를 쿠키 영속화에 연결했다.

## Result
- 6개 목차 행, 양면 2페이지, 설정 쿠키 생성, 새로고침 후 serif 복원, 초기화 후 sans 복귀를 브라우저에서 확인했다.
- 커스텀 쿠키의 serif 값이 서버 첫 HTML에 포함되는 것을 확인했다.

## History Index
- 아직 분리된 이력이 없다.
