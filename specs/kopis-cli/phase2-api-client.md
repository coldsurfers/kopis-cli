# Phase 2: KOPIS API 클라이언트

## 목표

KOPIS OpenAPI XML 응답을 TypeScript 타입으로 다루는 fetch + fast-xml-parser 파이프라인을 만든다.

## 현재 문제

KOPIS API는 XML 응답만 제공하며, 필드명이 약어(mt20id, prfnm 등)라 그대로 쓰면 가독성이 낮다.
기존 surfers-root의 sync-kopis는 Deno 환경 + Supabase 종속 코드라 CLI에서 재사용 불가.

## 목표 구조

```
packages/kopis-cli/src/kopis/
├── types.ts    # KopisPerformance, KopisPerformanceDetail
└── client.ts   # createKopisClient (fetch + XMLParser)
```

## 레이어 설명

- **types.ts**: 파싱 후 최종 타입. XML 약어 대신 읽기 좋은 camelCase 필드명 사용.
- **client.ts**: KOPIS API fetch + XML 파싱 + 필드 매핑을 캡슐화한 팩토리 함수.

## 체크리스트

### Step 1: 의존성
- [x] fast-xml-parser 추가

### Step 2: 타입 정의
- [x] KopisPerformance (목록 아이템)
- [x] KopisPerformanceDetail (상세)
- [x] KopisTicketInfo (티켓 판매 정보)
- [x] ListParams (조회 파라미터)

### Step 3: 클라이언트
- [x] createKopisClient 팩토리 함수
- [x] getPerformanceList 구현
- [x] getPerformanceDetail 구현

### Step 4: 빌드 검증
- [x] pnpm turbo build 성공
- [x] tsc --noEmit 타입 체크 통과

## 변경 범위 요약

| 파일 | 변경 유형 | 설명 |
|------|-----------|------|
| packages/kopis-cli/package.json | 수정 | fast-xml-parser 의존성 추가 |
| packages/kopis-cli/src/kopis/types.ts | 신규 | 응답 타입 정의 |
| packages/kopis-cli/src/kopis/client.ts | 신규 | API 클라이언트 |
