# Phase 6: 공연시설 상세 조회 커맨드

## 목표

KOPIS 공연시설상세 API(`/openApi/restful/prfplc/{공연시설아이디}`)를 CLI 커맨드로 지원한다.
기존 `detail`(공연 상세)과 동일한 패턴으로 `venue-detail` 커맨드를 추가한다.

## API 스펙

- **엔드포인트**: `http://kopis.or.kr/openApi/restful/prfplc/{공연시설아이디}?service={서비스키}`
- **HTTP 메서드**: GET
- **응답 형식**: XML

### 응답 필드

| XML 키 | 설명 | 비고 |
|--------|------|------|
| `mt10id` | 공연시설 ID | |
| `fcltynm` | 공연시설명 | |
| `mt13cnt` | 공연장 수 | |
| `fcltychartr` | 시설특성 | |
| `opende` | 개관연도 | |
| `seatscale` | 객석 수 | |
| `telno` | 전화번호 | |
| `relateurl` | 홈페이지 | |
| `adres` | 주소 | |
| `la` | 위도 | |
| `lo` | 경도 | |
| `mt13s.mt13` | 공연장 목록 (배열) | 하위 필드 참고 |

### 공연장 하위 필드 (`mt13s.mt13`)

| XML 키 | 설명 |
|--------|------|
| `mt13id` | 공연장 ID |
| `prfplcnm` | 공연장명 |
| `seatscale` | 좌석 수 |
| `stageorchat` | 무대/오케스트라석 여부 |

## 목표 구조

```
packages/kopis-cli/src/
├── kopis/
│   ├── types.ts           # KopisVenueDetail, KopisHall 인터페이스 추가
│   └── client.ts          # getVenueDetail() 메서드 추가
├── commands/
│   └── venue-detail.ts    # venue-detail 커맨드 (신규)
└── formatters/
    └── table.ts           # formatVenueDetailTable() 추가
```

## 체크리스트

### Step 1: 타입 정의 (`types.ts`)

- [x] `KopisHall` 인터페이스 추가 (`id`, `name`, `seatCount`, `stageOrOrchestra`)
- [x] `KopisVenueDetail` 인터페이스 추가 (`id`, `name`, `hallCount`, `type`, `openYear`, `seatScale`, `phone`, `homepage`, `address`, `latitude`, `longitude`, `halls: KopisHall[]`)

### Step 2: API 클라이언트 (`client.ts`)

- [x] `RawVenueDetail` raw 인터페이스 추가
- [x] `RawHall` raw 인터페이스 추가
- [x] `toVenueDetail()` 매핑 함수 추가 (+ `parseHalls()` 헬퍼)
- [x] `getVenueDetail(id: string)` 메서드 추가 — `${KOPIS_VENUE_BASE}/${id}?service=${apiKey}`
- [x] `createKopisClient` 반환 객체에 `getVenueDetail` 추가

### Step 3: 포맷터 (`table.ts`)

- [x] `formatVenueDetailTable(detail: KopisVenueDetail)` 함수 추가
- [x] 기본 시설 정보 테이블 + 공연장 목록 하위 테이블 출력

### Step 4: CLI 커맨드 (`venue-detail.ts`)

- [x] `venue-detail <id>` 커맨드 등록
- [x] `--format` (table|json) 옵션
- [x] `--apiKey` 옵션 / `KOPIS_KEY` env fallback
- [x] `cli.ts`에 `registerVenueDetailCommand` 등록

### Step 5: 검증

- [ ] biome check 통과
- [ ] pnpm turbo build 성공
- [ ] 빌드된 CLI 실행 확인

## 변경 범위 요약

| 파일 | 변경 유형 | 설명 |
|------|-----------|------|
| `packages/kopis-cli/src/kopis/types.ts` | 수정 | `KopisHall`, `KopisVenueDetail` 인터페이스 추가 |
| `packages/kopis-cli/src/kopis/client.ts` | 수정 | `getVenueDetail()` 메서드 추가 |
| `packages/kopis-cli/src/formatters/table.ts` | 수정 | `formatVenueDetailTable()` 추가 |
| `packages/kopis-cli/src/commands/venue-detail.ts` | 신규 | venue-detail 커맨드 |
| `packages/kopis-cli/src/cli.ts` | 수정 | venue-detail 커맨드 등록 |

## 참고

- [KOPIS OpenAPI 공연시설상세](https://kopis.or.kr/por/cs/openapi/openApiList.do?menuId=MNU_00074&tabId=tab1_4)
- 기존 `detail` 커맨드(공연 상세)와 동일 패턴
- `KOPIS_VENUE_BASE`(`http://www.kopis.or.kr/openApi/restful/prfplc`)는 이미 `client.ts`에 정의되어 있음
