# Phase 3: CLI 커맨드 구현

## 목표

`npx @coldsurfers/tickets find / detail` 커맨드가 동작하는 상태를 만든다.

## 목표 구조

```
packages/kopis-cli/src/
├── cli.ts                # commander bin entry
└── commands/
    ├── find.ts           # 공연 목록 조회
    └── detail.ts         # 공연 상세 조회
```

## 체크리스트

### Step 1: 의존성
- [x] commander 추가

### Step 2: cli.ts
- [x] commander program 설정 (name, description, version)
- [x] find, detail 서브커맨드 등록

### Step 3: commands/find.ts
- [x] --startDate (필수)
- [x] --endDate (optional, 기본값 오늘)
- [x] --category (optional)
- [x] --rows (optional, 기본값 50)
- [x] --format (optional, 기본값 json -- table은 Phase 4)
- [x] --apiKey / KOPIS_KEY env fallback

### Step 4: commands/detail.ts
- [x] `<id>` positional argument
- [x] --apiKey / KOPIS_KEY env fallback
- [x] --format (optional)

### Step 5: 검증
- [x] biome check 통과
- [x] pnpm turbo build 성공
- [x] 빌드된 CLI 실행 확인

## 변경 범위 요약

| 파일 | 변경 유형 | 설명 |
|------|-----------|------|
| packages/kopis-cli/package.json | 수정 | commander 의존성 |
| packages/kopis-cli/src/cli.ts | 수정 | commander entry |
| packages/kopis-cli/src/commands/find.ts | 신규 | find 커맨드 |
| packages/kopis-cli/src/commands/detail.ts | 신규 | detail 커맨드 |
