# Task

## Context
- 카테고리 바깥 이름과 각 카테고리에 포함된 게시판 이동 글자의 내용과 스타일을 관리자가 변경해야 한다.

## Current Understanding
- 카테고리별로 두 개의 독립 텍스트 스타일을 시작 페이지 설정에 저장한다.
- 글꼴은 프로젝트에 포함된 폰트와 안전한 시스템 세리프 선택지로 제한한다.

## Observed Issues
- 목적지 글자는 HeroSection 내부 상수라 저장 구조와 연결되지 않았다.

## Decision Notes
- 스타일은 카테고리 키별 Font, Size, Color 객체로 저장한다.
- 크기는 8~64px, 색상은 6자리 hex, 폰트는 sans·korean·mono·serif로 정규화한다.

## Fix Notes
- 각 카테고리 카드에 카테고리 이름과 게시판 이동 글자 입력을 배치했다.
- 두 글자 종류마다 폰트 선택, 숫자 크기, 컬러 피커를 독립 제공한다.
- 선택 스타일은 바깥 WordButton, 중앙 선택 글자와 전개 후 BoxDestination에 적용된다.
- 브라우저 캐시, 브라우저·서버 Supabase 로더와 관리자 저장 payload를 확장했다.
- Supabase에 category_text_styles, destination_labels, destination_text_styles를 추가했다.

## Result
- 네 카테고리마다 두 글자 종류를 독립 설정하고 새로고침 후에도 유지할 수 있다.
- 로컬·원격 migration 이력이 일치한다.
- ESLint, TypeScript 검사와 Next.js 프로덕션 빌드가 통과했다.

## History Index
- 아직 분리된 이력이 없다.
