# Supabase 관리자 로그인

## Summary
- 기존 관리자 로그인 모달을 Supabase Auth에 연결하고 모든 페이지에서 세션을 유지한다.

## Background
- `GALLERY_AdminDailyMessageLogin` 작업에서 실제 인증이 없는 예시 모달까지 구현되어 있었다.
- 새 `gallery` Supabase 프로젝트와 기존 Vercel `gallery` 프로젝트가 연결된 상태다.

## Scope
- 이메일/비밀번호 로그인과 로그아웃
- 쿠키 기반 SSR 세션 갱신
- 로그인 상태 공유 및 관리자 상태 표시
- 공개 회원가입 차단과 비밀번호 정책 적용
- 로컬 및 Vercel 환경변수 연결
- 관리자 계정 생성과 실제 로그인 검증

## References
- `AgentWorks/WorkDocs/cooperation/GALLERY_AdminDailyMessageLogin/`
- `AgentWorks/WorkDocs/cooperation/GALLERY_SupabaseConnection/`
- `src/components/AdminBrand/`
- `src/core/infra/supabase/`

## Current Status
- 관리자 계정 생성과 역할 적용 완료
- 로그인, 쿠키 세션 유지, 로그아웃, 공개 회원가입 차단 검증 완료
