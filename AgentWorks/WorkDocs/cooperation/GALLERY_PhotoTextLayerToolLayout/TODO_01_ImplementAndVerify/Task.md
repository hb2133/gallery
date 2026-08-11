# Task

## Context
- 레이어 선택과 상세 수정 항목이 한꺼번에 노출되어 목록과 설정의 관계가 불명확했다.

## Current Understanding
- 레이어 목록은 관리 동작을 담당하고 우측 끝 설정 버튼은 해당 레이어의 세부 속성을 연다.

## Observed Issues
- 추가 차단 문제 없음.

## Decision Notes
- 기존 컨트롤러와 저장 경로를 재사용하고 새 추상화는 추가하지 않았다.

## Initial Render Harness
- FontWeight는 기존 photo_card_customizations JSON 저장값에 포함되며 서버가 읽는 동일 정규화 경로에서 기본값 400을 적용한다.

## Fix Notes
- 선택·삭제·설정을 한 행에 두고 추가를 목록 머리에 배치했다. 설정창에 폰트, Regular/Bold, 크기, 색상, 가로·세로 위치를 제공하고 FontWeight를 정규화·저장·렌더링한다.

## Result
- 구현 완료. `npm run lint`와 `npm run build`를 통과했다.

## History Index
- 아직 분리된 이력이 없다.
