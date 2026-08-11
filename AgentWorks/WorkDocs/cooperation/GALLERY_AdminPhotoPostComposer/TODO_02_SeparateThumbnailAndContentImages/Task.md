# Task

## Context
- 새 게시글 작성에서 게시판 썸네일과 상세 보기용 내용 이미지를 따로 지정해야 한다.

## Requirements
- 썸네일과 내용 이미지는 작성창 안의 독립 토글 버튼으로 펼치고 접는다.
- 썸네일은 선택 사항이며 최대 1장이다.
- 내용 이미지는 최소 1장, 최대 20장이다.
- 썸네일이 없으면 첫 번째 내용 이미지를 게시판 표지로 사용한다.

## Initial Render Harness
- SSOT는 기존 `photo_posts.cover_image_path`, `photo_posts.image_paths`, `photo_card_customizations.thumbnail_url`이다.
- 별도 클라이언트 후처리 값이나 새 저장 필드를 추가하지 않는다.
- 서버 초기 상태의 `NormalizePhotoPosts`가 내용 이미지에 포함되지 않은 별도 썸네일 URL도 유지해야 한다.
- 브라우저 재조회는 기존 서버 초기 스냅숏과 같은 normalize 경로를 사용한다.

## Implementation Notes
- 작성창에 썸네일과 내용 이미지 아코디언을 각각 추가했다.
- 썸네일은 0~1장, 내용 이미지는 1~20장으로 UI와 Manager 검증을 분리했다.
- 썸네일은 Storage의 `thumbnail` 경로, 내용 이미지는 `content` 경로에 저장한다.
- 별도 썸네일이 없으면 첫 내용 이미지를 `cover_image_path`와 카드 썸네일로 사용한다.
- 별도 썸네일 URL은 내용 이미지 목록에 포함되지 않아도 서버·브라우저 공통 normalize에서 유지한다.
- 이미지 토글을 모두 열어도 제목·카테고리·게시 상태는 왼쪽 상단에 기존 간격으로 정렬한다.
- 썸네일과 내용 이미지 중 한 항목을 열면 다른 항목은 자동으로 닫힌다.
- 작성창 상단에 편집기와 같은 두 작업 버튼을 배치하고 기본 진입을 썸네일 설정으로 통일했다.
- 썸네일 설정은 왼쪽 미리보기·오른쪽 메타데이터, 내용 이미지는 전체 폭 배치판을 사용한다.
- 게시글 제목은 선택 사항이며, 빈 제목이면 카드 텍스트 레이어를 만들지 않는다.
- 저장 입력에서 제목 자체가 생략돼도 빈 제목으로 정규화해 업로드를 계속한다.

## Verification
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- `git diff --check`
