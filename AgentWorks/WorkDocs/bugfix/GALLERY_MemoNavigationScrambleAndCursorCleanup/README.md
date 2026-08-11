# Memo Navigation Scramble And Cursor Cleanup

## Summary
- Memo의 중복 검은 cursor label을 제거하고 Framer nav-link 스크램블과 Hero 타이포그래피를 맞춘다.

## Background
- 전역 `HomeCursorSection`과 Memo 전용 `VIEW PROJECT` label이 중복됐다.
- 상단 nav-link에 푸터와 같은 hover 스크램블이 누락됐고 Hero의 `LE`가 필기체가 아닌 별도 `Inspiration` 문구로 잘못 구현됐다.

## Scope
- Memo 전용 cursor DOM/이벤트/CSS 제거.
- WORK, ABOUT, SERVICES, CONTACT hover 스크램블 적용.
- `ERIC / CO + Inspiration 서체 LE` Hero로 교체.

## References
- Framer `Navigation/nav-link`, `Navigation/navbar`, `section-hero`.
- `src/panels/base/MemoBasePanel/`

## Current Status
- 수정과 런타임 검증 완료.
