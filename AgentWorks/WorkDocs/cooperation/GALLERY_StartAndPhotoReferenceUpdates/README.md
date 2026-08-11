# 시작 및 사진 게시판 PDF 레퍼런스 반영

## Summary
- 시작 페이지와 사진 게시판 PDF 7개에 표시된 변경 요구를 현재 정적
  프런트엔드 구조에 반영한다.

## Background
- 시작 페이지는 각진 랜덤 말풍선, 링크 설정, 흑백 전환, 선택 타일의
  대표 이미지 노출을 요구한다.
- 사진 게시판은 표지와 제목 위치, 세부 분류, 게시물별 가로/세로 스크롤
  또는 책 보기, 페이지 바로가기를 요구한다.
- 현재 프로젝트에는 서버 저장형 관리자/CMS가 없으므로 관리 가능 항목은
  게시물 및 화면 설정 데이터로 분리한다.

## Scope
- 시작 헤더 메시지, 외부 링크, 테마 전환
- 선택된 히어로 타일의 대표 이미지
- 사진 표지, 제목 위치, 세부 분류 필터
- 사진 상세의 보기 형식, 스크롤 방향, 페이지 바로가기

## References
- `Reference/시작_01.pdf`
- `Reference/시작_02.pdf`
- `Reference/사진 게시판_01.pdf` ~ `Reference/사진 게시판_05.pdf`
- `src/panels/base/GalleryBasePanel/`
- `src/panels/base/GalleryIndexBasePanel/`
- `src/panels/layered/ImageDetailLayeredPanel/`

## Current Status
- 구현 및 검증 완료
