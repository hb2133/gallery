# Task

## Context
- 짧은 글 게시판을 Eric Cole Framer 템플릿과 같은 흐름의 타이포그래피 중심 단일 페이지로 교체한다.

## Current Understanding
- 레퍼런스의 핵심은 흰색/검정 섹션 대비, 화면을 채우는 제목, 선택 목록과 큰 미디어, 표 형식 콘텐츠, 소개와 문의 폼이다.
- 외부 인물·프로젝트 내용 대신 현재 메모 데이터와 기능을 같은 구조에 매핑한다.

## Observed Issues
- 기존 장기 실행 개발 서버의 파일 감시가 멈춰 재시작 전까지 이전 화면을 반환했다.
- 영어 표시 폰트를 지정한 큰 한글 문구는 headless Chromium에서 대체 글리프가 필요했다.

## Decision Notes
- 기존 책 UI를 안에 끼우지 않고 완전히 제거해 레퍼런스의 스크롤 흐름을 유지한다.
- 템플릿 이미지를 복제하지 않고 프로젝트의 기존 이미지와 메모 내용을 사용한다.
- 새 의존성 없이 React, Next Image, CSS만 사용한다.

## Initial Render Harness
- 저장 기능 변경이 아니므로 해당 없음. 기존 `InitialMemoPages`가 서버/클라이언트 첫 화면의 동일 입력이다.

## Implementation Notes
- `MemoBookSection`과 1,500줄 규모의 책넘김 전용 CSS를 제거했다.
- `MemoArchiveSection`에서 Hero, Selected Notes, Approach, Archive, About, Compose, Footer를 조립한다.
- 목록 표시 모드를 Controller 상태로 추가하고 전체 목록 페이지네이션과 편집 입력을 기존 Controller에 연결했다.
- 모든 신규 표시 문자열을 `ArchiveStrings.Memo`에 배치했다.

## Result
- 소스 TypeScript, 변경 파일 ESLint, diff check 통과.
- 데스크톱과 모바일 가로 오버플로 0 확인.
- 두 번째 메모 선택, 목록 보기 전환, 14번째 새 메모 추가, 제목 입력 갱신 확인.
- 최종 데스크톱·모바일 캡처에서 한글 표시와 반응형 배치를 재확인했다.

## History Index
- 아직 분리된 이력이 없다.
