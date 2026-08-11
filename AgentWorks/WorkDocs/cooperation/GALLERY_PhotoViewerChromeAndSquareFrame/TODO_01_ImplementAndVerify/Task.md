# Task

## Context
- 사진 보기 방식 사이의 컨트롤 위치와 프레임 크기를 일관되게 만든다.

## Current Understanding
- 조건부 unmount와 보기별 CSS override가 전환 및 위치 차이의 원인이었다.

## Observed Issues
- 흰 사진에서는 고정 흰색 화살표의 대비가 사라졌다.

## Decision Notes
- DOM을 유지한 CSS 전환과 `mix-blend-mode: difference`를 사용했다.

## Initial Render Harness
- 해당 없음. 새 저장값 없이 기존 상세 보기 상태만 사용한다.

## Implementation Notes
- 목차를 opacity/translate로 부드럽게 열고 닫는다.
- 보기/닫기 버튼 좌표를 통일하고 가로 스크롤 프레임을 정사각형으로 제한했다.
- 화살표는 사진 밝기에 반전되는 대비 모드를 사용한다.

## Result
- TypeScript, ESLint, production build 통과.

## History Index
- 아직 분리된 이력이 없다.
