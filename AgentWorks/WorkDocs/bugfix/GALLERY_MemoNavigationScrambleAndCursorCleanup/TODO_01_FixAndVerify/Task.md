# Task

## Bug Context
- Memo에서 검은 cursor label이 중복 노출되고, 상단 nav hover 연출과 Hero `LE` 필기체가 원본과 달랐다.

## Current Understanding
- 앱 루트에 이미 `HomeCursorSection`이 있으므로 Memo 전용 cursor는 필요 없다.
- Framer의 상단 네 링크와 하단 네 소셜 링크만 `Navigation/nav-link`를 쓴다.
- Hero 원본은 Geist 164px `ERIC / CO`와 Inspiration 164px `LE`를 한 줄에 조합한다.

## Observed Issues
- 없음.

## Decision Notes
- 새 cursor 구현 대신 중복 코드를 삭제했다.
- 원본 `nav-link`가 아닌 일반 문구에는 hover 스크램블을 확대하지 않았다.

## Initial Render Harness
- 저장형 기능이 아니므로 해당 없음.

## Fix Notes
- `ScrambleText`를 재사용해 상단 WORK, ABOUT, SERVICES, CONTACT에 적용했다.
- Memo cursor ref, pointer listener, label DOM, CSS와 `data-cursor-label`을 제거했다.
- Google Inspiration font를 로드하고 Hero의 `LE`에만 적용했다.

## Result
- TypeScript, ESLint, diff check 통과.
- Memo cursor 0개, 상단 hover 스크램블 실행·원문 복원, `Inspiration` 단어 0개를 확인했다.
- `LE`의 computed font가 `Inspiration, Inspiration Fallback, cursive`로 적용되고 런타임 오류가 없음을 확인했다.

## History Index
- 아직 분리된 이력이 없다.
