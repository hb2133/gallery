# Task

## Context
- 선택 상태의 네 박스를 클릭 가능한 메뉴로 확장한다.
- `Reference_5` 기반 갤러리 페이지와 `Reference_6` 기반 커뮤니티 포스트 페이지를 추가한다.

## Current Understanding
- 첫 박스는 갤러리, 두 번째 박스는 커뮤니티 페이지로 이동한다.
- 나머지 두 박스는 클릭 가능 상태만 유지하고 동작은 추가하지 않는다.
- 커뮤니티 페이지는 다른 사용자의 글, 다중 사진, 영상을 지원해야 한다.

## Decision Notes
- 독립 페이지는 각각 `GalleryIndexBasePanel`, `CommunityBasePanel` route로 구성한다.
- 사진 포스트는 Controller가 carousel index를 소유한다.
- 데모 영상은 로컬 정적 자산으로 포함한다.

## Implementation Notes
- 선택 상태의 네 외곽 박스를 버튼으로 전환하고 Gallery, Community,
  Coming soon 두 개의 목적지를 배정했다.
- 갤러리 페이지에 8개 작품 카드와 카테고리 필터를 구현했다.
- 커뮤니티 페이지에 3장 사진 carousel, 로컬 영상 포스트, 텍스트 포스트를
  구현했다.
- 준비 중인 두 박스는 클릭 가능하지만 화면 전환이나 상태 변경을 일으키지
  않는다.
- carousel 화살표는 이미지 hover 또는 키보드 focus 상태에서만 표시하고,
  현재 사진을 나타내는 클릭 가능한 점 indicator를 추가했다.
- 큰 글씨의 텍스트 전용 포스트를 Instagram 피드 방식에 가까운 단일 사진,
  반응 버튼, 작성자 caption 조합으로 변경했다.
- 갤러리 카드 전체에 메인 작품과 동일한 상세 layered panel을 연결했다.

## Result
- `/gallery`, `/community` route와 메인 인터랙션을 브라우저에서 검증했다.
- 린트와 프로덕션 빌드가 통과했으며 커밋 가능한 상태다.
