# 설정창 중복 닫기 액션 정리

## Summary
- 설정창에 중복으로 노출되던 하단 닫기·취소 액션을 제거했다.

## Background
- 설정 목록에는 상단 `Close ×`와 하단 `닫기`가 함께 있었다.
- 카테고리 및 한마디 편집창에는 상단 `Close ×`와 저장 버튼 옆 `취소`가 함께 있었다.

## Scope
- 설정 목록 하단의 `닫기` 제거
- 카테고리 및 한마디 편집창 하단의 `취소` 제거
- 단일 저장 버튼에 맞춘 모바일 푸터 정렬
- 상단 닫기, ESC, 배경 클릭 닫기 동작 유지

## References
- `src/panels/layered/PageCustomizationLayeredPanel/`
- `src/panels/layered/StartPageCustomizationLayeredPanel/`
- `src/panels/layered/StartPageMessageLayeredPanel/`

## Current Status
- 구현 및 정적 검증과 프로덕션 빌드를 완료했다.
