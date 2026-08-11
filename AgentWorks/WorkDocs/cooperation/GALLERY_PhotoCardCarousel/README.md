# 사진 카드 정사각형 및 상세 이미지 캐러셀

## Summary
- 사진 페이지를 4개의 정사각형 포토카드와 카드별 다중 이미지 캐러셀로 구성한다.

## Background
- 사진 한 장마다 게시글 카드를 만들지 않고 관련 사진 2장을 한 게시글에서 넘겨보는 구성이 필요하다.

## Scope
- 사진 게시글 카드 4개 표시
- 데스크톱 3열, 태블릿 2열, 모바일 1열 배치
- 카드 대표 이미지를 정사각형으로 표시
- 상세 팝업에서 카드별 2장 사진을 화살표, 키보드, 점 인디케이터로 이동
- 현재 사진에 맞는 출처 표시

## References
- `src/panels/base/GalleryIndexBasePanel/`
- `src/panels/layered/ImageDetailLayeredPanel/`

## Current Status
- 구현 및 검증 완료
- 이동 버튼 스타일 통일, 드래그 전환과 방향감 있는 620ms 이미지 이동을 추가했다.
