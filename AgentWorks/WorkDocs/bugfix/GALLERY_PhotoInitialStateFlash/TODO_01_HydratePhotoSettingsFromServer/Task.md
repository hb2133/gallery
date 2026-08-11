# Task

## Bug Context
- 새로고침하면 기본 카테고리·이미지·텍스트가 잠깐 표시된 뒤 저장 설정으로 교체됐다.

## Current Understanding
- GalleryIndex Controller의 초기 state가 정적 기본값이고 Supabase 조회는 `useEffect` 이후에만 실행됐다.

## Observed Issues
- 브라우저 네트워크 응답 전까지 첫 paint에 기본 카드 상태가 노출됐다.

## Decision Notes
- CSS로 숨기지 않고 서버가 Supabase 설정을 읽어 기존 InitialAppState에 포함한다.
- 클라이언트 재조회는 초기 렌더링이 아니라 최신 상태 동기화 용도로 유지한다.

## Fix Notes
- InitialAppState에 사진 카테고리와 카드 설정 맵을 추가했다.
- GalleryIndex Controller의 초기 state를 서버 설정으로 생성한다.

## Result
- 실제 저장된 `테스트` 카테고리, 업로드 썸네일 URL과 텍스트 레이어 ID가 첫 `/gallery` HTML에 포함됨을 확인했다.
- TypeScript, ESLint와 Next.js 프로덕션 빌드가 통과했다.

## History Index
- 아직 분리된 이력이 없다.
