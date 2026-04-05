# Phase 4: 출력 포맷터

## 목표

사람이 읽기 좋은 table 포맷과 파이프 가능한 json 포맷을 지원한다.
API 에러(key 누락, 네트워크 오류)를 명확한 메시지로 처리한다.

## 목표 구조

```
packages/kopis-cli/src/
├── formatters/
│   ├── table.ts       # cli-table3 기반 테이블 출력
│   └── json.ts        # JSON.stringify 출력
└── commands/
    ├── find.ts        # 포맷터 통합
    └── detail.ts      # 포맷터 통합
```

## 체크리스트

### Step 1: 의존성
- [x] cli-table3 추가

### Step 2: 포맷터
- [x] formatters/table.ts — find용 테이블 (공연명/장르/공연장/기간/상태)
- [x] formatters/table.ts — detail용 테이블
- [x] formatters/json.ts — JSON 출력

### Step 3: 에러 핸들링
- [x] client.ts에 네트워크 오류 처리 (safeFetch)
- [x] KOPIS API 에러 응답 (returncode) 처리 (KopisApiError)

### Step 4: 커맨드 통합
- [x] find.ts에 --format table/json 분기
- [x] detail.ts에 --format table/json 분기

### Step 5: 검증
- [x] biome check 통과
- [x] tsc --noEmit 통과
- [x] pnpm turbo build 성공
- [ ] --format table / --format json 양쪽 출력 확인 (실제 API key로 테스트 필요)

## 변경 범위 요약

| 파일 | 변경 유형 | 설명 |
|------|-----------|------|
| packages/kopis-cli/package.json | 수정 | cli-table3 의존성 |
| packages/kopis-cli/src/formatters/table.ts | 신규 | 테이블 포맷터 |
| packages/kopis-cli/src/formatters/json.ts | 신규 | JSON 포맷터 |
| packages/kopis-cli/src/kopis/client.ts | 수정 | 에러 핸들링 |
| packages/kopis-cli/src/commands/find.ts | 수정 | 포맷터 통합 |
| packages/kopis-cli/src/commands/detail.ts | 수정 | 포맷터 통합 |
