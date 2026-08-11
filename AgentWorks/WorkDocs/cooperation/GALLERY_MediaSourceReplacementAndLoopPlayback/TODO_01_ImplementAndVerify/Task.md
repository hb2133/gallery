# Task

## Context
- 영상 게시글 편집에서 소스를 교체하고 상세 팝업 재생 경험을 수정한다.

## Current Understanding
- 편집 UI가 소스 탭과 입력을 숨기고 update action도 source 필드를 갱신하지 않는다.
- 업로드 상세 영상은 autoplay가 음소거되지 않아 브라우저에서 차단될 수 있고 loop 속성이 없다.
- pause 검은 화면은 실제 영상이 아니라 전체를 덮는 `.PlaybackButton`의 검은 배경이다.

## Observed Issues
- 소스 교체 시 새 업로드 성공 후 DB 수정 실패와 기존 파일 정리 순서를 안전하게 다뤄야 한다.
- 사진 상세의 다음 이미지는 전환이 시작된 뒤 처음 요청되어 디코딩 전 검은 배경이 한 프레임 노출될 수 있다.

## Decision Notes
- 기존 작성 폼을 재사용하고 편집에서도 소스 탭을 표시한다.
- 현재 업로드 소스를 유지하는 편집은 파일 선택을 강제하지 않는다.
- DB 갱신 성공 뒤 이전 업로드를 제거하며 갱신 실패 시 새 업로드를 제거한다.
- 사진 상세가 열리면 등록 이미지를 브라우저 이미지 캐시로 미리 요청하고 decode한다.
- 게시판 날짜 문자열에서 모든 연도를 추출해 가장 오래된 연도와 최신 연도를 공통 형식으로 표시한다.
- 커서 레이어를 앱 셸에 한 번만 두고 `data-cursor-label`, `aria-label` 문구를 우선 사용한다.
- 기존 5개를 포함해 영상 테스트 게시글이 총 27개가 되도록 멱등 seed migration을 추가한다.

## Initial Render Harness
- 저장값과 SSOT는 Supabase `media_posts`, `media_page_settings`다.
- 교체 후 같은 source 필드를 기존 SSR 정규화 경로로 사용하고 영상 페이지 설정도 서버 초기 조회에 포함한다.

## Implementation Notes
- 편집 폼에 소스 탭을 항상 표시하고 업로드/YouTube 전환과 교체를 update action에 연결했다.
- 새 업로드 뒤 DB 갱신 실패 시 새 파일을 정리하고 성공 시 이전 업로드 파일을 정리한다.
- 상세 영상에 자동재생, 음소거, loop를 적용하고 pause overlay 배경을 투명하게 바꿨다.
- 영상 관리자 설정에서 제목과 오른쪽 소개 문구의 문구·크기·색상을 저장한다.
- 사진과 영상 설정의 폰트 입력 및 실제 heading font 적용을 제거했다.
- 사진 상세가 열릴 때 등록 이미지를 미리 요청하고 decode한다.
- 앱 셸에 공통 커서를 배치하고 지연 tooltip의 title을 aria/data cursor 문구로 교체했다.
- 공통 연도 계산을 모든 게시판 상단에 적용하고 영상 seed를 총 27개로 확장했다.

## Result
- 상태 및 연도 계산 테스트, TypeScript, ESLint와 production build가 통과했다.
- 서버 첫 HTML에서 네 게시판의 ARCHIVE INDEX, 전역 커서, 영상 소개 문구, 27개 영상 제목과 상세 iframe 비노출을 확인했다.
- 원격 REST에서 영상 게시물 27개와 영상 페이지 설정 1행을 확인했다.

## History Index
- 아직 분리된 이력이 없다.
