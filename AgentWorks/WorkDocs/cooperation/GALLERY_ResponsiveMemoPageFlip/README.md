# 반응형 메모 북 페이지 플립

## Summary
- Vercel Passport의 입체 책 표현을 참고해 한 줄 메모를 닫힌 책에서 펼치고 모서리 드래그로 읽고 편집하게 한다.

## Background
- 기존 화면은 책 형태였지만 페이지 전환 시 내용만 즉시 교체되어 page-flip 경험이 없었다.

## Scope
- 정면 시점의 닫힌 책과 펼친 책 상태
- 하단 모서리 press, drag, release 기반 양방향 3D page flip
- 모서리를 잡을 때 종이 말림과 그림자 표시
- 첫 페이지 왼쪽 모서리로 책 닫기
- 마지막 페이지 이후 이동 및 순환 방지
- 데스크톱과 모바일 모두 좌우 펼침면이 이어지는 반응형 책 유지
- 닫힌 책에서 펼친 책으로 이어지는 부드러운 opening/closing 전환
- 모션 감소 접근성 지원

## References
- `src/panels/base/MemoBasePanel/`
- `https://vercel.com/passport`
- `https://heyzine.com/`
- `https://online.pubhtml5.com/mryp/tfdn/index.html#p=1`

## Current Status
- PubHTML5처럼 포인터 좌표로 접힘선과 앞뒷면을 계산하는 실제 page-fold 엔진으로 교체 후 검증 완료
