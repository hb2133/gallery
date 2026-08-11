# Task

## Context
- Gallery 게시판의 상하좌우 보기 이미지 전환을 참고 GIF의 동작으로 변경한다.

## Current Understanding
- 참고 GIF는 사진이 화면 밖으로 밀려나지 않고 현재·다음 사진이 같은 위치에서 겹쳐진다.
- 버튼뿐 아니라 기존 드래그 탐색도 같은 시각 언어를 유지해야 한다.

## Observed Issues
- 기존 `SwipeSlide`는 방향별 `translate3d`로 두 이미지를 100% 이동한다.
- 드래그 취소와 완료가 같은 settling phase를 사용하므로 최종 진행도를 상태로 명시해야 한다.

## Decision Notes
- 기존 방향 판정·잠금·620ms 타이머는 그대로 두고 이동 오프셋을 0~1 투명도 진행도로 변환한다.
- 새 애니메이션 라이브러리나 별도 전환 컴포넌트는 추가하지 않는다.

## Initial Render Harness
- 저장형 기능이 아니므로 해당 없음.

## Implementation Notes
- 드래그 거리를 이미지 프레임 대비 진행도로 계산한다.
- 현재 이미지는 `1 - Progress`, 다음 이미지는 `Progress` 투명도로 겹쳐 표시한다.
- 완료 시 1, 취소 시 0으로 620ms easing하며 모션 감소 설정에서는 전환을 제거한다.
- 완료 전환에는 상하 이동 X축·좌우 이동 Y축 기준의 `rotate3d` 흔들림을 같은 620ms 동안 적용한다.
- 책 넘김 사진 하단은 첫 사진 `0p`, 다음 사진 `1p`처럼 0부터 표시한다.
- 원형 문자 화살표를 제거하고 흰색 테두리 두 선으로 만든 꺾쇠를 방향에 맞게 회전한다.
- 전환 중 추가 입력이 오면 현재 전환을 즉시 확정하고 새 페이지 기준으로 다음 전환을 연속 실행한다.

## Result
- `npx tsc --noEmit`, `npm run lint`, 대상 파일 whitespace 검사가 통과했다.
- 실행 중인 개발 서버는 변경 전 캐시를 유지하므로 화면 확인 전 재시작이 필요하다.
- 흔들림과 0p 페이지 표기 후 TypeScript, ESLint, 대상 파일 whitespace 검사를 다시 통과했다.
- 화살표·연속 입력 수정 후 TypeScript, ESLint, 대상 파일 whitespace 검사를 다시 통과했다.

## History Index
- 아직 분리된 이력이 없다.
