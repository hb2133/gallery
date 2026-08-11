# 커스텀 팝업 Dark 모드 대비 수정

## Summary
- 커스텀 팝업이 Light/Dark 테마에서 올바른 배경과 글자 대비를 사용하도록 수정한다.

## Background
- 시작 페이지 Dark 모드에서 로컬 `--surface`와 `--ink`가 모두 밝은 색으로 설정되어 팝업 배경과 글자가 겹쳤다.

## Scope
- 커스텀 LayeredPanel 배경 토큰 수정
- Light/Dark 전환 시 배경과 글자색 transition 유지
- 정적 검사와 프로덕션 빌드 검증

## References
- `src/panels/layered/PageCustomizationLayeredPanel/PageCustomizationLayeredPanel.module.css`

## Current Status
- 수정 및 검증 완료
