# 사진 게시물 무제한 이미지와 페이지 인덱스 탐색

## Summary
- 사진 게시물의 내용 이미지 개수 제한을 제거한다.
- 상세 포토북의 오른쪽 페이지 버튼 묶음을 스크롤 가능한 페이지 인덱스로 교체한다.
- 내용 이미지 배치판을 빈 슬롯 없는 페이지 삽입·재정렬 도구로 변경한다.
- 각 페이지에서 다음 인덱스로 넘어갈 방향을 지정하고 복귀 방향을 자동 생성한다.

## Background
- 기존 작성기와 편집기, 저장 Manager, 서버 정규화가 내용 이미지를 20장으로 제한했다.
- 기존 5×5 배치판은 이미지 배열 순서와 좌표 순서가 분리되어 드래그 후 실제 페이지 순서가 바뀌지 않을 수 있었다.
- 상세 포토북의 페이지 버튼은 오른쪽에 최대 10행 2열로 고정되어 페이지가 늘어날수록 확장하기 어려웠다.

## Scope
- 작성기·편집기·저장 계층의 내용 이미지 개수 상한 제거.
- 다섯 열과 무제한 행을 사용하는 연속 페이지 순서 편집.
- 드롭 위치로 배열 항목을 삽입하고 나머지 페이지를 재번호화.
- 추가·삭제·붙여넣기·서버 정규화에서 빈 좌표 제거.
- 포토북 하단 가로 스크롤 페이지 인덱스와 직접 페이지 이동.
- `Reference/Image_02.png` 기준 빨간 다음 방향·파란 복귀 방향 편집 및 상세 탐색.

## References
- `src/managers/PhotoPostManager.ts`
- `src/panels/layered/PhotoPostComposerLayeredPanel/`
- `src/panels/layered/PhotoCardEditorLayeredPanel/`
- `src/panels/layered/ImageDetailLayeredPanel/`

## Current Status
- 구현, 정적 검증 및 프로덕션 빌드 완료.
