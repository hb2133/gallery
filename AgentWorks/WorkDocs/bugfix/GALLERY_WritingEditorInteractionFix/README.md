# 긴글 편집기 스타일 메뉴 및 줄바꿈 수정

## Summary
- 긴글 편집기의 슬래시 메뉴와 텍스트 선택 서식 메뉴가 실제 선택 범위를 안정적으로 사용하도록 수정했다.
- Shift+Enter는 같은 문단 안의 줄바꿈, Enter는 여백이 있는 새 문단으로 분리했다.

## Background
- contentEditable 입력 직후와 포인터 선택 직후에 메뉴 상태가 서로 다른 시점의 Selection을 읽고 있었다.
- 서식 명령은 브라우저별 formatBlock 값 차이를 고려하지 않았고 줄바꿈 동작도 브라우저 기본값에 의존했다.

## Scope
- 편집기 선택·캐럿 메뉴 갱신, 서식 명령 호환 처리, 문단/소프트 줄바꿈, 편집 화면 문단 간격.

## References
- `src/panels/base/WritingBasePanel/sections/WritingArchiveSection/WritingArchiveSection.tsx`
- `src/panels/base/WritingBasePanel/controller/WritingBasePanelController.ts`
- `src/panels/base/WritingBasePanel/WritingBasePanel.module.css`

## Current Status
- 구현과 타입 검사, 전체 린트, 프로덕션 빌드, 개발 서버 응답 검증을 완료했다.
