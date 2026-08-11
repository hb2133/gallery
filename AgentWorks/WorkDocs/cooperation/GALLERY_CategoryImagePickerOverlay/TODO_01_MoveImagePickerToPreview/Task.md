# Task

## Context
- 카테고리 이미지 선택 버튼이 카드 하단에 있어 설정창을 스크롤하기 전에는 보이지 않았다.

## Current Understanding
- 사용자가 이미지를 보고 변경 대상을 판단하므로 미리보기 자체가 가장 자연스러운 변경 진입점이다.

## Observed Issues
- hover가 없는 터치 환경에서는 데스크톱용 오버레이만으로 변경 가능 여부를 알기 어렵다.
- 파일 선택창에서 취소하면 file input 포커스가 남아 `:focus-within` 오버레이가 계속 표시됐다.
- 포커스를 해제해도 브라우저가 파일 대화상자 이후 CSS `:hover`를 갱신하지 않아 오버레이가 남는 경우가 있었다.

## Decision Notes
- 미리보기 전체를 접근 가능한 file input label로 사용한다.
- 데스크톱은 hover와 focus, 모바일은 상시 하단 오버레이로 수정 가능 상태를 표시한다.

## Implementation Notes
- 기존 카드 하단 `이미지 선택` 버튼을 제거했다.
- 이미지 위에 연필 아이콘과 `수정` 문구를 표시하는 오버레이를 추가했다.
- 업로드 중에는 `업로드 중` 문구와 대기 커서를 표시한다.
- file input의 `cancel`과 `change` 완료 시 포커스를 해제한다.
- CSS `:hover` 대신 포인터 진입·이탈 상태를 사용하고 파일 선택 클릭 순간 해당 상태를 초기화한다.
- 키보드 사용자는 `:focus-visible`일 때만 수정 오버레이를 유지한다.

## Result
- 이미지를 직접 눌러 파일 선택창을 열 수 있다.
- TypeScript, ESLint와 Next.js 프로덕션 빌드가 통과했다.

## History Index
- 아직 분리된 이력이 없다.
