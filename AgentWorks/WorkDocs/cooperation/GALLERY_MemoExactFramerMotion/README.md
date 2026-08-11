# 짧은글 게시판 Framer 원본 모션·리소스 정밀 적용

## Summary
- Framer 원본 프로젝트에서 읽은 정확한 모션·레이아웃 값을 `/memo`에 적용한다.

## Background
- 기존 구현은 전체 페이지 Export와 공개 배포 번들을 기준으로 재구성했지만, 원본의 섹션 색상 전환·sticky·관성 스크롤·CRT 리소스까지는 반영하지 않았다.

## Scope
- 원본 CRT/노이즈 리소스, 로더와 첫 화면 타이밍, 관성 스크롤, 섹션 흑백 전환, 접근 방식 sticky, 커서·모션 감소 대응.

## References
- `https://eric-cole.framer.website/`
- `https://www.framer.com/community/marketplace/templates/eric-cole/`
- Framer project `dkYnF5ZD5uOtP4PLoXtw`
- `src/panels/base/MemoBasePanel/`

## Current Status
- Framer 원본 프로젝트에서 확인한 모션 값과 CRT 리소스를 `/memo`에 반영했다.
- 데스크톱 Chromium과 모바일 `prefers-reduced-motion` 시나리오를 검증했다.
