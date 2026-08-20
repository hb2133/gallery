# Writing 본문 밀도 및 보기 도구 정리

## Summary
- Writing 본문 제목·내용 간격과 읽기 밀도를 조정하고 중복 보기 방식 버튼을 제거한다.

## Background
- 제목 아래 여백이 중복 CSS로 최종 `3em` 적용되고 기본 본문은 18px·1.85 행간이라 한 페이지에 보이는 줄 수가 적었다.
- 팝업 외부 1·2 보기 버튼과 본문 툴바의 보기 메뉴가 기능상 중복됐다.

## Scope
- 제목·본문 간격 축소
- 한 페이지 약 20줄 기준의 기본 본문 밀도 적용
- 전체화면 왼쪽 내부 보기 방식 버튼과 전용 코드 제거

## References
- `src/panels/base/WritingBasePanel/`
- `src/managers/WritingReaderPreferenceManager.ts`

## Current Status
- 구현과 테스트·정적 검증 완료
