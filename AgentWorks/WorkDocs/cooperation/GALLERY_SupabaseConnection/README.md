# Supabase 프로젝트 연결

## Summary
- 저장소 루트에 Supabase 로컬 설정을 초기화하고 사용자의 원격 Supabase 프로젝트와 연결한다.

## Background
- 관리자 1명용 로그인과 향후 홈페이지 콘텐츠 관리 기능을 Supabase 기반으로 구현하기 위한 선행 작업이다.

## Scope
- `supabase/` 로컬 설정 생성
- Supabase CLI 브라우저 인증
- 선택한 원격 프로젝트 연결 및 연결 상태 검증
- 비밀값과 CLI 임시 상태가 Git 추적 대상에 포함되지 않는지 확인

## References
- `AgentWorks/docs/project-rules/architecture/`
- `AgentWorks/WorkDocs/cooperation/GALLERY_AdminDailyMessageLogin/`

## Current Status
- 무료 플랜의 새 `gallery` 프로젝트 생성 완료
- 서울 리전 원격 프로젝트와 로컬 `supabase/` 연결 및 검증 완료
