# Task

## Context
- 사진 게시글에 제한 공개 비밀번호와 일반 사용자용 잠금 해제 흐름이 필요했다.

## Current Understanding
- 비밀번호 검증은 브라우저가 아니라 보안 함수에서 수행하고, 공개 목록 RPC는 보호된 게시글의 본문과 이미지 경로를 반환하지 않아야 한다.

## Observed Issues
- 현재 원격 데이터에 보호 게시글이 없어 `true` 저장값의 서버 첫 HTML 포함 여부는 실제 보호 게시글 저장 후 추가 확인이 필요하다.

## Decision Notes
- 비밀번호 원문은 저장하지 않고 pgcrypto bcrypt 해시만 별도 private 테이블에 저장한다. 관리자 직접 조회 외에는 보안 정의자 RPC만 사용한다.

## Initial Render Harness
- `load_photo_posts()`를 서버 초기 상태와 클라이언트 재조회가 함께 사용한다. 최신 production 서버의 `/gallery` 첫 HTML에서 현재 저장값 `IsPasswordProtected:false`가 포함되고 HTTP 200임을 확인했다. 보호 게시글이 생성되면 `true`와 숨겨진 콘텐츠 상태를 추가 확인한다.

## Implementation Notes
- 편집창의 게시 상태 아래에 Password 입력과 기존 비밀번호 해제 기능을 추가했다. 일반 사용자가 보호 게시글을 열면 전용 팝업에서 RPC로 검증하고 성공 시에만 전체 게시글을 상태에 합쳐 상세 화면을 연다.
- 원격 마이그레이션은 photo_posts의 공개 직접 조회를 차단하고 보호 여부만 포함한 목록 RPC, 잠금 해제 RPC, 관리자 비밀번호 설정 RPC를 제공한다.

## Result
- `npm run lint`, `npm run build`, 최신 production 서버 `/gallery` HTTP 200을 통과했다. `npx supabase migration list`에서 `20260810143000`의 로컬·원격 일치를 확인했다.

## History Index
- 아직 분리된 이력이 없다.
