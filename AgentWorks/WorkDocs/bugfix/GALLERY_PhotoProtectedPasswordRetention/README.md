# 사진 게시글 편집 비밀번호 유지 표시

## Summary
- 비밀번호 보호 사진 게시글의 편집창에 기존 비밀번호 유지 상태를 마스킹 값으로 채워 표시한다.

## Background
- 비밀번호는 bcrypt 단방향 해시로만 저장되어 원문 복원이 불가능하며, 기존 편집창은 빈 입력칸을 보여 유지 여부가 불명확했다.

## Scope
- 사진 카드 편집 패널의 비밀번호 초깃값, 유지·교체·해제 상태 전이.

## References
- `src/panels/layered/PhotoCardEditorLayeredPanel/PhotoCardEditorLayeredPanel.tsx`
- `supabase/migrations/20260810143000_photo_post_password_access.sql`

## Current Status
- 완료. 기존 해시 전용 비밀번호는 마스킹 유지하며, 20260810161000 이후 새로 설정되는 값은 관리자 전용 조회로 확인할 수 있다.
