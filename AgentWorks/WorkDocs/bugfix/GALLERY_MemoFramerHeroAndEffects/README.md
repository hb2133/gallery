# Memo Framer Hero And Effects Fix

## Summary
- `/memo`의 로더 종료 화면, 글자별 스크롤 색상, CRT 노이즈 범위를 Framer 원본과 맞춘다.

## Background
- 기존 구현은 로더가 끝난 뒤에도 전체 화면 CRT와 `0100%`를 Hero로 다시 표시했다.
- 스크롤 색상 컴포넌트가 빠져 있었고 고정 노이즈 영상은 뷰포트 일부만 덮었다.

## Scope
- 흰색 100vh Hero와 400×268 구형 TV, 글자별 회색→검정 스크롤 진행, 전체 뷰포트 노이즈를 수정한다.

## References
- `Reference/4. memo/시작.PNG`
- Framer project `dkYnF5ZD5uOtP4PLoXtw`
- `src/panels/base/MemoBasePanel/`

## Current Status
- 구현 및 브라우저 검증 완료.
