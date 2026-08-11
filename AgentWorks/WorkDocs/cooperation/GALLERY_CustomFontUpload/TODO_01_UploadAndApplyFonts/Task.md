# Task

## Context
- 원하는 폰트 파일을 홈페이지에 업로드해 모든 방문자에게 같은 폰트로 표시해야 한다.

## Current Understanding
- 폰트 파일은 공개 Storage에 저장하고 스타일 JSON에는 생성된 family와 공개 URL을 기록한다.
- HeroSection은 신뢰 가능한 업로드 family와 HTTPS URL만 @font-face로 생성한다.

## Observed Issues
- 로컬 font-family 이름만으로는 방문자 환경의 폰트 존재를 보장할 수 없다.

## Decision Notes
- 최대 10MB의 WOFF2, WOFF, TTF, OTF를 지원한다.
- 기존 직접 font-family 입력도 유지하며 직접 입력하면 업로드 URL 연결을 해제한다.

## Fix Notes
- start-page-fonts 공개 버킷과 관리자 전용 쓰기 정책을 추가했다.
- 타이포그래피 컨트롤마다 폰트 업로드 입력과 상태 안내를 추가했다.
- 업로드 결과는 고유 GalleryFont family와 FontUrl로 스타일 설정에 저장된다.
- HeroSection이 중복 URL을 제거한 동적 @font-face를 서버 렌더링한다.

## Result
- 업로드 폰트를 바깥·중앙·목적지 글자에 각각 적용하고 새로고침 후 유지할 수 있다.
- ESLint, TypeScript 검사와 Next.js 프로덕션 빌드가 통과했다.

## History Index
- 아직 분리된 이력이 없다.
