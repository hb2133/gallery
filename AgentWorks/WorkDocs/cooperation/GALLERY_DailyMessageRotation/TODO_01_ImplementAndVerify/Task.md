# Task

## Context
- 한마디 설정에 문장 로테이션 시간을 추가한다.

## Current Understanding
- 첫 문장은 SSR에서 결정하고 mount 후에만 설정 간격으로 인덱스를 증가시킨다.

## Observed Issues
- 없음.

## Decision Notes
- 추가 애니메이션 라이브러리 없이 네이티브 `setInterval`만 사용했다.

## Initial Render Harness
- SSOT는 `start_page_settings.daily_message_rotation_seconds`다.
- 비기본값 15초가 프로덕션 서버 첫 HTML의 `DailyMessageRotationSeconds` 필드에 포함됨을 확인했다.

## Fix Notes
- 범위 제한 정규화, 숫자 입력, 저장/로드, 순차 타이머를 추가했다.

## Result
- 상태 테스트, ESLint, Next.js 빌드, Supabase migration, SSR HTML 검증 통과.

## History Index
- 아직 분리된 이력이 없다.
