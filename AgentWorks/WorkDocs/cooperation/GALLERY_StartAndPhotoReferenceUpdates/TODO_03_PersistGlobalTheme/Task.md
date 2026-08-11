# Task

## Context
- 메인 페이지에서 선택한 흑백 테마가 다른 경로에서도 유지되어야 한다.

## Current Understanding
- 현재 테마는 GalleryBasePanel의 로컬 상태와 로컬 CSS 변수에만 존재한다.
- 경로 이동은 새 문서를 여는 방식이므로 저장소 복원과 초기 렌더 전 적용이 필요하다.

## Implementation Notes
- ThemeManager가 선택한 테마를 `gallery-theme` 키로 저장하고 문서 루트에
  적용하도록 구현했다.
- RootLayout의 초기 스크립트가 React 렌더 전에 저장 테마를 복원한다.
- 갤러리, 미디어, 긴 글, 메모, 커뮤니티 페이지의 배경·헤더·주요 카드가
  공통 테마 토큰을 사용하도록 수정했다.
- 사진과 책 종이처럼 원래 색을 유지해야 하는 콘텐츠는 고유 색을 보존했다.

## Result
- ESLint 통과
- TypeScript 검사 통과
- 프로덕션 빌드 통과
- 전체 6개 사용자 경로 HTTP 200 확인
- 전체 경로 HTML에 테마 초기화 스크립트 포함 확인

## History Index
- 아직 분리된 이력이 없다.
