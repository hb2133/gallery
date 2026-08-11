# Task

## Context
- 영상 게시판에도 사진 게시판처럼 관리 가능한 카테고리가 필요했다.

## Current Understanding
- 페이지 설정은 카테고리 목록, 각 게시물은 카테고리 문자열을 소유한다.

## Observed Issues
- 기존 원격 테이블에 카테고리 열이 없어 스키마 확장이 필요했다.

## Decision Notes
- 별도 카테고리 테이블 대신 현재 사진 설정 패턴과 같은 배열 설정을 재사용했다.

## Initial Render Harness
- SSOT는 Supabase `media_page_settings.categories`와 `media_posts.category`다.
- `InitialAppStateManager`가 두 값을 함께 읽어 Client 초기 state에 전달한다.
- production `/media` 첫 HTML에서 저장된 카테고리 배지를 확인했다.

## Implementation Notes
- 최대 20개, 이름 최대 20자의 추가·수정·삭제 UI를 구현했다.
- 글쓰기/편집 select와 카드 좌상단 호버 배지를 연결했다.

## Result
- 원격 27개 게시물과 설정에서 `기록/작업/여행`을 확인했고 전체 검증을 통과했다.

## History Index
- 아직 분리된 이력이 없다.
