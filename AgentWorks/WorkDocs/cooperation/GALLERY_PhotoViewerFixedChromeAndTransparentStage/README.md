# 사진 뷰어 고정 크롬과 투명 스테이지

## Summary
- 사진 뷰어의 공통 조작 UI를 보기 스타일과 분리하고 상하좌우 스테이지를 투명하게 변경했다. 책넘김 페이지는 후속 수정으로 불투명 배경을 유지한다.

## Background
- 보기 스타일 전환 시 외곽 크기가 달라져 목차·스타일·닫기·페이지 위치가 움직였고 상하좌우 보기에 불필요한 검은 배경과 하단 점 목록이 표시됐다.

## Scope
- ImageDetailLayeredPanel 공통 크롬, 목차 동작, 페이지 진행도, 스크롤 스테이지 배경과 페이지 점 목록.

## References
- src/panels/layered/ImageDetailLayeredPanel/

## Current Status
- 완료. lint와 production build를 통과했다.
