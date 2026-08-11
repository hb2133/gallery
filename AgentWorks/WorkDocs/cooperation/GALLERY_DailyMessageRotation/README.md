# 한마디 로테이션 시간 설정

## Summary
- 한마디 문장을 순서대로 순환하고 관리자가 3~3600초 간격을 저장할 수 있게 했다.

## Background
- 기존에는 접속 후 문장 하나를 무작위로 선택하고 고정했다.

## Scope
- UI, 순환 타이머, 공통 정규화, Supabase 저장·SSR 조회를 반영했다.

## References
- `src/components/AdminBrand/AdminBrand.tsx`
- `supabase/migrations/20260810120000_start_page_daily_message_rotation.sql`

## Current Status
- 구현, 원격 DB 반영, SSR·빌드 검증 완료.
