# Task

## Bug Context
- 푸터 링크의 특수문자가 호버 종료 전까지 무한 반복되고 Approach 대형 문장 두 개가 겹쳤다.

## Current Understanding
- JS 스크램블 위에 CSS infinite 애니메이션이 덮여 원문 복원을 가렸다.
- Framer 원본 Approach에는 `GOOD WORK SHOULD...` 문장이 없다.

## Observed Issues
- `127.0.0.1`로 접속한 Next 개발 테스트는 dev resource CORS로 hydration이 막혔다. `localhost`로 재검증했다.

## Decision Notes
- CSS 무한 글리치를 제거하고 한 번의 JS 디코딩만 유지한다.
- 복원 순서를 매 호버마다 섹어 영문 글자가 랜덤한 위치에서 점진적으로 확정되게 한다.

## Initial Render Harness
- 저장형 기능이 아니므로 해당 없음.

## Fix Notes
- 1초 동안 50ms 간격으로 특수문자→원문을 랜덤 위치 순서로 복원한다.
- 호버 유지 중에도 1회 완료 후 원문에 멈춘다.
- 호버가 끝나면 진행 중인 프레임을 취소하고 원문으로 즉시 복귀한다.
- Approach의 원본에 없는 대형 문장과 미사용 스타일을 삭제했다.

## Result
- TypeScript, ESLint, diff check 통과.
- 호버 300ms 시 영문/특수문자 혼합, 1초 후 원문 복원, 호버 유지 중 추가 반복 없음을 확인했다.
- `GOOD WORK SHOULD...` 문장 0개, Approach 소개 문구 1개, 가로 overflow 0, 런타임 오류 0을 확인했다.

## History Index
- 아직 분리된 이력이 없다.
