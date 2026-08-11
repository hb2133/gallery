# Task

## Context
- 영상 카드 확대 호버를 제거하고 Play 오버레이 및 상세 팝업으로 변경한다.
- YouTube 네이티브 재생 버튼이 드러나지 않게 한다.

## Current Understanding
- 현재 썸네일은 hover transform을 사용하고 URL 링크가 iframe/YouTube 페이지로 직접 이동한다.
- 카드 클릭은 Controller가 상세 LayeredPanel을 열도록 바꾸고 iframe pointer input은 커스텀 버튼이 가로챈다.

## Observed Issues
- media_posts에 상세 본문 필드가 없다.

## Decision Notes
- YouTube iframe API 패키지 없이 postMessage 명령과 CSS 오버레이만 사용한다.

## Initial Render Harness
- 저장값: media_posts.content.
- SSOT: Supabase media_posts.
- LoadInitialAppState의 서버 조회와 기존 MediaPosts 초기 state에 content를 함께 주입한다.

## Implementation Notes
- 카드 hover transform을 제거하고 검은 반투명 Play 버튼을 추가했다.
- 카드 클릭은 외부 링크 대신 MediaVideoDetailLayeredPanel을 연다.
- 상세 팝업은 레퍼런스처럼 흰색 카드 안에 16:9 영상, 제목, 본문을 표시한다.
- YouTube iframe pointer 입력과 controls를 끄고 postMessage 재생/정지 및 player state 수신으로 커스텀 오버레이를 제어한다.
- 관리자 작성창과 media_posts 서버 초기 조회에 content를 추가했다.

## Result
- Supabase content migration 원격 반영 및 샘플 5건 본문 확인.
- YouTube 상태 파서, TypeScript, lint, production build 통과.
- 별도 production server의 `/media` 첫 HTML에서 저장된 제목과 본문 확인.

## History Index
- 아직 분리된 이력이 없다.
