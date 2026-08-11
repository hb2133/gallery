# 사진 게시판 제목 스타일 설정

## Summary
- 사진 게시판 설정 목록에 `상단 제목` 항목을 추가했다.
- 제목과 오른쪽 소개 문구의 문구·폰트·크기·색상·웹폰트를 관리자가 변경할 수 있다.

## Background
- 사진 게시판의 상단 문구가 코드에 고정되어 있었고, 저장형 설정은 첫 렌더링에서 기본값 노출 없이 적용해야 한다.

## Scope
- `photo_page_settings`에 제목과 소개 문구 스타일을 저장한다.
- 공개 Storage 웹폰트를 업로드하고 방문자 화면에서 `@font-face`로 적용한다.
- 설정 목록과 전용 편집 패널을 연결한다.
- 숫자 크기 입력을 자유 입력 후 blur 보정 방식으로 처리한다.

## References
- `src/managers/PhotoPageCategoryManager.ts`
- `src/managers/InitialAppStateManager.ts`
- `src/panels/base/GalleryIndexBasePanel/`
- `src/panels/layered/PhotoPageCustomizationLayeredPanel/`
- `supabase/migrations/20260730133000_photo_page_heading.sql`
- `supabase/migrations/20260730140000_photo_page_description.sql`
- `AgentWorks/docs/project-rules/platform/HARNESS_ENGINEERING_INITIAL_RENDER_NEXTJS_V1.md`

## Current Status
- 구현 및 원격 DB 마이그레이션 완료.
- TypeScript, ESLint, Next.js production build 통과.
- `/gallery` 첫 HTML에서 Supabase 저장 제목·소개 문구·스타일을 확인했다.
