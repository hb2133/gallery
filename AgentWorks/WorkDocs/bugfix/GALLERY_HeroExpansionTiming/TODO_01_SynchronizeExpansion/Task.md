# Task

## Bug Context
- 박스 이동과 투명 패널·게시판 이동 글자·검은 잔상의 속도가 달라 따로 움직이는 느낌이 났다.

## Current Understanding
- BoxTile transform은 480ms였지만 합성 이미지 마스크는 최종 위치에 바로 생성되었다.
- 관련 속성은 160~600ms 범위의 별도 전환을 사용했다.

## Observed Issues
- 이미지가 고정된 최종 마스크에 공개되어 사용자가 말한 뒤쪽 이미지 박스의 이동이 보이지 않았다.

## Decision Notes
- 현재 사용 중인 카테고리별 배치 좌표는 변경하지 않는다.
- 이미지 마스크를 초기 십자 위치에서 현재 배치까지 이동시키고 모든 관련 시각 효과를 같은 타임라인으로 맞춘다.

## Fix Notes
- 이미지 마스크 5개가 초기 십자 배치에서 선택한 카테고리의 기존 배치로 이동하는 애니메이션을 추가했다.
- transform, background-color, color, box-shadow, scale과 목적지 opacity를 480ms 동일 easing으로 통일했다.
- 이미지의 별도 확대·페이드는 제거해 이동 후 흐릿하게 남는 느낌을 없앴다.

## Result
- 기존 배치 모양을 유지하면서 이미지 박스, 투명 패널과 게시판 이동 글자가 함께 움직인다.
- ESLint, TypeScript 검사와 프로덕션 빌드가 통과했다.

## History Index
- 아직 분리된 이력이 없다.
