# Task

## Context
- 원하는 폰트를 직접 입력하고 카테고리 바깥·중앙 스타일을 따로 관리해야 한다.
- 크기 필드를 비울 때 8이 즉시 입력되는 문제와 목적지 설정 배치를 개선해야 한다.

## Current Understanding
- 폰트 enum 제한을 안전한 CSS font-family 문자열로 확장한다.
- 숫자 필드는 편집 중 빈 값을 허용하고 blur·저장 시 범위를 보정한다.
- 목적지 글자 설정은 별도 하단 섹션으로 분리한다.

## Observed Issues
- `Number('') || 8` 로직이 사용자가 숫자를 지우는 순간 8을 상태에 저장했다.

## Decision Notes
- 기존 sans·korean·mono·serif 별칭은 유지하며 임의 font-family도 허용한다.
- 웹에 로드되지 않은 폰트는 방문자 환경에 없을 수 있으므로 CSS fallback 문자열도 입력 가능하게 한다.

## Fix Notes
- TypographyControls를 공통화하고 폰트 이름 입력에 추천 datalist를 연결했다.
- 크기 입력은 uncontrolled 편집값을 사용해 빈칸을 허용하고 blur 시 8~64로 보정한다.
- 저장 시 모든 글자 크기와 빈 font-family를 다시 정규화한다.
- CategoryCenterTextStyles를 추가해 중앙 글자를 바깥 글자와 분리했다.
- 게시판 이동 글자 네 항목을 카테고리 카드 아래 별도 섹션으로 이동했다.

## Result
- 바깥·중앙·목적지 글자마다 텍스트 스타일을 독립 저장할 수 있다.
- 로컬·원격 Supabase migration 이력이 일치한다.
- ESLint, TypeScript 검사와 Next.js 프로덕션 빌드가 통과했다.

## History Index
- 아직 분리된 이력이 없다.
