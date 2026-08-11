# 사진 게시판 등록 게시물 연도 범위

## Summary
- 사진 게시판 ARCHIVE INDEX 연도를 실제 등록 게시물만 기준으로 계산한다.

## Background
- 기본 샘플 카드 날짜가 실제 등록 게시물 날짜와 함께 계산되어 2022—2026으로 표시됐다.

## Scope
- 사진 게시판 연도 계산 입력을 Supabase `photo_posts` 정규화 결과로 제한한다.

## References
- `GalleryIndexBasePanel`
- `GalleryIndexBasePanelController`

## Current Status
- 수정 및 검증 완료
