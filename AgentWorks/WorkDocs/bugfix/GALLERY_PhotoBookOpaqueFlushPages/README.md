# 책넘김 배경 복원과 페이지 밀착

## Summary
- 책넘김 페이지의 불투명 배경을 복원하고 외곽 여백과 펼친 면 사이 공백을 제거했다.

## Background
- 페이지 안쪽의 contain 여백을 투명 처리한 뒤 책 배경까지 비쳐 보이고 두 페이지 중앙에 공백이 생겼다.

## Scope
- ImageDetailLayeredPanel 책넘김 스테이지, 페이지 배경과 이미지 맞춤 방식.

## References
- src/panels/layered/ImageDetailLayeredPanel/ImageDetailLayeredPanel.module.css

## Current Status
- 완료. lint와 production build를 통과했다.
