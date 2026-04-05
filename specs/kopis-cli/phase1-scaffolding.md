# Phase 1: 패키지 스캐폴딩

## 목표

빈 monorepo에서 `pnpm turbo build` 실행 시 `packages/kopis-cli`가 빌드 성공하는 상태를 만든다.

## 목표 구조

```
kopis-cli/                        # repo root
├── package.json                  # root workspace package.json
├── pnpm-workspace.yaml           # packages/* 등록
├── turbo.json                    # build pipeline 정의
└── packages/
    └── kopis-cli/
        ├── package.json          # @coldsurfers/tickets
        ├── tsconfig.json         # Node ESM 타겟
        ├── tsup.config.ts        # CLI 빌드 설정
        └── src/
            └── cli.ts            # bin entry (placeholder)
```

## 레이어 설명

- **Root**: pnpm workspace + turborepo orchestration
- **packages/kopis-cli**: 실제 npm 배포 단위. tsup으로 ESM 빌드, `@coldsurfers/tickets`로 publish

## 체크리스트

### Step 1: Root 설정 파일
- [x] `package.json` — private, packageManager, devDependencies (turbo, typescript)
- [x] `pnpm-workspace.yaml` — packages/* 등록
- [x] `turbo.json` — build pipeline

### Step 2: 패키지 스캐폴딩
- [x] `packages/kopis-cli/package.json` — name, bin, main, exports, publishConfig, scripts
- [x] `packages/kopis-cli/tsconfig.json` — Node ESM 타겟
- [x] `packages/kopis-cli/tsup.config.ts` — entry, format, shims

### Step 3: CLI entry
- [x] `packages/kopis-cli/src/cli.ts` — shebang + placeholder

### Step 4: 빌드 검증
- [x] `pnpm install && pnpm turbo build` 성공
- [x] `dist/cli.js` 생성 확인

## 변경 범위 요약

| 파일 | 변경 유형 | 설명 |
|------|-----------|------|
| `package.json` (root) | 신규 | workspace root |
| `pnpm-workspace.yaml` | 신규 | workspace 패키지 등록 |
| `turbo.json` | 신규 | build pipeline |
| `packages/kopis-cli/package.json` | 신규 | @coldsurfers/tickets 패키지 |
| `packages/kopis-cli/tsconfig.json` | 신규 | TypeScript 설정 |
| `packages/kopis-cli/tsup.config.ts` | 신규 | 빌드 설정 |
| `packages/kopis-cli/src/cli.ts` | 신규 | CLI entry point |
