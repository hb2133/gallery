# Task

## Context
- 카테고리 전개 후 이미지가 흐려 보이고 라이트 테마의 목적지 호버가 과하게 돌출됐다.
- 관리자가 오른쪽 상단 외부 링크의 텍스트와 URL을 설정할 수 있어야 한다.

## Current Understanding
- 합성 이미지의 지속 opacity와 목적지 타일의 검은 배경·확대·그림자가 시각 문제의 원인이었다.
- 링크 설정은 기존 시작 페이지 커스텀 데이터와 함께 Controller, Manager, Supabase에서 관리한다.

## Observed Issues
- 이미지 공개 애니메이션은 1로 끝나지만 기본 opacity가 `.82`라 최종 화면이 다시 흐려졌다.
- 라이트 테마 목적지 호버는 `18%` 검은 배경과 `1.035` 확대를 사용했다.
- 링크는 정적 배열을 직접 렌더링하고 있었다.

## Decision Notes
- 합성 이미지의 전환 애니메이션은 유지하고 최종 opacity만 1로 고정했다.
- 라이트 테마 호버만 흰색 7% 오버레이, 작은 그림자와 `1.008` 확대를 사용한다.
- 다크 테마 호버는 기존 인상을 유지한다.
- 링크 URL은 보안을 위해 빈 값 또는 `http/https` 주소만 저장한다.

## Fix Notes
- `StartPageCustomization`에 `HeaderLink`를 추가하고 캐시 정규화·로드·저장에 연결했다.
- 시작 설정 메뉴에 `링크 변경`을 추가하고 전용 LayeredPanel에서 TEXT와 URL을 편집한다.
- 텍스트·URL 모두 있음: 텍스트와 아이콘 링크를 표시한다.
- URL만 있음: 아이콘 링크만 표시한다.
- 텍스트만 있음: 비활성 버튼으로 표시한다.
- 둘 다 없음: 외부 링크 버튼을 숨긴다.
- 링크 버튼은 고정 너비 없이 내용 길이에 맞춰 늘어난다.
- Supabase `header_link` JSON 필드와 object 제약을 추가했다.

## Result
- 로컬·원격 Supabase 마이그레이션 이력이 모두 일치한다.
- ESLint, TypeScript 검사와 Next.js 프로덕션 빌드가 통과했다.

## History Index
- 아직 분리된 이력이 없다.
