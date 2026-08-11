# Task

## Context
- 영상01의 카드 메타 타이포그래피와 영상02의 상세 팝업 형태를 적용해야 했다.

## Current Understanding
- 기존 데이터의 Title, Content, Date를 사용하고 카드 그리드와 재생 컨트롤은 변경하지 않는다.

## Observed Issues
- 추가 차단 문제 없음.

## Decision Notes
- 카드의 Studio 표시는 설명으로 교체하고, 긴 문자열은 한 줄 말줄임으로 레이아웃을 보호했다.

## Initial Render Harness
- 저장 기능 변경이 아니며 기존 서버 초기 MediaArchiveItem 데이터를 그대로 사용한다.

## Implementation Notes
- 카드 제목을 큰 중간 굵기 타이포로 만들고 날짜·설명을 작은 한 줄 메타로 배치했다.
- 상세 팝업을 넓은 16:9 영상과 어두운 배경, 하단 제목·설명·날짜 구조로 변경했다. 기존 컨트롤과 전체화면 동작은 유지했다.

## Result
- `npm run lint`, `npm run build`, production `/media` HTTP 200 통과.

## History Index
- 아직 분리된 이력이 없다.
