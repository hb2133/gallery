# Task

## Context
- 관리자가 사진 게시판에 새 게시글과 여러 사진을 직접 업로드할 수 있어야 한다.

## Current Understanding
- 게시글 메타데이터는 DB, 원본 이미지는 공개 Storage, 카드 상태는 기존 `photo_card_customizations`가 SSOT다.

## Observed Issues
- 기존 상세 열기 로직은 로컬 `GalleryProjects`에 등록된 이미지만 허용했다.
- 원격 업로드 이미지는 Next Image 기본 최적화 호스트 제한을 고려해야 한다.

## Decision Notes
- 새 글은 생성 즉시 기본 카드 커스텀 행도 함께 만든다.
- 대표 표지는 선택 사진으로 지정하고 이후 기존 표지 편집기로 추가 수정할 수 있다.
- 업로드 상세 이미지는 `unoptimized`로 렌더링해 Supabase 공개 URL을 지원한다.

## Initial Render Harness
- `InitialAppStateManager`가 `photo_posts`를 카드 설정과 함께 서버에서 조회한다.
- 컨트롤러의 `PhotoPosts`는 `InitialAppState.PhotoPosts`로 초기화한다.
- production `/gallery` 첫 HTML에서 `PhotoPosts` 서버 상태가 포함되는 것을 확인했다.

## Implementation Notes
- 관리자에게만 `+ 새 게시글` 버튼을 표시한다.
- 제목, 카테고리, 공개/비공개, 최대 20장 사진과 대표 표지를 입력한다.
- 게시 시 Storage 업로드 후 게시글과 카드 설정을 생성하고 목록 최상단에 반영한다.
- 동적 원격 이미지도 상세 포토북과 스크롤 보기에 표시한다.

## Result
- Supabase 원격 migration `20260730150000` 적용.
- TypeScript, ESLint, Next.js production build 통과.
- production 서버 첫 HTML `PhotoPosts` 상태 확인.

## History Index
- 아직 분리된 이력이 없다.
