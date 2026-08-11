# Task

## Bug Context
- 비밀번호가 설정된 사진 게시글도 편집창을 열면 비밀번호 입력칸이 비어 보였다.

## Current Understanding
- DB에는 원문이 아닌 bcrypt 해시만 있어 기존 원문을 복원할 수 없다. UI에서 유지 상태를 마스킹하고 저장 요청은 보내지 않아야 한다.

## Observed Issues
- 기존 입력칸은 빈 값과 `PasswordUpdate = null`로 내부적으로는 유지했지만 사용자에게 그 상태가 보이지 않았다.

## Decision Notes
- 기존 해시 전용 값은 마스크 표시이며 새 비밀번호로 제출하지 않는다. 후속 요청으로 새 설정값은 접근 제한 컬럼과 관리자 전용 RPC에 저장한다.

## Initial Render Harness
- 새 저장값은 없다. 서버 초기 상태의 `IsPasswordProtected`를 편집 패널 최초 state에 직접 사용한다.

## Fix Notes
- 보호 게시글은 마스킹된 8자리 값으로 입력칸을 채운다.
- 그대로 저장하면 `PasswordUpdate = null`로 기존 해시를 유지한다.
- 새 값 입력 시에만 교체하고, 해제 취소 시 유지 마스크를 복구한다.

## Result
- `npm run lint`, `npm run build` 통과, 프로덕션 `/gallery` 200 응답 확인.

## History Index
- 아직 분리된 이력이 없다.
