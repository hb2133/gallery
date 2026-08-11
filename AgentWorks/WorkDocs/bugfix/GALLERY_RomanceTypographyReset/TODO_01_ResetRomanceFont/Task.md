# Task

## Context
- 시작 페이지의 로맨스 텍스트만 다른 폰트로 보인다.

## Current Understanding
- `category_text_styles.architecture`에만 업로드 폰트가 있고 나머지 세 항목은 `sans`다.
- 선택 후 중앙 텍스트 스타일은 네 카테고리 모두 이미 `sans`로 동일하다.

## Initial Render Harness
- Supabase `start_page_settings`가 SSOT이며 서버 첫 HTML에 직접 반영된다.

## Fix Notes
- 로맨스의 Font와 FontUrl을 다른 카테고리와 같은 `sans`, 빈 URL로 변경했다.
- 크기와 색상은 기존 로맨스 설정을 유지했다.

## Result
- 원격 행과 서버 첫 HTML에서 로맨스가 `sans`를 사용한다.
- 이전 업로드 폰트 식별자가 첫 HTML에 포함되지 않는다.
