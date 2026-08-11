# Task

## Bug Context
- 제목 1~3 전환 시 글자 크기가 중첩 배율로 계속 커졌다.
- 선택 서식의 색상 팔레트를 드래그하면 선택 메뉴가 닫혔다.
- 인용·코드 블록에서 Enter와 Shift+Enter의 의미가 분리되지 않았다.
- `/인용`처럼 검색어를 입력해 메뉴를 거르고 Enter로 선택할 수 없었다.

## Current Understanding
- 제목 크기의 `em` 단위는 잘못 중첩된 이전 HTML에서도 배율이 누적되므로 편집기 기준 절대 크기가 필요하다.
- 팔레트가 포커스를 가져가는 동안 collapsed selection을 메뉴 닫힘으로 해석하면 안 된다.
- 일반 Enter는 인용·코드 블록을 빠져나와 본문 문단을 만들고 Shift+Enter만 같은 블록에 줄바꿈을 넣어야 한다.
- 슬래시부터 caret까지의 한글 검색어와 trigger 길이를 함께 계산해야 한다.
- 후속 확인에서 선택 서식 option이 흰 글자를 상속하면서 운영체제의 흰 팝업 배경과 충돌했다.
- 목록 DOM은 생성되지만 Tailwind preflight가 목록 마커를 제거해 편집기와 읽기 화면에서 목록처럼 보이지 않았다.
- 모든 선택·pointer 이벤트가 슬래시 탐색을 다시 실행해 예전 `/` 위치로 돌아가도 메뉴가 재노출됐다.
- 외부 파일 dragover에서는 보안상 `dataTransfer.files`가 비어 있을 수 있어 `types`의 `Files`로 드롭 가능 여부를 판단해야 한다.

## Decision Notes
- 새 편집기 의존성 없이 기존 Selection, Range와 브라우저 블록 명령을 유지한다.
- 한국어 IME 조합 중 Enter는 슬래시 선택이나 문단 명령으로 처리하지 않는다.

## Initial Render Harness
- 해당 없음. 편집 중 클라이언트 상호작용만 변경하며 저장 HTML의 서버 첫 렌더링 계약은 바꾸지 않는다.

## Fix Notes
- 제목 1~3 크기를 `rem`으로 고정해 중첩 HTML에서도 크기 배율이 누적되지 않게 했다.
- 선택 메뉴 조작 중 collapsed selection은 일시적인 포커스 이동으로 보고 메뉴 위치와 저장 Range를 유지한다.
- 일반 Enter는 인용·코드를 본문 문단으로 전환하고 Shift+Enter는 같은 블록에 줄바꿈을 삽입한다.
- `/검색어`를 메뉴 라벨과 설명으로 필터링하고 Enter로 첫 결과를 적용한다.
- 슬래시 검색 파서에 Node 내장 테스트를 추가했다.
- 슬래시 메뉴가 열리면 메뉴 내부를 제외한 wheel 기본 동작을 막고 바깥 pointer로 닫는다.
- 새 `/` 입력 또는 이미 열린 슬래시 세션의 input에서만 슬래시 메뉴를 갱신한다.
- 선택된 figure 좌우에 pointer 크기 조절 손잡이를 표시하고 inline width를 갱신한다.
- dragover 위치에 표시선을 DOM marker로 넣고 업로드 HTML이 그 marker를 대체하게 했다.

## Result
- Chrome에서 인용·코드 일반 Enter가 블록 밖 `<p>`를 생성하는 것을 확인했다.
- Chrome에서 `/검색어` 전체 삭제 후 인용 블록 명령이 성공하는 것을 확인했다.
- 슬래시 파서 테스트, `npx tsc --noEmit`, `npm run lint`, `npm run build`가 통과했다.
- 개발 서버를 재시작하고 `http://192.168.0.41:3000/writing` HTTP 200을 확인했다.
- 선택 서식 option에 명시적 dark color scheme과 배경·글자색을 적용했다.
- Chrome 계산 스타일에서 목록 marker가 `disc`, `decimal`로 복원됨을 확인했다.
- 업로드 HTML이 drop marker 위치를 대체하고 marker가 없으면 끝에 추가되는 테스트가 통과했다.
- 사진·영상의 좌우 resize와 파일 dragover 삽입선 스타일을 반영했다.
- 최종 TypeScript, ESLint, 프로덕션 빌드가 통과했으며 개발 서버를 재시작해 HTTP 200을 다시 확인했다.

## History Index
- 아직 분리된 이력이 없다.
