# Task

## Context
- 제공된 Remix 링크의 스크롤 진입 애니메이션과 이미지 움직임을 `/memo`에 적용한다.

## Current Understanding
- Remix 링크는 Framer 로그인 후 프로젝트 복제를 요구한다.
- 같은 원본의 공개 배포 번들에서 기본 reveal 값이 `opacity: 0`, `translateY(80px)`, bounce 없는 1.2초 spring임을 확인했다.
- 카드 내부는 `translateY(24px)`와 0.1초 stagger를 사용한다.

## Observed Issues
- 음수 하단 root margin을 쓰면 문서 최하단 푸터가 최대 스크롤에서도 진입하지 못했다.
- 기존 `.next`의 Supabase 생성 chunk가 잘린 상태여서 캐시를 재생성했다.

## Decision Notes
- 외부 템플릿 자산을 핫링크하지 않고 기존 메모 이미지와 CSS 장식으로 시각 언어를 유지한다.
- 새 모션 의존성 없이 `IntersectionObserver`, CSS transition, view timeline을 사용한다.
- reveal은 한 번만 실행해 스크롤을 되돌릴 때 콘텐츠가 반복해서 사라지지 않게 한다.

## Initial Render Harness
- 저장형 기능이 아니므로 해당 없음.
- 서버 HTML은 콘텐츠를 보이는 상태로 유지하며 hydration 후 관찰 대상만 준비해 JavaScript 실패 시에도 내용을 보존한다.

## Implementation Notes
- 34개 제목, 카드, 목록, 폼, 푸터 요소를 화면 진입 시 관찰한다.
- 원본과 같은 80px 이동, 1.2초 전환과 카드·목록 순차 지연을 적용했다.
- 히어로 진입 모션과 지원 브라우저의 이미지 view-timeline 패럴랙스를 적용했다.
- `prefers-reduced-motion`에서는 모든 모션을 제거한다.

## Result
- 소스 TypeScript, 변경 파일 ESLint, diff check 통과.
- 휠 스크롤 후 34/34 대상 reveal 완료 확인.
- 전환 중 opacity 0.742 / translateY 20.6px, 완료 후 opacity 1 / translateY 0 확인.
- 모바일 390px 가로 오버플로 0, 모션 감소 환경의 animation 제거 확인.

## History Index
- 아직 분리된 이력이 없다.
