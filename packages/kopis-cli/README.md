# @coldsurf/tickets

[![npm version](https://img.shields.io/npm/v/@coldsurf/tickets.svg)](https://www.npmjs.com/package/@coldsurf/tickets)
[![npm downloads](https://img.shields.io/npm/dm/@coldsurf/tickets.svg)](https://www.npmjs.com/package/@coldsurf/tickets)
[![license](https://img.shields.io/npm/l/@coldsurf/tickets.svg)](https://github.com/coldsurfers/kopis-cli/blob/main/LICENSE)

KOPIS(공연예술통합전산망) OpenAPI를 활용한 공연 정보 CLI 및 TypeScript SDK입니다.

터미널에서 공연 목록 조회, 상세 정보 확인을 간편하게 할 수 있고, TypeScript 프로젝트에서 SDK로 import하여 사용할 수도 있습니다.

## 설치

```bash
# CLI로 사용
npm install -g @coldsurf/tickets

# SDK로 사용 (프로젝트 의존성)
pnpm add @coldsurf/tickets
```

또는 `npx`로 바로 실행:

```bash
npx @coldsurf/tickets find --startDate 20250101
```

## KOPIS API Key 발급

이 CLI를 사용하려면 KOPIS OpenAPI 인증키가 필요합니다.

1. [공연예술통합전산망 OpenAPI](https://kopis.or.kr/por/cs/openapi/openApiList.do?menuId=MNU_00074&tabId=tab1_1) 페이지에서 회원가입
2. OpenAPI 사용 신청 후 인증키 발급
3. 환경변수 또는 `--apiKey` 옵션으로 전달

```bash
export KOPIS_KEY="발급받은_API_KEY"
```

## 사용법

```bash
# 공연 목록 조회
tickets find --startDate 20250101
tickets find --startDate 20250101 --category GGGA --area 11

# 공연 상세 조회
tickets detail PF123456

# 공연시설 목록 조회
tickets venue --name 예술의전당

# 공연시설 상세 조회
tickets venue-detail FC001247

# 기획/제작사 목록 조회
tickets promoter --name 국악단

# 수상작 목록 조회
tickets award --startDate 20160101 --endDate 20161231

# 축제 목록 조회
tickets festival --startDate 20250101 --endDate 20251231

# 원·창작자 목록 조회
tickets creator --startDate 20250101 --endDate 20251231

# JSON 출력 (모든 커맨드 공통)
tickets find --startDate 20250101 --format json
```

전체 옵션, 코드표 등 상세 문서는 [GitHub README](https://github.com/coldsurfers/kopis-cli#readme)를 참고하세요.

## SDK 사용법

TypeScript/JavaScript 프로젝트에서 직접 import하여 사용할 수 있습니다.

```typescript
import {
  createKopisClient,
  KOPIS_CATEGORIES,
  KOPIS_AREAS,
} from '@coldsurf/tickets'

const client = createKopisClient(process.env.KOPIS_KEY!)

// 서울 대중음악 공연 조회
const performances = await client.getPerformanceList({
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

### 주요 API

| 메서드 | 설명 |
|--------|------|
| `getPerformanceList(params)` | 공연 목록 조회 |
| `getPerformanceDetail(id)` | 공연 상세 조회 |
| `getVenueList(params)` | 공연시설 목록 조회 |
| `getVenueDetail(id)` | 공연시설 상세 조회 |
| `getPromoterList(params)` | 기획/제작사 목록 조회 |
| `getAwardList(params)` | 수상작 목록 조회 |
| `getFestivalList(params)` | 축제 목록 조회 |
| `getCreatorList(params)` | 원·창작자 목록 조회 |

### Export 목록

| 분류 | Export |
|------|--------|
| 클라이언트 | `createKopisClient`, `KopisApiError` |
| 클라이언트 타입 | `KopisClient` |
| 응답 타입 | `KopisPerformance`, `KopisPerformanceDetail`, `KopisTicketInfo`, `KopisVenue`, `KopisVenueDetail`, `KopisHall`, `KopisPromoter`, `KopisAwardPerformance`, `KopisFestivalPerformance`, `KopisCreatorPerformance` |
| 파라미터 타입 | `ListParams`, `VenueListParams`, `PromoterListParams` |
| 코드 타입 | `KopisCategoryCode`, `KopisAreaCode`, `KopisPerformStateCode`, `KopisVenueTypeCode` |
| 상수 | `KOPIS_CATEGORIES`, `KOPIS_AREAS`, `KOPIS_PERFORM_STATES`, `KOPIS_VENUE_TYPES`, `KOPIS_SUB_AREAS` |

## 데이터 출처

이 도구는 [KOPIS 공연예술통합전산망](https://kopis.or.kr) (예술경영지원센터)에서 제공하는 OpenAPI 데이터를 사용합니다.

## 라이선스

[MIT](https://github.com/coldsurfers/kopis-cli/blob/main/LICENSE)
