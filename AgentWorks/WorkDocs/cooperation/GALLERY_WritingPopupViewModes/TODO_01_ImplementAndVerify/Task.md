# Task

## Context
- Writing 게시글을 누르면 사진 상세처럼 배경 목록 위에 팝업이 열려야 한다.
- 기존 아이콘, 목차, 검색, 전체화면, 보기 설정과 진행률은 유지한다.
- 보기 방식은 실제 책넘김과 상하좌우 전환 두 가지를 제공한다.
- Writing 글쓰기와 편집도 Gallery 작성창과 같은 팝업 안에서 수행해야 한다.
- Writing 페이지 순서와 상하좌우 이동 방향을 Gallery 양식처럼 편집해야 한다.
- 썸네일은 정사각형 이미지와 Gallery 텍스트 레이어 편집을 사용한다.
- 공개 글은 선택적으로 비밀번호 제한 공개할 수 있어야 한다.
- 본문 보기 방식과 페이지 번호 색상·투명도를 게시글별로 저장해야 한다.
- 본문 페이지가 많아져도 편집 카드 전체를 한 번에 렌더링하지 않는다.

## Current Understanding
- 기존 Reader는 `WritingArchiveSection`의 조건부 반환이라 목록 화면을 대체한다.
- 프로젝트에 사진 책넘김용 `react-pageflip`과 레이어 포털이 이미 있다.
- Writing 본문은 기존 `content_html` JSON에 페이지 배열로 저장되므로 선택 방향을 선택 필드로 함께 저장할 수 있다.

## Observed Issues
- 저장된 기존 보기 값은 `single | spread | scroll`이며 UI에서는 `spread`와 `scroll`을 각각 책넘김과 상하좌우 모드로 사용한다.
- 책넘김 모드로 처음 열면 `react-pageflip`이 레이어 크기 확정 전에 초기화되어 내용이 보이지 않고, 보기 전환 후 재마운트될 때만 보인다.
- Writing의 공간 이동 화살표와 내부 툴바·진행 막대가 Gallery 리더의 UI와 다르다.

## Decision Notes
- 새 의존성은 추가하지 않고 Gallery의 기존 편집 구성요소를 재사용한다.
- 기존 리더 UI를 유지하고 표시 컨테이너와 페이지 캔버스만 바꾼다.
- 사진 상세와 같은 `PanelLayerHost`, 어두운 backdrop, 1·2 보기 선택기를 사용한다.
- Gallery의 `PhotoPageDirection` 정규화 로직을 재사용하고 `forward_direction`을 기존 Writing JSON에 저장한다.
- 페이지 순서는 Writing 페이지 배열 순서로 표현하고 별도 좌표 스키마는 만들지 않는다.
- 책 컴포넌트는 레이어가 배치된 다음 animation frame에 한 번 초기화한다.
- 공간 이동 화살표는 Gallery의 아이콘, 방향 위치, hover/focus 노출 CSS를 그대로 적용한다.
- 기존 도구는 시각적으로 리더 밖 상단에 배치하고 내부 글닫기 버튼과 진행 range는 제거한다.
- Writing 본문 직접 공개 조회를 RPC로 바꾸고 잠긴 글은 썸네일·텍스트만 전달한다.
- 본문 편집은 접힌 영역에서 선택한 페이지 한 장만 표시한다.
- 페이지 삭제는 Gallery처럼 순서 편집의 선택·삭제 동작으로 처리한다.
- 저장 썸네일은 편집기의 정사각형 크기·crop·텍스트 스타일과 같은 방식으로 렌더링한다.
- Writing 상단은 Gallery의 헤더·소개·카테고리 도구 기준선과 같은 구조를 사용한다.

