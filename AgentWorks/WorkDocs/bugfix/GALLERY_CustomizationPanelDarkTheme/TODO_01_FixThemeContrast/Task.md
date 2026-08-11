# Task

## Bug Context
- Dark 모드에서 커스텀 팝업 배경과 글씨가 모두 흰색에 가깝게 표시됐다.

## Current Understanding
- 팝업 배경이 `--surface`, 글자가 `--ink`를 사용한다.
- 시작 페이지의 로컬 Dark 토큰은 두 값 모두 `#f5f5f2`여서 대비가 사라진다.

## Observed Issues
- 전역 Dark 토큰의 `--surface`는 어둡지만 시작 페이지가 로컬에서 밝은 값으로 덮어쓴다.

## Decision Notes
- 팝업은 현재 페이지 배경과 동일한 `--canvas`를 사용하고 글자는 `--ink`를 유지해 테마별 반전을 보장한다.

## Fix Notes
- Panel background를 `var(--surface)`에서 `var(--canvas)`로 변경했다.
- 배경과 글자색 transition을 추가했다.

## Result
- Light 모드는 밝은 canvas와 어두운 ink, Dark 모드는 어두운 canvas와 밝은 ink 조합을 사용한다.
- ESLint, TypeScript 검사와 Next.js 프로덕션 빌드가 통과했다.

## History Index
- 아직 분리된 이력이 없다.
