# Task

## Context
- 메인 페이지 첫 화면 아래의 연속 섹션을 제거한다.

## Current Understanding
- 메인 패널이 히어로 아래에 GallerySection, JournalSection, FooterSection을 직접 조립하고 있었다.

## Observed Issues
- `/mnt/e`의 개발 서버가 파일 변경을 감지하지 못해 재시작 전까지 이전 HTML을 제공했다.

## Decision Notes
- 별도 아카이브 경로는 유지하고 메인 패널의 하단 렌더링만 제거한다.
- 사라진 섹션으로 이동하던 헤더 앵커 링크도 제거한다.

## Implementation Notes
- 메인 패널은 HeaderSection과 HeroSection만 렌더링한다.
- 하단 전용 필터와 상세 패널 상태를 컨트롤러에서 제거했다.
- 헤더를 2열 레이아웃으로 조정했다.

## Result
- ESLint 통과
- 서버 재시작 후 `/` HTTP 200 확인
- 렌더 결과에 HeaderSection, HeroSection과 `#top`만 존재함을 확인

## History Index
- 아직 분리된 이력이 없다.
