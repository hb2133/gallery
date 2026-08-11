# Task

## Context
- 관리자만 접근하는 편집창에서 현재 제한 공개 비밀번호를 확인한다.

## Current Understanding
- bcrypt 해시는 역산할 수 없으므로 새로 설정되는 값부터 제한된 원문 컬럼을 함께 갱신해야 한다.

## Observed Issues
- 마이그레이션 이전 비밀번호는 `password_value`가 null이라 마스크만 표시된다.

## Decision Notes
- 테이블 직접 권한은 계속 revoke하고 관리자 역할을 검사하는 security definer RPC만 사용한다.

## Initial Render Harness
- 편집창을 여는 관리자 액션 시 RPC로 읽는 값이며 공개 서버 HTML에는 포함하지 않는다.

## Fix Notes
- 비밀번호 변경 시 hash와 관리자 조회용 값을 함께 저장한다.
- 편집창을 열기 전에 관리자 전용 RPC로 값을 읽고 눈 버튼으로 보기/숨기기를 제공한다.

## Result
- 마이그레이션 `20260810161000` 원격 적용, lint/build 통과. 실제 관리자 계정으로 새 비밀번호 저장 후 재조회 확인은 남아 있다.

## History Index
- 아직 분리된 이력이 없다.
