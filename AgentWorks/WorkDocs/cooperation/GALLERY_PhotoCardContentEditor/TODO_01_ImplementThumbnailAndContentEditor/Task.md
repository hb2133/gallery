# Task

## Context
- 사진 카드 편집 팝업에서 썸네일뿐 아니라 상세 내용 이미지도 수정할 수 있어야 한다.

## Current Understanding
- 썸네일 상태는 `photo_card_customizations`, 내용 이미지는 `photo_posts`가 SSOT다.
- 코드 고정 게시글도 수정 시 같은 ID로 `photo_posts`에 저장하고 초기 목록에서 원본 대신 덮어쓴다.

## Observed Issues
- 기존 `OnSave` 계약은 썸네일 파일만 전달한다.
- 기존 코드 고정 카드는 `photo_posts` 행이 없어 내용 이미지 저장 경로가 없다.

## Decision Notes
- 편집 UI는 작성창과 같은 토글 구조를 사용한다.
- 내용 이미지는 기존 URL 또는 새 `File`을 함께 전달하며 저장 Manager가 새 파일만 업로드한다.
- 코드 고정 카드의 저장 행은 목록에서 중복 생성하지 않고 원래 카드 위치에 병합한다.

## Initial Render Harness
- `InitialAppStateManager`가 `photo_posts.image_paths`, `image_layout`을 서버에서 읽는다.
- 브라우저 재조회도 `NormalizePhotoPosts`를 공통 사용한다.
- 저장 직후 로컬 `PhotoPosts`를 갱신하고 다음 서버 요청에서도 같은 행을 반환한다.

## Implementation Notes
- 썸네일과 내용 이미지 편집 영역을 독립 토글로 구성했다.
- 한 항목을 열면 다른 항목이 닫히는 단일 아코디언 UX를 작성·수정 화면에 공통 적용했다.
- 내용 이미지는 최소 1장, 최대 20장으로 제한한다.
- 이미지 추가·삭제와 5×5 위치 이동·자리 교환을 지원한다.

## Result
- TypeScript, ESLint, production build와 서버 첫 HTML 좌표 포함 여부를 확인했다.

## History Index
- 아직 분리된 이력이 없다.
