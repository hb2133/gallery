# Task

## Bug Context
- 리더의 검색, 보기 방식, 보기 설정, 목차가 열린 뒤 바깥을 눌러도 닫히지 않았다.
- 버그 수정이면 `Bug Context`로 바꿔도 된다.

## Current Understanding
- 각 창의 열림 상태는 컨트롤러에 있으나 바깥 포인터 입력을 처리하는 경로가 없었다.

## Observed Issues
- 런타임에서 확인된 현상이나 새로 발견된 문제를 적는다.

## Decision Notes
- 방향이 바뀐 이유와 폐기한 가설을 적는다.

## Initial Render Harness
- 저장형 기능이 아니므로 해당 없음.

## Fix Notes
- 리더 루트의 단일 포인터 핸들러에서 창 내부와 각 트리거를 제외한 입력에 열린 창을 닫는다.
- 검색 닫기는 검색어와 강조 표시도 함께 초기화한다.
- 기능 작업이면 `Implementation Notes`로 바꿔도 된다.

## Result
- 네 창 모두 내부 조작 시 유지되고 리더 바깥 영역 클릭 시 닫히는 것을 브라우저로 확인했다.

## History Index
- 아직 분리된 이력이 없다.
