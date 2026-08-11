# Task

## Context
- 페이지 경계를 없애 목록 순서 편집을 연속적으로 만들고 문서 편집기에 Notion형 미디어 상호작용을 추가한다.

## Current Understanding
- 페이지 state로 배열을 slice하는 구조가 교차 페이지 드래그를 차단했다.
- 페이지 버튼은 렌더링 필터가 아니라 10개 단위 스크롤 앵커면 충분하다.
- HTML figure를 미디어 블록으로 사용하면 현재 contentEditable과 저장 정화 계약을 유지할 수 있다.

## Observed Issues
- 마지막 페이지의 글 수가 적으면 앵커가 목록 상단에 도달하지 못하므로 스크롤 바닥을 마지막 페이지로 판정해야 한다.

## Decision Notes
- 새 블록 편집기 의존성을 추가하지 않고 native scroll, drag/drop, contentEditable과 CSS resize를 사용한다.
- 영상은 기존 글 첨부 Storage와 업로드 권한을 그대로 사용한다.

## Initial Render Harness
- 글과 순서의 SSOT 및 `InitialAppState` 계약은 변경하지 않았다.
- 서버 첫 HTML은 기존과 동일한 저장 글 전체를 렌더링하고 클라이언트에서는 목록을 잘라내지 않는다.

## Implementation Notes
- `ArticlesPerPage`를 10으로 바꾸고 `slice`를 제거했다.
- 페이지 버튼은 10개 단위 앵커로 smooth scroll하며 휠 위치에 따라 현재 페이지가 갱신된다.
- 드래그 중 목록 상·하단에서 자동 스크롤해 모든 글 사이로 이동할 수 있다.
- 편집 영역에 이미지·영상·파일 다중 drop 업로드를 연결했다.
- figure 블록은 가로 resize가 가능하고 선택 후 Delete/Backspace로 제거된다.
- 저장 정화 허용 목록에 video/source와 제한된 figure width를 추가했다.

## Result
- 13개 글이 10개 단위 2구간으로 계산되는지 확인했다.
- TypeScript, 전체 ESLint, 프로덕션 build가 통과했다.

## History Index
- 아직 분리된 이력이 없다.
