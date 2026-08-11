# Task

## Bug Context
- 카테고리명 입력 첫 글자에서 입력 포커스가 Close 버튼으로 이동했다.
- 카테고리 편집창이 시작 설정의 최상위 화면이라 다른 설정을 추가하기 어려웠다.

## Current Understanding
- Controller의 `OnRequestClose` 함수 identity가 입력마다 바뀌었다.
- 편집창 effect가 callback을 dependency로 사용하면서 매 렌더마다 Close 버튼에 focus를 다시 지정했다.

## Observed Issues
- controlled input의 `onChange`가 draft 상태를 갱신해 Panel 전체가 재렌더링된다.

## Decision Notes
- 최신 callback과 busy 상태는 ref로 갱신하고 focus/body lock/keydown effect는 mount 1회만 실행한다.
- 최초 focus 대상은 Close가 아니라 첫 번째 카테고리명 입력칸으로 변경한다.
- 시작 설정 상태는 `menu | categories | null`로 구분한다.

## Fix Notes
- 입력 중 재실행되지 않는 mount-only focus effect를 적용했다.
- 상위 설정 화면에 `카테고리 설정` 버튼 카드와 설명을 추가했다.
- 버튼 선택 시 기존 카테고리 편집창을 열고 `설정 목록` 버튼으로 상위 메뉴에 복귀한다.
- 상위 option 구조는 향후 같은 형식의 설정 버튼을 추가할 수 있다.

## Result
- 입력 상태 갱신이 focus effect dependency에서 분리됐다.
- 톱니 → 설정 목록 → 카테고리 설정 → 편집창의 2단 흐름이 구성됐다.
- ESLint 경고 0, TypeScript 검사와 Next.js 프로덕션 빌드가 통과했다.

## History Index
- 아직 분리된 이력이 없다.
