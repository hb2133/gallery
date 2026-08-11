# Task

## Context
- Reference 폴더의 장르별 Select PDF에 맞춰 첫 페이지 선택 상태의 사각형과 글자 위치를 수정한다.

## Current Understanding
- 장르 문구는 `architecture=로맨스`, `journal=SF`, `portraits=스릴러`, `journeys=다큐`로 연결된다.
- 선택 글자는 고정 중앙 칸에 표시되고 네 목적지 타일만 상태별 좌표로 이동한다.

## Observed Issues
- SF의 가로 5칸 패턴은 이미 가이드와 같았으나 로맨스, 스릴러, 다큐 패턴은 PDF와 달랐다.

## Decision Notes
- 5×5 논리 그리드와 중앙 칸은 유지하고 각 상태의 네 타일 transform만 조정한다.
- 목적지 연결과 hover 글자 노출 동작은 변경하지 않는다.

## Implementation Notes
- 로맨스는 중앙 상·하·좌·우의 십자형으로 배치했다.
- SF는 사진·영상·중앙·긴 글·메모의 가로 5칸을 유지했다.
- 스릴러는 영상·중앙·긴 글·메모의 가로축과 중앙 아래 사진으로 배치했다.
- 다큐는 중앙을 비우고 네 대각선에 사진·영상·긴 글·메모를 배치했다.
- SF 가로 배열의 왼쪽 두 칸은 PDF 번호 순서대로 사진, 영상·음악이 오도록 교정했다.

## Result
- 장르별 목적지 타일의 논리 좌표를 개별 Select PDF와 대조했다.
- 프로덕션 빌드 통과
- 메인 페이지 HTTP 200 확인

## History Index
- 아직 분리된 이력이 없다.
