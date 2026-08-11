# Task

## Context
- Framer 레퍼런스와 달랐던 상단 내비게이션, Intro, Selected Work 및 하단 섹션을 동일한 구조와 배치로 조정한다.

## Current Understanding
- 기존 `/memo` 하단은 레퍼런스와 다른 임시 문구와 섹션 높이를 사용하고 있었다.
- Framer 노드의 1200px 데스크톱 실제 rect, typography, gap, padding을 기준값으로 사용했다.

## Observed Issues
- ScrollColorText의 부모 `text-indent`가 단어 조각에 상속돼 글자가 겹쳤다.
- Approach, Services, About, Contact가 레퍼런스와 다른 제목·콘텐츠·높이를 가졌다.

## Decision Notes
- 캡처의 부드러운 스크롤 중간 좌표 대신 Framer 캔버스의 측정 rect를 레이아웃 SSOT로 사용했다.
- 섹션별 원본 높이 합계를 맞춰 전체 페이지 높이를 동일하게 유지했다.

## Initial Render Harness
- 해당 없음. 저장형·인증형 기능 변경이 아니다.

## Implementation Notes
- 아래 스크롤에서 숨고 위 스크롤에서 나타나는 고정 내비게이션을 추가했다.
- Intro의 문구, 48px Geist 타이포그래피, 첫 줄 들여쓰기, Berlin 문구를 복원했다.
- `SELECTED WORK`의 `SE`, `O`를 Inspiration 필기체로 만들고 우측 정렬했다.
- Framer 원본 작업 이미지와 Approach/Services/About/Contact 문구 및 자산을 반영했다.
- 섹션 진입에 따라 밝은/어두운 테마가 전환되도록 스크롤 단계를 연결했다.

## Result
- 1200×800에서 원본과 로컬 전체 높이 모두 11,195px.
- 헤더 하강 시 y=-80, 상승 시 y=0 확인.
- 390px viewport에서 scrollWidth와 clientWidth 모두 390px.
- TypeScript와 대상 ESLint 통과.

## History Index
- 아직 분리된 이력이 없다.
