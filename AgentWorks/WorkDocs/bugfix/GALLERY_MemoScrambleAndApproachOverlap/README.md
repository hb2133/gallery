# Memo Scramble And Approach Overlap

## Summary
- Memo 푸터 소셜 링크의 무한 hover 글리치와 Approach 텍스트 겹침을 Framer 원본 동작으로 맞춘다.

## Background
- 호버 중 특수문자가 계속 반복되고, 원본에 없는 대형 문장이 sticky 소개 문구와 겹쳤다.

## Scope
- 소셜 링크 스크램블 1회 실행·랜덤 위치 복원.
- Approach의 원본에 없는 `GOOD WORK SHOULD...` 문장 제거.

## References
- Framer `Workshop/TextScramble.tsx`
- Framer `Sections/section-approach`
- `src/panels/base/MemoBasePanel/`

## Current Status
- 수정과 런타임 검증 완료.
