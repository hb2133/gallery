# Task

## Context
- 홈페이지에서 제공하던 사용자 폰트 파일 업로드 기능을 전부 제거한다.
- 일반 font-family 입력과 기본 폰트 프리셋은 유지한다.

## Implementation
- 시작 페이지와 사진 페이지 설정창의 폰트 파일 입력·상태 문구를 제거한다.
- Controller의 업로드 상태와 액션, Manager의 Supabase Storage 업로드 함수를 제거한다.
- `FontUrl` 상태 계약과 동적 `@font-face` 생성을 제거한다.
- 저장된 과거 `GalleryFont_*` 값은 기본 폰트로 정규화해 존재하지 않는 폰트 이름이 남지 않게 한다.
- 기존 Supabase 마이그레이션과 원격 저장 파일은 파괴적으로 삭제하지 않는다.

## Initial Render Harness
- 서버와 클라이언트의 공통 normalize 계약에서 업로드 폰트를 동시에 제거해 첫 HTML과 hydration 결과를 일치시킨다.

## Result
- `src/`에서 `FontUrl`, 폰트 업로드 함수·UI·Storage bucket 참조가 모두 제거됐다.
- 서버 첫 HTML에 과거 업로드 폰트 식별자와 URL이 포함되지 않는다.
- TypeScript, ESLint, Next.js production build와 `/`, `/gallery` HTTP 200 검증을 통과했다.
