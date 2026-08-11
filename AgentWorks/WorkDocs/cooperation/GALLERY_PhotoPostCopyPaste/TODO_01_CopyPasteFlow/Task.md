# Task

## Context
- 게시글 편집창 아래에 복사 버튼을, 새 게시글 작성창에 붙여넣기 버튼을 추가한다.

## Current Understanding
- 편집창의 로컬 초안에는 저장 전 파일까지 포함되므로 편집창에서 복사 payload를 만들어 BasePanel Controller에 전달한다.
- Controller가 메모리 복사본을 소유하고 작성창에 payload로 내려준다.

## Observed Issues
- 런타임에서 확인된 현상이나 새로 발견된 문제를 적는다.

## Decision Notes
- 시스템 클립보드는 파일과 구조화 데이터를 안정적으로 보관하기 어려워 사용하지 않는다.
- 기존 저장 URL과 새 File 객체를 모두 유지할 수 있는 페이지 세션 메모리 복사본을 사용한다.

## Initial Render Harness
- 복사본은 관리자의 일시적인 클라이언트 편집 상태이며 서버 저장형 초기값이 아니므로 해당 없음.

## Implementation Notes
- 편집창 하단에 복사 버튼을 추가하고 현재 초안 전체를 복사 payload로 만든다.
- BasePanel Controller가 페이지 세션 동안 복사본을 소유한다.
- 작성창 하단의 붙여넣기 버튼은 카테고리, 공개 상태, 썸네일, 텍스트 레이어, 내용 이미지와 좌표를 교체 적용한다.
- 붙여넣은 텍스트 레이어에는 새 ID를 발급해 원본과 독립적으로 편집한다.
- 게시글 생성기가 기존 썸네일 URL과 새 File을 모두 받을 수 있도록 확장했다.

## Result
- 복사 후 새 게시글 작성창에서 붙여넣으면 원본의 편집 구성이 모두 적용된다.
- 붙여넣은 상태로 게시하면 새 게시글 ID가 생성되며 원본 게시글은 변경되지 않는다.
- TypeScript, 관련 ESLint, 대상 diff check를 통과했고 개발 서버의 `/gallery` 200 응답을 확인했다.
- 최초 확인 시 Turbopack 개발 캐시가 이전 번들을 제공해 버튼이 보이지 않았다.
- 개발 캐시를 재생성하고 서버를 재시작한 뒤 실제 제공 번들에서 `CopyPostButton`, `PasteButton`, `붙여넣기` 문자열 포함을 확인했다.

## History Index
- 아직 분리된 이력이 없다.
