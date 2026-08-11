# Task

## Context
- 사용자가 Eric Cole 템플릿의 휠 스크롤 연출과 애니메이션·리소스를 가능한 그대로 `/memo`에 적용해 달라고 요청했다.

## Current Understanding
- Framer 연결 후 Desktop 1200×11195, Tablet 810, Phone 390의 원본 구조를 확인했다.
- 공통 reveal은 threshold 0.5, opacity 0, y 80, spring 1.2초다.
- 페이지는 Smooth Scroll intensity 16, 섹션 variant 전환 threshold 0.5/replay, 1초 spring을 사용한다.
- 접근 방식 제목은 desktop/tablet에서 sticky top 0이다.
- Hero는 3초 로더 뒤 4.5~5초 지연 모션과 CRT/노이즈 영상을 사용한다.

## Observed Issues
- 기존 `/memo`는 reveal과 이미지 패럴랙스만 있고 관성 스크롤·섹션 variant 전환·sticky·원본 CRT 영상이 빠져 있다.
- Framer Canvas 캡처와 공개 배포 캡처는 일부 코드 컴포넌트 렌더링 차이로 전체 높이가 다르다.

## Decision Notes
- Framer 프로젝트는 읽기 전용으로 사용하고 실제 변경은 Next.js `/memo`에만 적용한다.
- 원본의 인물·포트폴리오 콘텐츠는 복제하지 않고 메모 콘텐츠를 유지하며, 템플릿의 장식 리소스와 동작만 가져온다.
- 접근성을 위해 `prefers-reduced-motion`에서는 관성·로더·reveal을 제거한다.

## Initial Render Harness
- 저장형 기능 변경이 아니므로 해당 없음이다.
- 서버 HTML에는 기존 메모 콘텐츠를 그대로 렌더링하고 모션은 hydration 후 점진적으로 활성화한다.

## Implementation Notes
- Remix 프로젝트에서 CRT 프레임, 전원 영상, glitch 영상, grid·line 장식을 내려받아 로컬 정적 자산으로 사용했다.
- 4.5~5초 hero 진입, y 80 reveal, 1.2초 reveal, intensity 16 관성 휠, 중앙선 기반 section phase 전환을 구현했다.
- Approach header를 desktop/tablet sticky로 유지하고, custom cursor와 reduced-motion 대체 동작을 추가했다.
- 기존 전역 `scroll-behavior: smooth`와 관성 스크롤 충돌은 RAF 이동에 `behavior: instant`를 지정해 해결했다.
- sticky 조상에 생기던 스크롤 컨테이너는 `overflow-x: clip`으로 바꿔 해결했다.

## Result
- `/memo`는 기존 메모 데이터·작성 기능을 유지하면서 Eric Cole 템플릿의 CRT 첫 화면, 휠 관성, reveal, sticky, 흑백 섹션 전환, 커서 연출을 사용한다.
- Playwright 임시 검증 2건(1200px desktop, 390px reduced-motion mobile)이 통과했다.
- ESLint, TypeScript, 범위 파일 whitespace 검증을 통과했다.

## History Index
- 아직 분리된 이력이 없다.
