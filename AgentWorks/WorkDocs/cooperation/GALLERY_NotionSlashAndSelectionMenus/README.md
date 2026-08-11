# Notion Slash And Selection Menus

## Summary
- 긴글 편집기에 Notion형 슬래시 블록 메뉴와 선택 텍스트 플로팅 서식 바를 추가한다.

## Background
- 기존 편집기는 상단 도구 모음까지 이동해야 하며 입력 위치에서 블록 종류를 바로 바꿀 수 없었다.

## Scope
- `/` 입력 위치 슬래시 메뉴
- 본문, 제목 1~3, 목록, 인용, 코드 블록 전환
- 텍스트 드래그 선택 위치 플로팅 서식 바
- 굵게, 기울기, 밑줄, 취소선, 색상, 링크 적용

## References
- 사용자 제공 Notion 링크
- Notion 공식 `Keyboard shortcuts`, `Style & customize your page`
- `src/panels/base/WritingBasePanel/`

## Current Status
- 구현과 전체 정적 검증 완료.
