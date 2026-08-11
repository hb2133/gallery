# Task

## Context
- 사용자가 Chrome에서 GitHub 계정으로 로그인한 Supabase 조직의 프로젝트를 현재 저장소와 연결하도록 요청했다.

## Current Understanding
- 전역 Supabase CLI가 없으므로 `npx supabase`를 사용한다.
- 원격 인증 정보나 데이터베이스 비밀번호는 저장소 파일에 기록하지 않는다.
- 이번 TODO는 연결 기반만 준비하며 실제 로그인 UI와 데이터 스키마 구현은 포함하지 않는다.

## Observed Issues
- 기존 작업 트리에 다수의 사용자 변경사항이 있으므로 요청 범위 밖 파일은 보존해야 한다.
- 인증된 Supabase 계정에서 조회되는 원격 프로젝트는 `KioskBoard` 하나이며 `gallery` 프로젝트는 없다.

## Decision Notes
- Supabase 공식 CLI가 생성하는 표준 `supabase/config.toml` 구성을 사용한다.
- 기존 `KioskBoard`와 분리된 무료 플랜 프로젝트 `gallery`를 서울 리전에 새로 생성한다.

## Implementation Notes
- `npx supabase init`으로 `supabase/config.toml`과 전용 `.gitignore`를 생성했다.
- 브라우저 인증 코드 방식으로 Supabase CLI 계정 로그인을 완료했다.
- 원격 `gallery` 프로젝트를 생성하고 프로젝트 참조 `jgabmwcwhainvrnrjxah`로 연결했다.
- 생성 과정에서 사용한 데이터베이스 비밀번호는 저장소에 기록하지 않았다.
- CLI 연결 임시 파일은 `supabase/.gitignore`의 `.temp` 규칙으로 제외된다.

## Result
- Supabase 프로젝트 목록에서 `gallery`가 `ACTIVE_HEALTHY`, `linked: true`인 것을 확인했다.

## History Index
- 아직 분리된 이력이 없다.
