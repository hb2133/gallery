# Task

## Bug Context
- 화면은 표시되지만 모든 버튼이 반응하지 않는다.

## Current Understanding
- 브라우저 origin `192.168.0.41`이 Next.js 개발 서버의 허용 origin에 없어 HMR과 클라이언트 리소스가 차단된다.

## Observed Issues
- 서버 로그에 `Blocked cross-origin request to Next.js dev resource` 경고가 반복된다.

## Decision Notes
- 로그에서 확인한 정확한 호스트만 개발 origin으로 허용한다.

## Initial Render Harness
- 저장형 기능이 아니므로 해당 없음.

## Fix Notes
- `next.config.ts`에 `allowedDevOrigins: ["192.168.0.41"]`을 추가했다.

## Result
- 오래된 Next dev lock을 정리하고 개발 서버를 한 번만 재기동했다.
- `Origin: http://192.168.0.41` 조건에서 메인, 사진 페이지와 Next font 리소스가 모두 HTTP 200을 반환한다.
- 서버는 `http://localhost:3000`에서 유지 중이다.

## Result
- 구현 또는 검증 후 최신 결과를 적는다.

## History Index
- 아직 분리된 이력이 없다.
