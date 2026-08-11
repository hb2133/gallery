# Task

## Context
- 기존 `/writing`을 `Reference/5. writing` 화면 구조로 교체한다.

## Current Understanding
- 레퍼런스는 책등형 아카이브와 문서 리더의 여러 보기 상태를 한 흐름으로 구성한다.
- 기존 DB 편집 기능은 새 정적 포트폴리오 요구에 필요하지 않다.

## Observed Issues
- 기존 개발 서버가 파일 변경을 놓쳐 검증 전 재시작이 필요했다.
- 초기 구현 후 스크롤 보기, 전체 페이지 목차, 본문 검색, 더 부드러운 호버가 추가 요청되었다.

## Decision Notes
- 기존 편집기를 축소 유지하지 않고 정적 데이터와 네이티브 CSS/React 상태만 사용했다.
- 사진 게시판 목차 패턴을 따라 페이지 번호 입력과 3열 실제 페이지 미리보기를 적용했다.

## Initial Render Harness
- 저장값 없음. Writing 콘텐츠의 SSOT는 `WritingBasePanelState.ts` 정적 데이터다.
- 서버 첫 HTML과 hydration이 같은 정적 아카이브 데이터를 사용한다.

## Implementation Notes
- 정적 책등 아카이브와 부드러운 호버 확장, 검색·분류를 구현했다.
- 단면·양면·스크롤 보기, 진행률, 목차, 본문 검색과 읽기 설정을 구현했다.
- Writing Supabase 초기 조회, 저장 manager, 구형 에디터와 전용 의존성을 제거했다.

## Result
- 1440x900 및 390x844에서 모든 주요 상태를 캡처해 가로 넘침과 브라우저 오류가 없음을 확인했다.
- `npx tsc --noEmit`, 대상 ESLint, `npm run build`를 통과했다.

## History Index
- 아직 분리된 이력이 없다.
