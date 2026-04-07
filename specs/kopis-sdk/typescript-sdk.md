# KOPIS TypeScript SDK Spec

## 목표

`@coldsurf/tickets` 단일 패키지에서 CLI(bin)와 SDK(library) 두 가지 형태로 사용할 수 있도록 entry point를 추가한다. 별도 패키지 분리 없이 기존 구조를 최대한 유지하면서 SDK export를 구성한다.

## 접근 방식: 단일 패키지 (dual entry point)

### 왜 패키지를 분리하지 않는가?

| 항목 | 단일 (`@coldsurf/tickets`) | 분리 (`kopis-sdk` + `kopis-cli`) |
|------|---------------------------|----------------------------------|
| 설치 | `pnpm add @coldsurf/tickets` 하나로 SDK+CLI | SDK만 쓰려면 별도 패키지 설치 |
| 의존성 | SDK만 쓰는 소비자도 `commander`/`cli-table3` 설치됨 (가벼움, side-effect 없음) | SDK는 `fast-xml-parser`만 |
| 버전 관리 | 하나의 버전 | 독립적 버전 관리 필요 |
| 모노레포 복잡도 | 현재 구조 유지 | 패키지 추가 + turbo 빌드 의존성 설정 |
| 변경 범위 | 최소 (entry point 추가 + `index.ts` 작성) | 코드 이동 + import 경로 전부 변경 |

현재 규모에서는 단일 패키지가 실용적이다. SDK 사용처가 늘어 의존성 분리가 필요해지면 그때 분리해도 늦지 않다.

## 현재 구조 분석

```
packages/kopis-cli/src/
├── kopis/
│   ├── client.ts      ← SDK 핵심 (createKopisClient + XML 파싱 + 변환)
│   ├── types.ts       ← 타입 + 상수 (KOPIS_CATEGORIES, KOPIS_AREAS 등)
│   └── area-codes.ts  ← 시군구 코드 맵
├── commands/          ← CLI 전용 (commander.js)
├── formatters/        ← CLI 전용 (table/json 출력)
└── utils/
    ├── resolve-api-key.ts  ← CLI 전용 (env/옵션 처리)
    └── date.ts             ← SDK에서도 사용 (todayString)
```

**핵심 관찰:** `client.ts`와 `types.ts`가 이미 SDK의 완전한 뼈대. CLI 의존성(`commander`, `cli-table3`)과 무관하게 동작한다.

## 변경 후 구조

```
packages/kopis-cli/src/
├── index.ts           ← (신규) SDK public API re-export
├── kopis/
│   ├── client.ts      ← KopisClient 인터페이스 추가
│   ├── types.ts       ← 변경 없음
│   └── area-codes.ts  ← 변경 없음
├── commands/          ← 변경 없음
├── formatters/        ← 변경 없음
└── utils/
    ├── resolve-api-key.ts  ← 변경 없음
    └── date.ts             ← 변경 없음
```

## 변경 사항 상세

### 1. tsup.config.ts — entry point 추가

```typescript
import { defineConfig } from 'tsup';

export default defineConfig([
  // SDK (library)
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,        // .d.ts 타입 선언 파일 생성
    clean: true,
    shims: true,
  },
  // CLI (binary)
  {
    entry: ['src/cli.ts'],
    format: ['esm'],
    banner: { js: '#!/usr/bin/env node' },
    shims: true,
  },
]);
```

### 2. package.json — exports 수정

```jsonc
{
  "name": "@coldsurf/tickets",
  // bin은 유지
  "bin": {
    "tickets": "./dist/cli.js"
  },
  // main/types를 SDK entry로 변경
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  // exports에 SDK entry 추가
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  }
}
```

### 3. src/index.ts (신규) — SDK Public API

```typescript
// 클라이언트
export { createKopisClient, KopisApiError } from './kopis/client.js'
export type { KopisClient } from './kopis/client.js'

// 타입 — 응답
export type {
  KopisPerformance,
  KopisPerformanceDetail,
  KopisTicketInfo,
  KopisVenue,
  KopisVenueDetail,
  KopisHall,
  KopisPromoter,
  KopisAwardPerformance,
  KopisFestivalPerformance,
  KopisCreatorPerformance,
} from './kopis/types.js'

// 타입 — 파라미터
export type {
  ListParams,
  VenueListParams,
  PromoterListParams,
} from './kopis/types.js'

// 타입 — 코드 타입
export type {
  KopisCategoryCode,
  KopisAreaCode,
  KopisPerformStateCode,
  KopisVenueTypeCode,
} from './kopis/types.js'

// 상수
export {
  KOPIS_CATEGORIES,
  KOPIS_AREAS,
  KOPIS_PERFORM_STATES,
  KOPIS_VENUE_TYPES,
} from './kopis/types.js'

// 시군구 코드
export { KOPIS_SUB_AREAS } from './kopis/area-codes.js'
```

