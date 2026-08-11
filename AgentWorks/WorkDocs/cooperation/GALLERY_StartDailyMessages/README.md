# 시작 페이지 한마디 설정

## Summary
- 시작 페이지 설정에 `한마디` 항목을 추가하고 말풍선 문장 목록을 관리한다.

## Background
- A 로고 오른쪽 말풍선은 코드에 고정된 네 문장 중 하나를 무작위로 표시했다.
- 관리자가 문장 수와 내용을 직접 변경하거나 말풍선을 완전히 숨길 수 없었다.

## Scope
- 설정 목록의 `한마디` 버튼
- 문장 추가·삭제·수정 UI
- Supabase 문장 배열 저장과 관리자 RLS
- 페이지 진입 시 무작위 문장 표시
- 0개 저장 시 말풍선 전체 숨김

## References
- `supabase/migrations/20260729083209_start_page_daily_messages.sql`
- `src/panels/layered/StartPageMessageLayeredPanel/`
- `src/components/AdminBrand/AdminBrand.tsx`
- `src/managers/StartPageCustomizationManager.ts`

## Current Status
- 구현, Supabase 반영과 검증 완료
