# 사진 게시글 비밀번호 제한 공개

## Summary
- 사진 게시글에 제한 공개 비밀번호를 저장하고 비관리자에게 잠금 해제 팝업을 제공한다.

## Background
- 관리자는 바로 열람하고 일반 사용자는 올바른 비밀번호를 입력한 경우에만 보호된 본문과 이미지를 받아야 한다.

## Scope
- 관리자 편집 UI, 서버 비밀번호 해시 저장, 공개 목록의 보호 콘텐츠 차단, 잠금 해제 RPC와 팝업.

## References
- supabase/migrations/20260810143000_photo_post_password_access.sql
- src/managers/gallery/, src/controllers/GalleryIndexBaseController/, src/panels/layered/PhotoPasswordLayeredPanel/

## Current Status
- 구현 및 원격 마이그레이션 완료. 현재 보호 게시물이 없어 비기본 저장값의 서버 첫 HTML 검증은 첫 보호 게시물 저장 시 남아 있다.
