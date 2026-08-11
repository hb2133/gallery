# Task

## Bug Context
- 2번 상하좌우 보기에서 다음 페이지가 나타난 뒤 완료 직전에 짧은 진입 애니메이션이 한 번 더 보인다.

## Current Understanding
- 실제 페이지 넘김은 두 장의 `SwipeSlide`에 적용되는 620ms transform 전환이 담당한다.
- 전환 종료 후 렌더링되는 `HorizontalSlide`에도 별도의 620ms 진입 keyframe이 있어 두 번째 애니메이션 경로가 존재한다.

## Observed Issues
- `SuppressImageEntrance` 상태로 두 번째 애니메이션을 막으려 했지만 전환 완료와 부모 이미지 인덱스 갱신 경계에서 짧게 노출될 수 있다.

## Decision Notes
- 상하좌우 넘김은 `SwipeStage`만 애니메이션하고 완료된 단일 이미지는 정적으로 표시한다.
- 타이밍 보정이나 추가 지연 대신 중복 애니메이션 자체를 제거한다.

## Initial Render Harness
- 저장값이나 서버 초기 상태를 변경하지 않는 클라이언트 전환 수정이므로 해당 없음.

## Fix Notes
- `HorizontalSlide` 방향별 진입 keyframe과 관련 CSS를 제거했다.
- `SuppressImageEntrance` 상태와 관련 갱신 코드를 제거했다.
- 드래그, 버튼, 키보드 이동의 기존 `SwipeStage` 전환은 유지했다.

## Result
- TypeScript, 대상 ESLint, diff 검사 및 Next.js 프로덕션 빌드를 통과했다.

## History Index
- 아직 분리된 이력이 없다.
