# Task

## Context
- 사진 새 게시글 작성창에 제한 공개 항목이 없고, 페이지 순서 편집의 이미지 준비 상태가 충분히 드러나지 않았다.

## Current Understanding
- 새 글 입력에 비밀번호를 포함하고 기존 관리자 비밀번호 RPC로 저장한다.
- 이미지마다 load/decode 완료 상태를 추적해 준비되는 순서대로 표시한다.

## Observed Issues
- 기존 로딩 UI는 모든 이미지가 완료될 때까지 목록 전체를 숨겨 진행 상황을 알 수 없었다.

## Decision Notes
- 로딩 오버레이는 유지하되 반투명하게 만들어 뒤쪽 썸네일의 순차 표시와 완료 수를 함께 보여준다.

## Initial Render Harness
- 제한 공개 SSOT는 기존 `photo_post_access`와 `photo_card_customizations.is_password_protected`이며 `set_photo_post_password` RPC를 재사용한다.
- 새 글 작성 오버레이 상태이므로 서버 첫 HTML의 저장값 교체 문제는 발생하지 않는다.

## Fix Notes
- 공개 게시글에 제한 공개 비밀번호 입력과 보기/숨기기 버튼을 추가했다.
- 비밀번호를 4~72자로 검증하고 생성 후 기존 비밀번호 RPC로 해시·관리자 확인 값을 저장한다.
- 로딩 오버레이 뒤에서 준비된 썸네일을 흐림 해제 애니메이션으로 순차 표시하고 완료 수를 갱신한다.

## Result
- lint와 production build를 통과했다.

## History Index
- 아직 분리된 이력이 없다.
