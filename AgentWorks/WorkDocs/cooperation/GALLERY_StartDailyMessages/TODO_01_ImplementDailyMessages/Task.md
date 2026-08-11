# Task

## Context
- 관리자가 A 로고 오른쪽에 표시할 한마디 목록을 직접 관리해야 한다.
- 문장 수는 0개 이상이며 페이지 진입마다 무작위 한 문장을 표시해야 한다.

## Current Understanding
- 한마디는 시작 페이지 설정 레코드의 JSON 배열로 저장한다.
- 공개 화면은 배열을 읽고 `AdminBrand`가 mount/설정 load 시 무작위 index를 선택한다.
- 빈 배열이면 `DailyMessage`가 빈 문자열이 되어 말풍선 JSX를 렌더링하지 않는다.

## Observed Issues
- 초기 기본 문구를 먼저 렌더링하면 저장 목록이 0개여도 로딩 전 잠깐 말풍선이 보일 수 있다.

## Decision Notes
- 설정 load 완료 전에는 빈 메시지 배열을 Header에 전달해 초기 flash를 방지한다.
- 빈 입력값은 저장 시 trim 후 제거해 실제 문장 수에 포함하지 않는다.
- 0개 배열은 유효한 설정으로 저장한다.

## Implementation Notes
- `start_page_settings.daily_messages` JSONB 배열 컬럼과 배열 constraint를 추가했다.
- 설정 목록에 `한마디` 버튼 카드와 설명을 추가했다.
- 별도 LayeredPanel에서 `+ 문장 추가`, 항목별 `−`, 입력과 저장을 제공한다.
- 새 문장 추가 후 마지막 입력칸으로 focus가 이동한다.
- 0개 상태에서 말풍선 숨김 결과를 안내한다.
- public read와 admin update 흐름을 기존 설정 Manager에 통합했다.

## Result
- 공개 문장 조회, 익명 쓰기 차단과 실제 관리자 저장을 확인했다.
- 빈 배열 update가 DB constraint를 통과하는지 rollback transaction으로 검증했다.
- ESLint 경고 0, TypeScript 검사와 Next.js 프로덕션 빌드가 통과했다.

## History Index
- 아직 분리된 이력이 없다.
