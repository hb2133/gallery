# Task

## Context
- 관리자 로그인 후 나타나는 `ADMIN` 버튼을 톱니 아이콘으로 교체하고 페이지별 설정 팝업을 연다.

## Current Understanding
- 톱니 아이콘 노출 여부는 공통 `AdminBrand`가 인증 상태와 페이지별 open callback 유무를 함께 확인한다.
- 각 팝업의 open/close 상태는 해당 BasePanel Controller가 소유한다.
- 팝업은 route가 아니라 현재 BasePanel의 layered stack에 렌더링한다.

## Observed Issues
- 시작 페이지의 실제 Panel 이름은 `GalleryBasePanel`, 사진 페이지는 `GalleryIndexBasePanel`이다.
- 다른 아카이브 페이지도 공통 `AdminBrand`를 사용하므로 callback이 없는 페이지에서는 톱니를 숨겨야 한다.

## Decision Notes
- 공용 LayeredPanel에 `start | photo` payload를 전달해 공통 modal lifecycle과 페이지별 내용을 분리한다.
- 현재 TODO는 페이지별 팝업 진입과 항목 구분까지 포함하고 세부 입력·Supabase 저장은 후속 범위로 남긴다.

## Implementation Notes
- 로그인 상태와 callback이 모두 있을 때만 28px 정사각형 톱니 버튼을 표시한다.
- 시작 페이지는 하루 문구, 장르 라벨, 메뉴 연결 항목을 표시한다.
- 사진 페이지는 페이지 소개, 사진 슬롯, 상세 보기 항목을 표시한다.
- Escape, backdrop, Close, 닫기 버튼으로 패널을 해제하고 열린 동안 body scroll을 잠근다.
- 모바일에서는 bottom-sheet 형태로 전환한다.

## Result
- ESLint, TypeScript 검사와 Next.js 프로덕션 빌드가 통과했다.
- 시작·사진 Controller에 서로 다른 `Kind`의 커스텀 패널이 연결됐다.
- 다른 페이지는 callback을 전달하지 않으므로 로그인 상태에서도 톱니 버튼을 렌더링하지 않는다.

## History Index
- 아직 분리된 이력이 없다.