### 4. KopisClient 인터페이스 추가 (client.ts)

현재 `createKopisClient`의 반환 타입이 추론에 의존한다. 소비자가 타입을 명시적으로 참조할 수 있도록 인터페이스를 추가한다.

```typescript
// client.ts에 추가
export interface KopisClient {
  getPerformanceList(params: ListParams): Promise<KopisPerformance[]>
  getPerformanceDetail(id: string): Promise<KopisPerformanceDetail | null>
  getVenueList(params: VenueListParams): Promise<KopisVenue[]>
  getVenueDetail(id: string): Promise<KopisVenueDetail | null>
  getPromoterList(params: PromoterListParams): Promise<KopisPromoter[]>
  getAwardList(params: ListParams): Promise<KopisAwardPerformance[]>
  getFestivalList(params: ListParams): Promise<KopisFestivalPerformance[]>
  getCreatorList(params: ListParams): Promise<KopisCreatorPerformance[]>
}

export function createKopisClient(apiKey: string): KopisClient {
  // ...기존 구현 그대로
}
```

## 구현 체크리스트

### Phase 1: SDK entry point 구성

- [x] `src/index.ts` 작성 (SDK public API re-export)
- [x] `client.ts`에 `KopisClient` 인터페이스 추가 및 `createKopisClient` 반환 타입 명시
- [x] `tsup.config.ts`를 dual entry point로 수정 (`src/index.ts` + `src/cli.ts`)
- [x] `package.json`의 `main`, `types`, `exports` 수정

### Phase 2: 빌드 + 검증

- [x] `pnpm turbo build` — `dist/index.js` + `dist/index.d.ts` + `dist/cli.js` 생성 확인
- [x] `pnpm turbo check:type` 타입 체크 통과
- [x] `pnpm biome check --write packages/kopis-cli/src/index.ts` 실행

### Phase 3: changeset

- [ ] `pnpm changeset` — `@coldsurf/tickets` minor (SDK export 추가)

## 변경 범위

| 파일 | 변경 내용 |
|------|-----------|
| `packages/kopis-cli/src/index.ts` (신규) | SDK public API re-export |
| `packages/kopis-cli/src/kopis/client.ts` | `KopisClient` 인터페이스 추가 + 반환 타입 명시 |
| `packages/kopis-cli/tsup.config.ts` | dual entry point 설정 |
| `packages/kopis-cli/package.json` | `main`, `types`, `exports` 수정 |

**기존 코드 변경 없음** — import 경로, 디렉토리 구조, 다른 소스 파일 모두 그대로 유지.

## SDK 사용 예시

```typescript
import {
  createKopisClient,
  KOPIS_CATEGORIES,
  KOPIS_AREAS,
  type KopisClient,
  type KopisPerformance,
} from '@coldsurf/tickets'

const client: KopisClient = createKopisClient(process.env.KOPIS_KEY!)

// 서울 대중음악 공연 조회
const performances: KopisPerformance[] = await client.getPerformanceList({
  startDate: '20260101',
  endDate: '20261231',
  category: KOPIS_CATEGORIES.대중음악,
  area: KOPIS_AREAS.서울,
  rows: 20,
})

// 공연 상세 조회
const detail = await client.getPerformanceDetail(performances[0].id)

// 공연장 검색
const venues = await client.getVenueList({
  name: '예술의전당',
})
```

## CLI 사용 (기존과 동일)

```bash
# npx 또는 global install
tickets find --startDate 20260101 --category 대중음악 --area 서울

# 상세 조회
tickets detail PF123456
```

## 결정 사항

1. **단일 패키지**: `@coldsurf/tickets`에서 SDK + CLI 모두 제공
2. **ESM only**: 기존 컨벤션 유지
3. **`dts: true`**: SDK entry에만 적용 (CLI entry는 타입 불필요)
4. **Node.js 버전**: 18+ (native fetch 사용)
5. **향후**: SDK 사용처가 늘어 의존성 분리가 필요해지면 별도 패키지로 추출
