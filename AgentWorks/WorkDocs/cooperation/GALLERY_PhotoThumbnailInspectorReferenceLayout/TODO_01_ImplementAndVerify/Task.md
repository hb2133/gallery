# Task

## Context
- 썸네일 편집 우측 설정의 순서와 업로드 UI를 제공된 레퍼런스에 맞춰야 했다.

## Current Understanding
- 기존 상태와 저장 이벤트를 유지하면서 Inspector 내부의 표현 순서만 재배치하면 된다.

## Observed Issues
- 추가 차단 문제 없음.

## Decision Notes
- 별도 업로더를 만들지 않고 기존 file input을 썸네일 요약 영역으로 이동해 동일한 미리보기 상태를 사용했다.

## Initial Render Harness
- 저장 구조와 초기 상태를 변경하지 않아 해당 없음. 기존 서버 초기 customization의 썸네일·카테고리·공개 상태를 그대로 사용한다.

## Implementation Notes
- Inspector를 썸네일·카테고리·공개 상태·텍스트 순으로 구성했다. 썸네일에 허용 확장자 안내, 업로드 버튼, A5 비율 현재 이미지 미리보기를 추가했다. 비밀번호 입력에는 접근 가능한 보기·숨기기 눈 아이콘을 추가했다.

## Result
- `npm run lint`와 `npm run build` 통과.

## History Index
- 아직 분리된 이력이 없다.
