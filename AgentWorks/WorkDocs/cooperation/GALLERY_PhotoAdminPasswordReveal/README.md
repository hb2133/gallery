# 사진 제한공개 관리자 비밀번호 확인

## Summary
- 관리자 편집창에서 제한 공개 비밀번호를 눈 버튼으로 확인할 수 있게 한다.

## Background
- 기존 값은 bcrypt 해시만 있어 원문 복원이 불가능하다. 앞으로 설정되는 값은 접근이 차단된 테이블 컬럼과 관리자 전용 RPC로만 읽는다.

## Scope
- 비밀번호 저장 RPC, 관리자 조회 RPC, 편집창 로딩과 보기/숨기기 상태.

## References
- `supabase/migrations/20260810161000_photo_post_admin_password_reveal.sql`
- `src/managers/PhotoCardCustomizationManager.ts`

## Current Status
- 구현과 원격 마이그레이션 완료. 기존 해시 전용 값은 한 번 변경하기 전까지 원문을 표시할 수 없다.
