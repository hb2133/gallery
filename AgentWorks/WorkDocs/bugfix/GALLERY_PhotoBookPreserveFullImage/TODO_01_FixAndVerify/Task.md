# Task

## Bug Context
- 책넘김 스타일에서 사과 이미지처럼 페이지와 비율이 다른 사진의 양끝이 잘린다.

## Current Understanding
- 책 페이지 이미지의 `object-fit: cover`가 사진을 확대하고 프레임 밖 영역을 자른다.

## Observed Issues
- 기존 종이 배경은 불투명하므로 `contain` 여백도 안정적으로 표시할 수 있다.

## Decision Notes
- 페이지를 가득 채우는 것보다 원본 전체 보존을 우선한다.

## Initial Render Harness
- 저장 기능 변경이 아니므로 해당 없음.

## Fix Notes
- 책 이미지 맞춤을 `cover`에서 `contain`으로 변경한다.

## Result
- 책넘김 이미지는 원본 비율을 유지하며 전체 영역을 표시한다.
- 소스 TypeScript 검사와 `/gallery` HTTP 200 응답을 확인했다.
- 전체 ESLint와 Webpack build는 이번 변경과 무관한 기존 React effect 및 전역 CSS selector 오류로 중단됐다.

## History Index
- 아직 분리된 이력이 없다.
