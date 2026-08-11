# Task

## Context
- 사진 게시판 상단 제목과 오른쪽 소개 문구를 관리자가 직접 변경할 수 있어야 한다.
- 설정 UI는 시작 페이지처럼 목록에서 항목을 선택해 진입해야 한다.

## Current Understanding
- 설정값의 SSOT는 Supabase `photo_page_settings`이다.
- 업로드 폰트는 기존 공개 `start-page-fonts` Storage를 함께 사용한다.
- 방문자에게 동일한 폰트를 보이려면 저장된 URL로 `@font-face`를 생성해야 한다.

## Observed Issues
- 제어형 숫자 입력을 입력 순간 최소값으로 보정하면 여러 자리 숫자를 정상 입력하기 어렵다.

## Decision Notes
- 사진 설정 목록에는 현재 실제 동작하는 `상단 제목` 항목만 노출한다.
- Preview와 테마 기본색 복원 버튼은 요청에 따라 제거했다.
- 크기는 입력 중 보정하지 않고 blur 시 허용 범위로 보정한다.

## Initial Render Harness
- `InitialAppStateManager`가 제목·소개 문구와 스타일을 서버에서 함께 조회한다.
- `InitialAppStateProvider`의 값으로 컨트롤러 state를 초기화해 서버 HTML과 hydration 첫 프레임이 같다.
- 실제 production server의 `/gallery` 첫 HTML에서 원격 저장값 `What have we collected?`, 제목 크기 `64`, 소개 문구 `개인적인 장면과 작업을 한곳에 모은 사진 리스트`를 확인했다.

## Implementation Notes
- 제목과 소개 문구에 문구·font-family·크기·색상·FontUrl 모델을 적용했다.
- 관리자 전용 웹폰트 업로드와 공개 URL 적용을 연결했다.
- 설정 목록 → 상단 제목 → 저장 흐름과 목록 복귀를 구현했다.
- Supabase 마이그레이션 `20260730133000`, `20260730140000`을 원격에 반영했다.

## Result
- `npx tsc --noEmit` 통과.
- `npm run lint` 통과.
- `npm run build` 통과.
- production `/gallery` 첫 HTML 저장값 노출 확인.

## History Index
- R01 구현 완료 리뷰.
