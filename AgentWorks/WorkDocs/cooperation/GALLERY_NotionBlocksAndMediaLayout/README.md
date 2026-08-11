# Notion Blocks And Media Layout

## Summary
- 긴글 편집기에 Notion형 구분선, 입력 목록 변환, 중첩 목록, 미디어 나란히 배치와 정렬을 추가한다.

## Background
- 기존 편집기는 목록과 미디어 업로드를 지원하지만 입력 단축 변환과 중첩 목록, 미디어별 정렬을 지원하지 않는다.

## Scope
- `---` 입력 및 `/구분선` 명령
- `1. ` 번호 목록과 `- ` 글머리 목록 자동 변환
- 목록에서 Tab/Shift+Tab 들여쓰기와 번호 하위 목록 영문자 표기
- 크기를 줄인 연속 미디어의 가로 배치
- 선택한 이미지·영상의 왼쪽·가운데·오른쪽 정렬

## References
- `src/panels/base/WritingBasePanel/`
- `src/managers/WritingPostManager.ts`

## Current Status
- 구현과 자동 검증을 완료했고 브라우저 상호작용 및 비기본 정렬값 새로고침 확인이 남았다.
