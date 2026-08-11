# Task

## Context
- 관리자는 사진 카드를 비공개하거나 삭제할 수 있어야 한다.
- 비공개 카드는 일반 방문자에게 보이지 않고 관리자에게 상태 아이콘과 함께 보여야 한다.
- 상세 팝업은 사진 외 설명 영역 없이 책 보기를 기본으로 사용해야 한다.

## Current Understanding
- 기본 카드는 코드에 있으므로 DB 행을 물리 삭제하면 fallback 카드가 다시 나타난다.
- 삭제 여부를 tombstone으로 저장해야 계속 숨길 수 있다.

## Observed Issues
- 기존 카드 모델에는 공개 여부와 삭제 상태가 없다.
- 상세 팝업이 사진과 오른쪽 설명 영역의 2열 구조다.

## Decision Notes
- `is_private`, `is_deleted`를 카드 설정 SSOT에 추가한다.
- 삭제는 복귀하는 기본 카드 문제를 막기 위해 영구 숨김 상태로 저장한다.
- 상세 보기 기본값은 책 보기, 버튼은 1 책 보기 / 2 스크롤 보기로 통일한다.

## Initial Render Harness
- `InitialAppStateManager`가 `is_private`, `is_deleted`를 서버에서 함께 읽는다.
- 서버 쿠키로 확인한 관리자 상태와 카드 상태로 `VisibleItems`를 첫 렌더링부터 필터링한다.
- hydration도 같은 initial state를 사용하므로 비공개 기본 카드가 잠깐 노출되지 않는다.

## Implementation Notes
- 편집창에 공개/비공개 토글을 추가했다.
- 좌측 하단 삭제 버튼과 별도 `alertdialog` 확인 단계를 추가했다.
- 관리자 화면의 비공개 카드 좌측 상단에 회색 eye-off 아이콘을 추가했다.
- 일반 방문자는 비공개, 모든 사용자는 삭제 카드가 목록에서 제외된다.
- 상세 팝업의 설명 영역을 제거하고 이미지 영역을 전체 크기로 확장했다.

## Result
- Supabase 원격 마이그레이션 `20260730143000` 적용.
- TypeScript, ESLint, Next.js production build 통과.

## History Index
- 아직 분리된 이력이 없다.
