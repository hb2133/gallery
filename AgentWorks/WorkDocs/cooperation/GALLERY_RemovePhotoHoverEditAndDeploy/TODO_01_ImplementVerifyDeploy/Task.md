# Task

## Context
- 사진 게시물은 관리 모드에서 편집할 수 있으므로 카드 호버 편집 버튼을 제거한다.

## Current Understanding
- 두 버튼은 같은 `OpenCardEditor` 경로를 사용했다.
- 관리 모드의 편집 버튼만 남기면 기능 손실 없이 중복 UI를 제거할 수 있다.

## Observed Issues
- 추가 이슈 없음.

## Decision Notes
- 컨트롤러나 편집 패널은 변경하지 않고 중복 진입점만 제거했다.

## Initial Render Harness
- 해당 없음. 저장 경로를 변경하지 않는 UI 제거다.

## Implementation Notes
- 호버 편집 버튼 JSX와 `.CardEditButton` CSS를 제거했다.
- 관리 모드의 `CardAdminActions` 편집 버튼은 유지했다.

## Result
- ESLint와 Next.js 프로덕션 빌드가 통과했다.
- Vercel 배포 상태 `Ready`, 프로덕션 별칭의 `/`와 `/gallery` 응답은 HTTP 200이다.

## History Index
- 아직 분리된 이력이 없다.
