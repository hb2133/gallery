# 저장 설정 초기 렌더링 하네스 규칙

## Summary
- 모든 저장형 기능이 첫 HTML부터 실제 설정을 사용하도록 하네스 엔지니어링 규칙을 추가했다.

## Background
- 링크, 테마, 한마디, 사진 설정에서 정적 기본값이 먼저 보인 뒤 저장값으로 교체되는 회귀가 반복됐다.

## Scope
- 구현 전 초기 상태 설계
- 금지 패턴
- 실제 비기본 저장값 기반 서버 HTML 검증
- 아키텍처와 리뷰 P0 기준 연결

## References
- `AgentWorks/docs/project-rules/platform/HARNESS_ENGINEERING_INITIAL_RENDER_NEXTJS_V1.md`
- `AGENTS.md`
- `AgentWorks/docs/project-rules/architecture/ARCHITECTURE_RULES_PANEL_SECTION_NODEJS_NEXTJS_V1.md`
- `AgentWorks/docs/project-rules/review/REVIEW_SCORING_GUIDE_PANEL_SECTION_NODEJS_NEXTJS_V1.md`
- `AgentWorks/WorkDocs/templates/todo/Checklist.md`
- `AgentWorks/WorkDocs/templates/todo/Task.md`

## Current Status
- 고정 규칙, 필수 읽기 순서와 리뷰 기준 반영을 완료했다.
