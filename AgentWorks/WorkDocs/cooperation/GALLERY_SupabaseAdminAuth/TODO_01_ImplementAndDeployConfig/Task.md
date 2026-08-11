# Task

## Context
- 예시 UI였던 숨겨진 로그인 모달을 실제 Supabase 관리자 인증에 연결한다.

## Current Understanding
- Supabase의 현재 Next.js 권장 방식인 `@supabase/ssr`와 쿠키 기반 세션을 사용한다.
- 공개 회원가입을 차단하고 Supabase 관리 API로 만든 계정만 로그인 가능하게 한다.
- 인증 상태는 root provider가 공유하고 향후 홈페이지 커스텀 UI가 동일 상태를 사용할 수 있게 한다.

## Observed Issues
- 기존 Vercel 프로젝트는 연결되어 있었지만 환경변수가 없었다.
- `npm audit --omit=dev`에서 기존 Next.js 의존 경로의 high 취약점 3건이 보고된다. 자동 수정안은 Next.js 9.3.3으로의 부적절한 메이저 다운그레이드라 범위 밖에서 적용하지 않는다.

## Decision Notes
- 브라우저 로컬 저장소 전용 세션 대신 Proxy가 갱신하는 쿠키 세션을 사용한다.
- 회원가입 UI를 제공하지 않는 것에 그치지 않고 원격 Auth 설정에서도 회원가입을 비활성화한다.
- Vercel 공식 별칭을 Supabase Site URL로 사용하고 로컬 및 Preview URL을 허용 목록에 둔다.

## Implementation Notes
- Supabase browser/server client와 session Proxy를 추가했다.
- 전역 `AuthSessionProvider`와 `AuthManager`를 추가했다.
- 기존 로그인 모달을 이메일/비밀번호 로그인, 로그인 상태, 로그아웃 UI로 교체했다.
- 로그인 상태에서 헤더에 `ADMIN` 표시가 나타나며 전역 HTML data 속성도 갱신된다.
- Vercel Production, Preview, Development에 Supabase 공개 환경변수 두 개를 등록했다.
- 원격 Auth 회원가입 차단, 10자 이상 문자·숫자 비밀번호 정책, Site URL과 redirect allow list를 적용했다.
- 관리 API로 이메일 확인이 완료된 단일 계정을 만들고 `admin` 역할을 부여했다. 인증 비밀번호는 파일이나 문서에 기록하지 않았다.

## Result
- ESLint, TypeScript 검사, Next.js 프로덕션 빌드가 통과했다.
- 전체 6개 route가 로컬 프로덕션 서버에서 HTTP 200을 반환했다.
- 잘못된 로그인은 Supabase `invalid_credentials`, 회원가입 시도는 `signup_disabled`로 확인됐다.
- 관리자 계정으로 로그인, `admin` 역할 판정, 쿠키 세션 재사용, 로그아웃과 쿠키 제거를 확인했다.

## History Index
- 아직 분리된 이력이 없다.
