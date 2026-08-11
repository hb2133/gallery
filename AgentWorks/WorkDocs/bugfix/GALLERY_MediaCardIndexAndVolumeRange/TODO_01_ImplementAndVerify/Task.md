# Task

## Bug Context
- 영상 카드에 불필요한 순번이 노출되고 세로 음량 슬라이더가 양 끝까지 이동하지 않았다.

## Current Understanding
- 순번은 카드 렌더링에서 직접 생성됐다.
- 슬라이더의 세로 padding이 값 이동 범위를 줄였다.

## Observed Issues
- 추가 이슈 없음.

## Decision Notes
- 커스텀 슬라이더 로직 대신 네이티브 range input의 여백만 제거했다.

## Initial Render Harness
- 해당 없음. 저장값을 변경하지 않는 표현 수정이다.

## Fix Notes
- 카드 map에서 index 생성과 표시를 제거했다.
- `.VolumeSlider`의 padding을 0으로 변경했다.

## Result
- ESLint, 상태 테스트, Next.js 프로덕션 빌드가 통과했다.

## History Index
- 아직 분리된 이력이 없다.
