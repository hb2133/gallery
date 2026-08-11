# Task

## Context
- 앞으로 추가되는 모든 저장형·인증형·커스텀 기능에서 새로고침 기본값 노출을 사전에 방지해야 한다.

## Current Understanding
- 기능별 사후 버그 수정이 아니라 필수 설계·검증 하네스로 고정해야 반복을 막을 수 있다.

## Observed Issues
- `useEffect` 원격 조회와 정적 `useState` 기본값 조합이 반복적인 초기 화면 교체를 만들었다.

## Decision Notes
- 전용 platform 규칙을 만들고 `AGENTS.md` 필수 읽기 순서에 넣는다.
- 새 저장 기능에 첫 paint 전략이나 실제 HTML 검증이 없으면 리뷰 P0로 판정한다.

## Implementation Notes
- 서버 초기 상태, 브라우저 전용 bootstrap, 관계 데이터와 fallback 규칙을 정의했다.
- 임시 기본값 렌더링, timeout·opacity 은폐와 서버·클라이언트 normalize 불일치를 금지했다.
- 비기본 저장값의 첫 HTML 포함 여부를 필수 검증으로 지정했다.
- 새 WorkDoc의 Checklist와 Task에 초기 렌더링 하네스 항목이 자동 생성되게 했다.

## Result
- 프로젝트 진입 문서, 아키텍처 검증과 리뷰 채점 기준에서 하네스 규칙을 강제한다.

## History Index
- 아직 분리된 이력이 없다.
