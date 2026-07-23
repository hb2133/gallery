# Task

## Context
- 새 Next.js 기본 셸 위에 사진 포트폴리오 경험을 구현한다.

## Current Understanding
- `Reference_1`은 중앙 작품과 네 방향 카테고리가 만드는 공간적 탐색이 핵심이다.
- `Reference_2`는 큰 여백, 흑백 대비, 얇은 테두리, Geist 계열 타이포가 핵심이다.

## Observed Issues
- 프로젝트에 실제 갤러리용 사진 자산이 없다.
- 기존 추적 파일 변경은 의미 변경 없이 CRLF 줄바꿈 차이만 존재한다.

## Decision Notes
- 데모 사진은 Unsplash 무료 사진을 로컬 정적 자산으로 저장해 외부 런타임 의존을 없앤다.
- 데스크톱은 방향형 내비게이션을 유지하고 모바일은 2×2 선택기로 바꾼다.
- 이미지 상세는 route가 아닌 `LayeredPanel`로 구현한다.

## Implementation Notes
- 방향형 히어로, 카테고리 전환, 작품 필터, 반응형 이미지 그리드를 구현했다.
- 이미지 상세를 focus 및 Escape 닫기를 지원하는 LayeredPanel로 구현했다.
- 저널, 소개, Instagram 및 이메일 진입점을 연결했다.
- Noto Sans KR 폴백을 추가해 한글 표시를 보장했다.

## Result
- ESLint와 Next.js 프로덕션 빌드가 통과했다.
- Playwright 기준 데스크톱/모바일 렌더링, 필터 수량, 오버레이 포커스와 닫기, 대체텍스트, 링크, 가로 오버플로를 검증했다.
- 브라우저 콘솔 오류는 확인되지 않았다.

## History Index
- 아직 분리된 이력이 없다.
