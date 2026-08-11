# 페이지별 관리자 커스텀 팝업

## Summary
- 로그인 후 표시되는 관리자 버튼을 정사각형 톱니 아이콘으로 바꾸고 시작·사진 페이지별 커스텀 팝업을 연결한다.

## Background
- Supabase 관리자 로그인 후 공통 헤더에 `ADMIN` 텍스트 버튼이 표시되고 있었다.
- 페이지별 관리 기능을 분리해서 진입할 수 있는 UI가 필요하다.

## Scope
- `ADMIN` 텍스트 버튼을 정사각형 톱니 아이콘으로 변경
- 시작 페이지 전용 커스텀 LayeredPanel 연결
- 사진 페이지 전용 커스텀 LayeredPanel 연결
- Escape, 배경 클릭, 닫기 버튼 처리와 모바일 레이아웃
- 실제 세부 설정 저장 기능은 후속 항목별 편집 범위에서 연결

## References
- `src/components/AdminBrand/`
- `src/panels/layered/PageCustomizationLayeredPanel/`
- `src/panels/base/GalleryBasePanel/`
- `src/panels/base/GalleryIndexBasePanel/`

## Current Status
- 구현, 정적 검사와 프로덕션 빌드 완료
