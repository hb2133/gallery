# Task

## Context
- 영상 페이지 설정도 사진 페이지처럼 목록을 먼저 보이고 상단 제목 버튼을 눌러 편집해야 한다.

## Current Understanding
- 사진 페이지의 공통 메뉴 컴포넌트와 편집 패널을 그대로 재사용할 수 있다.

## Observed Issues
- 사진 설정 설명에 이미 제거된 업로드 폰트 기능이 남아 있었다.

## Decision Notes
- 새 패널을 만들지 않고 `PageCustomizationLayeredPanel`에 media 문구만 추가했다.
- 카테고리는 게시판의 인라인 UI에서 관리하므로 상단 제목 편집창에서는 제외했다.

## Initial Render Harness
- 기존 `InitialAppState.MediaPageCustomization`을 유지하며 저장 구조를 변경하지 않았다.
- 서버 첫 HTML과 hydration이 기존과 같은 설정값을 사용한다.

## Implementation Notes
- 영상 설정에 menu/heading 뷰 상태와 목록 돌아가기를 추가했다.
- 공통 메뉴에 `영상 페이지 설정` 문구와 `상단 제목` 항목을 추가했다.

## Result
- ESLint, 상태 테스트, Next.js 프로덕션 빌드가 통과했다.

## History Index
- 아직 분리된 이력이 없다.
