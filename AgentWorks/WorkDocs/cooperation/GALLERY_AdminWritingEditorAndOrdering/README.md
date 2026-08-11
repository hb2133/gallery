# Admin Writing Editor And Ordering

## Summary
- 관리자에게 긴글 카테고리·순서·본문 편집 도구를 제공하고 Supabase에 저장한다.

## Background
- 기존 긴글 화면은 정적 글을 읽는 기능만 있어 운영 중 카테고리, 순서, 본문을 변경할 수 없었다.

## Scope
- 카테고리 추가·삭제와 Notion형 드래그 핸들 순서 변경
- 제목·요약·카테고리·공개 상태 및 리치 텍스트 편집
- 이미지·파일 업로드, 링크·코드 삽입과 글 서식 도구
- 서버 초기 상태와 Supabase RLS·Storage 연동
- 목록 접기 시 대칭 여백, 보기 설정 팝오버, `Back` 링크

## References
- `src/panels/base/WritingBasePanel/`
- `src/managers/WritingPageCategoryManager.ts`
- `src/managers/WritingPostManager.ts`
- `supabase/migrations/20260731113000_writing_page_categories.sql`

## Current Status
- 구현, 원격 마이그레이션, 초기 렌더 하네스와 전체 정적 검증 완료.
