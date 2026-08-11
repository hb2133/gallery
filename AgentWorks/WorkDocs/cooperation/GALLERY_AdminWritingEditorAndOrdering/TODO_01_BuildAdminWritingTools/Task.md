# Task

## Context
- 관리자 로그인 상태에서 긴글을 직접 운영할 카테고리, 순서 변경, 리치 편집 기능이 필요하다.

## Current Understanding
- 정적 글은 유지하되 동일 ID의 저장 글로 덮어쓰면 기존 콘텐츠를 안전하게 편집할 수 있다.
- 공개 설정과 공개 글은 서버 초기 상태에서 함께 읽어 첫 HTML과 hydration의 값을 맞춘다.

## Observed Issues
- 본문 입력마다 React state를 갱신하면 contentEditable 커서가 이동할 수 있어 저장 시 DOM HTML을 읽도록 했다.
- 개발 서버와 프로덕션 빌드가 `.next`를 동시에 사용해 생성 타입 파일이 깨졌으며, 생성 캐시를 분리한 뒤 재검증했다.

## Decision Notes
- 별도 편집기 의존성 없이 브라우저 기본 편집 명령과 서버 저장 전 HTML 정화를 사용한다.
- 업로드는 공개 Storage 버킷에 저장하되 관리자 JWT만 쓰기를 허용한다.
- 목록을 접었을 때 양쪽 30px 열을 두고 보기 설정을 Reader 위 팝오버로 배치한다.

## Initial Render Harness
- SSOT는 `writing_page_settings`, `writing_posts`이며 `LoadInitialAppState`가 서버에서 병렬 조회한다.
- Controller 최초 state는 `InitialAppState`의 카테고리, 순서, 글로 생성하고 브라우저 조회는 최신 상태 동기화에만 사용한다.
- 원격 DB에 임시 비기본 카테고리·글·순서를 저장해 `/writing` 첫 HTML에서 카테고리, 제목, 본문 식별자를 모두 확인한 뒤 원래 설정으로 복원했다.

## Implementation Notes
- 관리자 카테고리 추가·삭제와 드래그 앤 드롭 순서 저장을 구현했다.
- 실행 취소·다시 실행, 제목 1~3·본문, 굵게·기울기·밑줄·취소선·색상·인용·글머리·번호 서식을 제공한다.
- 이미지·파일 업로드와 링크·코드 삽입, 공개·비공개 저장을 구현했다.
- 허용 태그·속성·색상만 남기는 HTML 정화와 관리자 RLS를 적용했다.

## Result
- 원격 migration 목록 일치, 공개 읽기 HTTP 200, 익명 쓰기 HTTP 401을 확인했다.
- `npx tsc --noEmit`, 전체 ESLint, 프로덕션 build가 통과했다.

## History Index
- 아직 분리된 이력이 없다.
