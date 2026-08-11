# 영상 페이지 설정 메뉴 정리

## Summary
- 영상 페이지 설정을 사진 페이지와 같은 목록형 흐름으로 변경했다.
- 사진 설정 안내의 사용 불가능한 업로드 폰트 문구를 제거했다.

## Background
- 사진 페이지는 설정 목록에서 상단 제목을 선택하는 2단계 흐름이지만 영상 페이지는 편집창을 바로 열고 있었다.

## Scope
- 공통 페이지 설정 메뉴에 media kind를 추가하고 영상 컨트롤러의 설정 뷰 상태를 menu/heading으로 분리했다.

## References
- `src/core/localization/ArchiveStrings.ts`
- `src/panels/layered/PageCustomizationLayeredPanel/`
- `src/panels/base/MediaBasePanel/`

## Current Status
- 구현과 프로덕션 빌드 검증을 완료했다.
