# 개발 네트워크 접속 버튼 비활성 문제 수정

## Summary
- Windows 호스트 주소로 개발 서버에 접속할 때 Next.js 리소스가 차단되어 hydration과 버튼 상호작용이 멈추는 문제를 수정한다.

## Background
- 개발 서버 로그에서 `192.168.0.41` origin의 webpack HMR과 폰트 요청 차단을 확인했다.

## Scope
- Next.js `allowedDevOrigins`에 실제 개발 접속 호스트를 등록한다.
- 서버 재시작 후 네트워크 origin 리소스 요청과 페이지 응답을 확인한다.

## References
- `next.config.ts`

## Current Status
- 수정 및 개발 서버 재기동 완료.
