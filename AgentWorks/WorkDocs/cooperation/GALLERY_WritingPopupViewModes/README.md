# Writing 팝업 읽기·편집 및 페이지 방향 보기

## Summary
- Writing 게시글 리더를 사진 상세처럼 목록 위 레이어 팝업으로 표시한다.
- 기존 리더 기능을 유지하면서 책넘김과 상하좌우 두 가지 보기 방식을 제공한다.
- 글쓰기와 편집도 Gallery 작성창과 같은 레이어 팝업으로 표시하고 페이지 순서·방향 편집을 제공한다.
- 첫 책넘김 열림을 안정화하고 Gallery와 동일한 공간 이동 화살표·외부 도구 배치를 적용한다.
- Gallery 썸네일 편집기를 재사용해 정사각형 이미지, 텍스트 레이어, 공개·제한 공개를 설정한다.
- 게시글별 보기 방식과 페이지 번호 스타일을 저장하고 많은 페이지도 한 장씩 편집한다.
- 페이지 선택 삭제, 편집 페이지 선택 토글, 썸네일 실화면 동기화와 Gallery형 상단 소개 배치를 적용한다.

## Background
- 기존 리더는 `WritingArchiveSection`을 통째로 대체해 게시글 목록이 사라진다.
- 기존 보기 방식은 한 페이지, 두 페이지, 연속 스크롤 세 가지이며 실제 책장 넘김은 없다.

## Scope
- 게시글 클릭 시 레이어 팝업 열기와 바깥 클릭 닫기
- `react-pageflip`을 재사용한 책넘김 보기
- 페이지별 상하좌우 전환 보기
- 글쓰기·편집 중앙 레이어 팝업
- 5열 페이지 순서 보드의 드래그/버튼 재정렬과 다음 페이지 방향 설정
- 리더 외부 상단 도구와 우측 하단의 작은 진행 표시
- 목차, 검색, 전체화면, 보기 설정, 페이지 위치, 키보드 탐색 유지
- 비밀번호 보호 Writing 본문의 RPC 기반 잠금·해제
- 목차·보기 설정의 Gallery형 열림/닫힘 전환

## References
- `src/panels/base/WritingBasePanel/`
- `src/panels/layered/ImageDetailLayeredPanel/`
- `AgentWorks/docs/project-rules/architecture/ARCHITECTURE_RULES_PANEL_LAYER_NODEJS_NEXTJS_V1.md`

## Current Status
- 구현 및 정적·브라우저 검증 완료
- 프로덕션 빌드와 정적 검증 완료
