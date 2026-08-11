# Task

## Context
- 책넘김 페이지 번호를 배경 없는 숫자로 바꾸고 페이지 좌우에 맞춰 배치한다. 작성·편집 시 글자 색상과 투명도를 설정한다.

## Current Understanding
- 페이지 번호 스타일은 게시글 카드 커스터마이징에 속하며, Supabase 값을 서버 초기 상태부터 프로젝트 상세 모델까지 전달해야 한다.

## Observed Issues
- 원격 기존 행은 모두 기본값이라 비기본 값 서버 첫 HTML 검증은 아직 수행하지 못했다.

## Decision Notes
- 페이지 번호의 가독성은 텍스트 그림자로 보완하고 별도 검은 배경은 사용하지 않는다.

## Initial Render Harness
- SSOT는 `photo_card_customizations.page_number_color/page_number_opacity`다.
- `InitialAppStateManager`가 서버에서 읽고 Controller의 최초 상태와 상세 프로젝트에 전달한다.
- `/gallery` 첫 HTML에서 기본 저장값 `#ffffff`, `0.86` 직렬화를 확인했다. 비기본 저장값 검증은 남아 있다.

## Fix Notes
- 공용 색상·투명도 컨트롤을 작성/편집 패널에 연결했다.
- 책 페이지 번호를 `p` 없는 숫자로 바꾸고 왼쪽 페이지는 좌하단, 오른쪽 페이지는 우하단에 배치했다.
- 컬럼, 정규화, 저장, 복사/붙여넣기, 서버 초기 상태 경로를 연결했다.

## Result
- 원격 마이그레이션 `20260810153000` 적용 확인.
- `npm run lint`, `npm run build` 통과, 프로덕션 `/gallery` 200 응답 확인.

## History Index
- 아직 분리된 이력이 없다.