## Initial Render Harness
- 보기 설정 SSOT는 기존 `gallery-writing-reader-preferences` 쿠키다.
- `InitialAppStateManager`가 서버에서 읽은 초기값을 Controller 최초 state에 주입하는 기존 경로를 유지한다.
- legacy 보기 값은 서버·클라이언트 공용 `NormalizeWritingReaderPreferences`에서 새 값으로 변환한다.
- 페이지 방향은 `WritingPostManager.NormalizeWritingPosts`의 기존 서버 초기 상태 경로로 정규화한다.
- Writing 글 목록은 `load_writing_posts` RPC를 서버 첫 렌더링과 브라우저 재조회에서 함께 사용한다.
- 썸네일 URL·텍스트 레이어는 잠긴 본문과 분리된 컬럼으로 서버 첫 HTML에 포함한다.
- 비기본 방향값이 `/writing` 서버 첫 HTML의 초기 상태에 포함되는 것을 확인한다.

## Implementation Notes
- `WritingReaderLayeredPanel`을 추가해 목록 위 포털에 리더를 표시한다.
- `react-pageflip`을 재사용해 책넘김을 구현하고, 상하좌우 모드는 저장 방향에 따라 단일 페이지와 화살표를 이동·전환한다.
- Writing 편집기는 Gallery와 같은 크기의 중앙 모달로 바꾸고 본문에 5열 순서·방향 보드를 추가한다.
- 순서는 네이티브 drag/drop과 이전·다음 버튼으로 편집하며 마지막 페이지의 다음 방향은 항상 `null`로 정규화한다.
- 책넘김 첫 초기화를 다음 레이아웃 프레임으로 늦춰 첫 열림의 빈 페이지를 막는다.
- 목차·보기 방식·전체화면·설정·검색 도구를 리더 외부 상단으로 옮기고 진행 정보를 우측 하단의 작은 텍스트로 바꾼다.
- Gallery `ThumbnailEditorSection`, `PhotoViewModeSelector`, `PhotoPageNumberStyleControl`을 Writing 편집기에 연결한다.
- 페이지 번호는 책의 좌·우 면 하단에 배치하고 진행 표시는 `0 / 6` 형식으로 단순화한다.
- 목차와 보기 설정은 열린 상태와 닫힌 상태를 DOM에 유지해 양방향 전환을 적용한다.

## Result
- 방향 전환 체크, TypeScript, ESLint, diff 검사가 통과했다.
- `/writing` 로컬·LAN 응답은 HTTP 200이고 리더 팝업의 두 보기, 도구, 방향 이동, 닫기를 브라우저에서 확인했다.
- 프로덕션 빌드는 코드 오류가 아니라 `fonts.gstatic.com` 시간 초과로 완료하지 못했다.
- 후속 수정은 TypeScript, 전체 ESLint, 방향 전환 체크와 diff 검사를 통과했다.
- 실행 중인 3000 개발 서버가 Windows 드라이브 변경을 감지하지 않아 최신 UI 브라우저 검증은 서버 재시작 후 필요하다.
- 후속 편집·보안 변경은 TypeScript, 전체 ESLint, diff 검사와 방향 전환 체크를 통과했다.
- 신규 Writing RPC 마이그레이션을 연결된 원격 DB에 적용했고 schema lint가 통과했다.
- 기존 3000 서버가 최신 UI 번들을 감지하지 않아 실제 잠금·해제 브라우저 검증은 서버 재시작 후 확인한다.
- 페이지 선택 삭제, 회전형 페이지 선택 토글, 정사각형 썸네일 동기화와 Gallery형 상단 소개 배치를 반영했다.
- Next.js 프로덕션 빌드, TypeScript, ESLint, diff 검사와 방향 전환 체크가 통과했다.
- 관리자 재정렬 원본을 `visibility: hidden`으로 바꿔 네이티브 드래그가 중단되던 회귀를 `opacity: 0` 삽입 자리로 수정했다.
- 최종 Next.js 프로덕션 빌드, 전체 ESLint, TypeScript, 상태 체크와 diff 검사가 통과했다.

## History Index
- 아직 분리된 이력이 없다.
