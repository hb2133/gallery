# Task

## Bug Context
- 영상 재생이 끝나도 프로그래스바가 끝 위치까지 도달하지 않는다.

## Current Understanding
- `timeupdate`와 YouTube `infoDelivery`는 종료 직전 시간이 마지막 값으로 남을 수 있다.
- 실제 종료 이벤트를 진행 완료의 기준으로 사용해야 한다.

## Observed Issues
- 업로드 영상에는 `onEnded` 처리가 없고 YouTube 종료 상태는 재생 여부만 갱신한다.

## Decision Notes
- 별도 타이머 없이 각 플레이어의 네이티브 종료 신호를 사용한다.

## Initial Render Harness
- 저장 기능 변경이 아니므로 해당 없음.

## Fix Notes
- 업로드 영상 `ended` 시 현재 시간을 실제 재생 길이로 확정한다.
- YouTube 종료 상태를 파싱해 저장된 재생 길이로 진행률을 확정한다.

## Result
- YouTube 종료 상태 단위 검증, 변경 파일 ESLint, 소스 TypeScript 검사를 통과했다.
- `/gallery`는 HTTP 200을 반환했다.
- 전체 ESLint와 Webpack build는 이번 변경과 무관한 기존 React effect 및 전역 CSS selector 오류로 중단됐다.

## History Index
- 아직 분리된 이력이 없다.
