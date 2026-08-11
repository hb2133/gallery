# Task

## Context
- 사진 게시판에 실제로 등록된 게시물은 모두 2026년인데 상단 범위가 2022—2026으로 보인다.

## Current Understanding
- 계산 입력인 `AllItems`가 Supabase 게시물과 로컬 기본 샘플 카드를 합친 배열이다.

## Observed Issues
- 원격 `photo_posts` 7행의 `created_at`은 모두 2026년이다.

## Decision Notes
- 카드 렌더링 배열은 유지하고 ARCHIVE INDEX만 `PhotoPosts`를 사용한다.

## Initial Render Harness
- SSOT는 서버 초기 조회된 Supabase `photo_posts`이며 기존 InitialAppState를 그대로 사용한다.

## Fix Notes
- 연도 계산 입력을 `AllItems`에서 `PhotoPosts`로 변경했다.

## Result
- 원격 사진 게시물 7개가 모두 2026년임을 확인했다.
- TypeScript, 대상 ESLint와 production build가 통과했다.
- 새 production 서버 첫 HTML에서 `ARCHIVE INDEX · 2026`을 확인했다.

## History Index
- 아직 분리된 이력이 없다.
