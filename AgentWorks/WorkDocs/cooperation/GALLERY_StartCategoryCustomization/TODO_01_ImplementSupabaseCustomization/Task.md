# Task

## Context
- 시작 페이지 설정창에서 네 카테고리 이름과 선택 이미지를 관리자가 직접 설정해야 한다.
- 선택 이미지는 박스마다 반복되지 않고 전체 박스 배치에 걸친 한 장으로 보여야 한다.

## Current Understanding
- 설정은 모든 방문자에게 동일해야 하므로 Supabase DB와 Storage를 SSOT로 사용한다.
- 이미지 자체는 정사각형 Stage 전체를 채우고 CSS mask로 현재 배치의 다섯 박스 영역만 노출한다.
- 비어 있는 Stage 영역은 이미지가 보이지 않아야 한다.

## Observed Issues
- 기존 구현은 동일 이미지가 네 개의 `BoxTile` 안에서 각각 `object-fit: cover`되어 장면이 반복됐다.
- 중앙 Box에는 이미지가 없어 전체 구성이 한 장으로 이어지지 않았다.

## Decision Notes
- 로컬 저장 대신 Supabase를 사용해 다른 기기와 방문자에게 즉시 같은 설정을 제공한다.
- 원본 이미지 비율과 관계없이 정사각형 Stage에서 `object-fit: cover`로 자른다.
- Stage 이미지 한 장에 다섯 개 사각 mask layer를 합성하고 카테고리별 Box 좌표를 mask 좌표로 사용한다.
- 업로드 파일은 10MB 이하 JPEG, PNG, WebP, GIF로 제한한다.

## Implementation Notes
- `start_page_settings` 테이블과 `start-page-images` 공개 bucket을 생성했다.
- 공개 select, `admin` 역할 전용 insert/update/upload/delete RLS를 적용했다.
- 네 위치별 이름 입력, 정사각형 이미지 미리보기, 이미지 선택과 저장 UI를 추가했다.
- Controller가 공개 설정을 로드하고 draft, 업로드, 저장, 오류 상태를 관리한다.
- Hero가 저장된 이름과 이미지 URL을 사용하고 한 장의 이미지를 현재 Box 구성으로 마스킹한다.

## Result
- 비로그인 공개 조회와 익명 쓰기 차단을 확인했다.
- 실제 관리자 계정으로 설정 update, 이미지 upload, 공개 이미지 HTTP 200을 확인했다.
- 검증용 Storage 파일은 테스트 후 삭제했다.
- ESLint 경고 0, TypeScript 검사와 Next.js 프로덕션 빌드가 통과했다.

## History Index
- 아직 분리된 이력이 없다.
