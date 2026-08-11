# 사진 비공개 상태 제한공개 숨김

## Summary
- 사진 게시 상태가 비공개이면 제한 공개 설정을 편집창에서 숨긴다.

## Background
- 관리자 전용 비공개와 방문자 비밀번호 공개를 동시에 편집하면 공개 정책이 혼란스러웠다.

## Scope
- 사진 카드 편집 패널의 공개 상태 조건부 UI와 저장 동작.

## References
- `src/panels/layered/PhotoCardEditorLayeredPanel/`

## Current Status
- 완료. 비공개 전환 시 제한 공개 UI는 사라지고 기존 비밀번호는 변경하지 않는다.
