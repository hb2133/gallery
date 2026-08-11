# Task

## Context
- 사용자는 로더 종료 뒤에도 `0100%` 전체 화면 TV가 남고, 원본의 글자별 색상 진행과 전체 CRT 노이즈가 빠진 문제를 보고했다.

## Current Understanding
- 원본 Hero는 흰색 100vh 섹션이며 내부 컨테이너 하단에 400×268 TV가 배치된다.
- 원본 색상 컴포넌트는 요소 top이 viewport 80%에서 20%로 이동할 때 글자별 `#b8b8b8`→`#242424`, opacity `.2`→`1`을 적용한다.
- 노이즈 영상은 fixed overlay로 전체 viewport를 덮어야 한다.

## Observed Issues
- 로더와 Hero가 같은 CRT 구성을 중복 렌더링했다.
- `.GlitchOverlay`가 최대 700px/58vw로 제한되어 화면 일부에만 나타났다.
- 주요 설명 문장이 일반 reveal만 사용했다.

## Decision Notes
- Framer 프로젝트의 Hero 및 `ScrollColorChangeText.tsx`를 읽어 실제 레이아웃과 진행 범위를 사용했다.
- 새 모션 의존성 없이 기존 scroll RAF에 글자별 색상 계산을 합쳤다.

## Initial Render Harness
- 저장형 기능 변경이 아니므로 해당 없음이다.

## Fix Notes
- 중복 Hero CRT를 제거하고 흰색 Hero, 원본 TV 프레임·영상, 메모 GIF fallback을 적용했다.
- Selected intro와 Approach statement에 글자별 스크롤 색상 진행을 적용했다.
- glitch overlay를 `100vw × 100dvh` fixed 레이어로 확장했다.

## Result
- 브라우저 검증에서 로더 종료, Hero 800px 높이, TV 표시, 전체 화면 노이즈, 중간/완료 글자 색상을 모두 확인했다.
- Playwright 1건, ESLint, TypeScript, 범위 diff 검사를 통과했다.

## History Index
- 아직 분리된 이력이 없다.
