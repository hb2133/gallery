# Archive Gallery

`Reference_1`의 방향형 탐색 구조와 Vercel 스타일의 미니멀 UI를 결합한
반응형 사진 포트폴리오다. Instagram, 블로그, 개인 갤러리의 허브로 사용할 수
있도록 구성했다.

## 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 연다.

## 페이지

- 메인 인터랙션: `/`
- 작품 갤러리: `/gallery`
- 커뮤니티 포스트: `/community`

## 검증

```bash
npm run lint
npm run build
```

## 콘텐츠 수정

- 작품 데이터: `src/panels/base/GalleryBasePanel/controller/GalleryBasePanelState.ts`
- 정적 사진: `public/images/`
- 저널 목록: `src/panels/base/GalleryBasePanel/sections/JournalSection/JournalSection.tsx`
- Instagram 및 이메일 링크: Header, Journal, Footer Section
- 전역 디자인 토큰: `src/design/GlobalDesign.global.tsx`

현재 포함된 사진은 데모용 Unsplash 자산이며, 실제 운영 전 작품 사진과
Instagram 주소, 이메일 주소를 교체한다.
