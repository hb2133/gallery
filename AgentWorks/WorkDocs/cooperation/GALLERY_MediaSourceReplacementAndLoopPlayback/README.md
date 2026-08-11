# 영상 소스 교체와 상세 반복 재생

## Summary
- 영상 게시글 편집에서 업로드 파일과 YouTube 링크를 교체할 수 있게 한다.
- 상세 팝업 영상을 자동 반복하고 일시정지 시 현재 프레임을 유지한다.

## Background
- 현재 편집은 제목, 내용, 스튜디오만 수정하며 상세 업로드 영상에는 loop와 autoplay 보장용 muted가 없다.
- 일시정지 상태의 재생 버튼 배경이 플레이어 전체를 검게 덮는다.

## Scope
- 편집 팝업의 업로드/YouTube 소스 선택과 교체
- 교체 성공 후 이전 업로드 파일 정리와 실패 시 새 업로드 롤백
- 업로드 및 YouTube 상세 영상 자동 반복
- pause 상태에서 현재 영상 프레임 유지
- 사진 상세 첫 탐색 전에 등록 이미지를 미리 로드·디코딩해 검은 빈 프레임 방지
- 모든 게시판의 ARCHIVE INDEX 연도를 게시글 날짜에서 자동 계산
- 전 페이지 공통 커서와 즉시 hover 문구, 영상 테스트 게시글 총 27개

## References
- `MediaPostComposerLayeredPanel`
- `MediaPostActions`
- `MediaVideoDetailLayeredPanel`

## Current Status
- 구현과 검증 완료
