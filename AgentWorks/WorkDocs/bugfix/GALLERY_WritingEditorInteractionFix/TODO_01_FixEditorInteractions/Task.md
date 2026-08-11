# Task

## Bug Context
- `/` 입력 후 블록 스타일 선택과 텍스트 드래그 후 인라인 서식 적용이 안정적으로 동작하지 않았다.
- Enter와 Shift+Enter가 의도한 문단 간격을 명확히 구분하지 않았다.

## Current Understanding
- contentEditable DOM 변경 직후 Selection을 다시 읽고, 메뉴에서 명령을 실행하기 전에 저장한 Range를 복구해야 한다.
- 줄바꿈은 `insertParagraph`와 `insertLineBreak` 명령으로 명시적으로 분리한다.

## Observed Issues
- 입력·선택 이벤트별 메뉴 갱신 시점이 분리되어 저장 Range가 오래된 상태가 될 수 있었다.
- `formatBlock`은 일부 브라우저에서 태그 값 형식이 다르다.
- 후속 재현에서 메뉴 위치 state가 갱신될 때마다 새 `dangerouslySetInnerHTML` 객체가 전달되어 React가 편집 DOM을 저장본으로 다시 덮어썼다.
- 메뉴는 이미 열린 상태로 남지만 `/`와 선택 Range가 DOM 교체로 무효화되어 모든 문맥 서식 명령이 적용되지 않았다.
- Chrome에서는 빈 문단의 `/`를 지워 빈 텍스트 노드만 남긴 상태에서 블록·목록 명령이 `false`를 반환했다.

## Decision Notes
- 새 편집기 의존성을 추가하지 않고 현재 contentEditable 구조의 Selection/Range 흐름만 바로잡았다.
- 표준 태그 값을 우선 실행하고 실패할 때 꺾쇠 태그 형식으로 재시도한다.
- 저장 HTML이 실제로 바뀔 때만 innerHTML prop 참조가 바뀌도록 기존 React `useMemo`를 사용한다.
- `/` 삭제로 블록이 비면 브라우저 편집기의 표준 빈 블록 형태인 `<br>`를 남긴 뒤 명령을 실행한다.

## Initial Render Harness
- 해당 없음. 기존 저장 HTML과 서버 첫 렌더링 경로는 변경하지 않았다.

## Fix Notes
- input/select/pointer/key 이벤트 이후 다음 프레임에서 선택 메뉴와 슬래시 메뉴를 함께 동기화한다.
- 서식 적용 후 선택 Range를 다시 저장한다.
- Enter는 새 문단, Shift+Enter는 같은 문단의 `<br>`로 처리하며 미지원 브라우저용 fallback을 추가했다.
- 편집기 문단 하단에 `1.45em` 간격을 적용했다.
- 저장 HTML용 객체를 메모해 메뉴 state 변경이 실제 편집 DOM을 덮어쓰지 않게 했다.
- 빈 문단의 `/` 삭제 후 `<br>`를 유지해 블록·목록 명령이 적용되게 했다.

## Result
- 실제 Chrome에서 빈 `/` 문단이 `<h1><br></h1>`로 변환되고 명령 성공값 `true`를 반환했다.
- `npx tsc --noEmit`, `npm run lint`, `npm run build` 통과.

## History Index
- 아직 분리된 이력이 없다.
