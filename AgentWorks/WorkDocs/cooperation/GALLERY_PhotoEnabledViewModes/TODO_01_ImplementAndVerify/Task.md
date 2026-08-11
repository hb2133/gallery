# Task

## Context
- ON/OFF 문구 대신 기존 책·상하좌우 아이콘을 눌러 하나 또는 두 보기 방식을 선택한다.

## Current Understanding
- DB의 두 boolean과 앱의 `EnabledViewModes` 배열로 한 개·두 개 선택을 모두 표현한다.

## Observed Issues
- 현재 원격 게시글은 모두 기존 기본값이 책넘김이어서 마이그레이션 후 책넘김만 ON 상태다.

## Decision Notes
- 아이콘은 개별 토글하되 두 방식이 모두 꺼지는 상태만 막는다.

## Initial Render Harness
- SSOT는 `photo_posts.is_book_view_enabled/is_scroll_view_enabled`다.
- `load_photo_posts()` RPC를 서버 초기 상태에서 읽어 Controller 최초 state로 전달한다.
- production `/gallery` 첫 HTML에서 `EnabledViewModes:["book"]`을 확인했다. 두 방식 ON 비기본 값 검증은 남아 있다.

## Fix Notes
- ON/OFF 문구를 제거하고 아이콘 버튼 개별 토글로 변경했다.
- 새 글 기본은 책넘김만 ON이며 기존 글은 이전 기본 보기값 한 개를 그대로 ON으로 이관했다.
- 상세 화면은 허용 방식이 하나면 전환 버튼을 숨기고 그 방식만 렌더링한다.

## Result
- 마이그레이션 `20260810160000` 원격 적용, lint/build/상태 테스트 통과, `/gallery` 200 확인.

## History Index
- 아직 분리된 이력이 없다.
