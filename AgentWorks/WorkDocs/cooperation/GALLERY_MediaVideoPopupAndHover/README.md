# 영상 호버 재생 버튼과 상세 팝업

## Summary
- 영상 썸네일 호버를 검은 오버레이와 Play 버튼으로 변경한다.
- 클릭 시 영상, 제목, 내용이 함께 표시되는 상세 팝업을 연다.
- YouTube iframe 직접 입력을 차단하고 커스텀 재생 제어를 사용한다.

## Background
- 기존 영상 카드는 호버 시 영상이 확대되고 클릭하면 원본 URL을 새 창으로 열었다.

## Scope
- 카드 호버/포커스 오버레이
- 레퍼런스 기반 영상 상세 LayeredPanel
- 관리자 작성창 내용 필드와 Supabase content 저장
- YouTube 네이티브 재생 UI 비노출

## References
- `Reference/3.영상페이지/02 영상팝업창.PNG`
- `GALLERY_MediaVideoGridAndComposer`

## Current Status
- 구현 및 검증 완료
