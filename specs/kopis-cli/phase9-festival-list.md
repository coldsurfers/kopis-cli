# Phase 9: 축제 목록 조회 커맨드

## 목표

KOPIS 축제목록 API를 CLI 커맨드로 지원한다.
기존 `find`(공연 목록), `award`(수상작 목록)와 동일한 조회 흐름을 유지하되, 축제 전용 엔드포인트를 사용하고 응답의 `festival` 여부를 함께 노출한다.

## API 스펙

- **엔드포인트**: `http://kopis.or.kr/openApi/restful/prffest`
- **HTTP 메서드**: GET
- **응답 형식**: XML
- **참고**: https://kopis.or.kr/por/cs/openapi/openApiList.do?menuId=MNU_00074&tabId=tab1_7
- **비고**: 최대 `100`건까지만 조회 가능

### 요청 파라미터

| 변수명 | 필수 | 크기 | 설명 | 샘플데이터 |
|--------|------|------|------|-----------|
| `service` | O | 60 | 발급받은 인증키 | |
| `stdate` | O | 8 | 공연시작일자 | `20160101` |
| `eddate` | O | 8 | 공연종료일자 | `20160630` |
| `cpage` | O | 3 | 현재페이지 | `1` |
| `rows` | O | 3 | 페이지당 목록 수 | `10` (최대 100건) |
| `shprfnm` | X | 100 | 공연명 | `사랑` (URLEncoding) |
| `shprfnmfct` | X | 100 | 공연시설명 | `예술의전당` (URLEncoding) |
| `shcate` | X | 4 | 장르코드 | `AAAA` |
| `prfplccd` | X | 4 | 공연장코드 | `FC000001-01` |
| `signgucode` | X | 2 | 지역(시도)코드 | `11` |
| `signgucodesub` | X | 4 | 지역(구군)코드 | `1111` |
| `kidstate` | X | 1 | 아동공연여부 | `Y` |
| `prfstate` | X | 2 | 공연상태코드 | `01` |
| `afterdate` | X | 8 | 해당 일자 이후 등록/수정된 항목만 출력 | `20230101` |

### 응답 필드

| 변수명 | 설명 | 샘플데이터 |
|--------|------|-----------|
| `mt20id` | 공연ID | `PF132236` |
| `prfnm` | 공연명 | `우리연애할까` |
| `prfpdfrom` | 공연시작일 | `2016.05.12` |
| `prfpdto` | 공연종료일 | `2016.07.31` |
| `fcltynm` | 공연시설명(공연장명) | `피가로아트홀(구 훈아트홀)` |
| `poster` | 포스터이미지경로 | `http://www.kopis.or.kr/upload/pfmPoster/...` |
| `genrenm` | 공연 장르명 | `연극` |
| `festival` | 축제여부 | `Y` |
| `prfstate` | 공연상태 | `공연중` |

### CLI 옵션 매핑

| CLI 옵션 | KOPIS 쿼리 키 | 설명 | 값 예시 |
|----------|---------------|------|---------|
| `--startDate` | `stdate` | 공연시작일자 (필수) | `20160101` |
| `--endDate` | `eddate` | 공연종료일자 | `20160630` |
| `--title` | `shprfnm` | 공연명 검색 | `사랑` |
| `--venue` | `shprfnmfct` | 공연시설명 검색 | `예술의전당` |
| `--category` | `shcate` | 장르코드 필터 | `AAAA` |
| `--facilityCode` | `prfplccd` | 공연장코드 | `FC000001-01` |
| `--area` | `signgucode` | 지역(시도) 필터 | `11` |
| `--subArea` | `signgucodesub` | 지역(구군) 필터 | `1111` |
| `--kidState` | `kidstate` | 아동공연만 조회 | (flag) |
| `--performState` | `prfstate` | 공연상태 필터 | `01` |
| `--afterDate` | `afterdate` | 해당 일자 이후 등록/수정 항목만 | `20230101` |
| `--rows` | `rows` | 페이지당 결과 수 (기본값 50, 최대 100) | `10` |
| `--page` | `cpage` | 페이지 번호 (기본값 1) | `2` |

## 커맨드 제안

- 커맨드명: `festival`
- 설명: `축제 목록 조회`
- 출력 포맷: `table`, `json`

### 사용 예시

```bash
pnpm --filter kopis-cli dev -- festival \
  --startDate 20250101 \
  --endDate 20251231 \
  --area 11 \
  --format table
```

```bash
pnpm --filter kopis-cli dev -- festival \
  --startDate 20250101 \
  --title 벚꽃 \
  --rows 20 \
  --format json
```

## 목표 구조

```text
packages/kopis-cli/src/
├── kopis/
│   ├── types.ts           # KopisFestivalPerformance 인터페이스 추가
│   └── client.ts          # getFestivalList() 메서드 추가
├── commands/
│   └── festival.ts        # festival 커맨드 (신규)
├── formatters/
│   └── table.ts           # formatFestivalListTable() 추가
└── cli.ts                 # registerFestivalCommand() 등록
```

## 설계 노트

- 축제목록 응답은 기존 `KopisPerformance` 구조와 거의 동일하나 `festival` 필드가 추가된다.
- 별도 타입 `KopisFestivalPerformance`를 두고 `festival: string`을 포함한다.
- 요청 파라미터는 `ListParams`와 거의 동일하다.
- `openrun`은 축제 API 문서에 명시되어 있지 않으므로 초기 구현에서는 CLI 옵션으로 노출하지 않는다.
- `rows`는 CLI 차원에서도 `100` 초과 시 에러 처리하거나 `100`으로 clamp하는 방식을 택한다. 스펙 문서 기준 권장안은 명시적 에러 처리다.
- 테이블 출력은 일반 공연 목록과 동일한 컬럼을 유지하고, 마지막에 `축제여부` 컬럼을 추가한다.

## 체크리스트

### Step 1: 타입 정의 (`types.ts`)

- [ ] `KopisFestivalPerformance` 인터페이스 추가 (`KopisPerformance` + `festival: string`)
- [ ] 별도 요청 타입 없이 `ListParams` 재사용 여부 확인

### Step 2: API 클라이언트 (`client.ts`)

- [ ] `KOPIS_FESTIVAL_BASE` 상수 추가 (`http://www.kopis.or.kr/openApi/restful/prffest`)
- [ ] `RawFestivalItem` raw 인터페이스 추가 (`RawListItem` + `festival`)
- [ ] `toFestivalPerformance()` 매핑 함수 추가
- [ ] `getFestivalList(params: ListParams)` 메서드 추가
- [ ] `createKopisClient` 반환 객체에 `getFestivalList` 추가
- [ ] `rows > 100` 방어 로직 추가

### Step 3: 포맷터 (`table.ts`)

- [ ] `formatFestivalListTable(items: KopisFestivalPerformance[])` 함수 추가
- [ ] 컬럼: 공연ID, 공연명, 장르, 공연장, 지역, 기간, 상태, 축제여부

### Step 4: CLI 커맨드 (`festival.ts`)

- [ ] `festival` 커맨드 등록
- [ ] `--startDate` 공연시작일자 옵션 (필수)
- [ ] `--endDate` 공연종료일자 옵션
- [ ] `--title` 공연명 검색 옵션
- [ ] `--venue` 공연시설명 검색 옵션
- [ ] `--category` 장르코드 필터 옵션
- [ ] `--facilityCode` 공연장코드 옵션
- [ ] `--area`, `--subArea` 지역 필터 옵션
- [ ] `--kidState` 아동공연 플래그 옵션
- [ ] `--performState` 공연상태 필터 옵션
- [ ] `--afterDate` 등록/수정일 필터 옵션
- [ ] `--rows`, `--page` 페이지네이션 옵션
- [ ] `--format` (table|json) 옵션
- [ ] `--apiKey` 옵션 / `KOPIS_KEY` env fallback
- [ ] `cli.ts`에 `registerFestivalCommand` 등록

### Step 5: README 업데이트

- [ ] 루트 `README.md`에 사용법 예시 + 옵션 테이블 추가
- [ ] 패키지 `README.md`에 간단 사용법 추가
- [ ] 명령 목록에 `festival` 추가

### Step 6: 검증

- [ ] biome check 통과
- [ ] TypeScript 타입 체크 통과
- [ ] 빌드된 CLI 실행 확인
- [ ] `festival --format table`, `festival --format json` 수동 확인

## 변경 범위 요약

| 파일 | 변경 유형 | 설명 |
|------|-----------|------|
| `packages/kopis-cli/src/kopis/types.ts` | 수정 | `KopisFestivalPerformance` 인터페이스 추가 |
| `packages/kopis-cli/src/kopis/client.ts` | 수정 | `KOPIS_FESTIVAL_BASE` 상수 + `getFestivalList()` 메서드 추가 |
| `packages/kopis-cli/src/formatters/table.ts` | 수정 | `formatFestivalListTable()` 추가 |
| `packages/kopis-cli/src/commands/festival.ts` | 신규 | festival 커맨드 |
| `packages/kopis-cli/src/cli.ts` | 수정 | festival 커맨드 등록 |
| `README.md` | 수정 | 사용법 + 옵션 테이블 추가 |
| `packages/kopis-cli/README.md` | 수정 | 간단 사용법 추가 |

## 참고

- [KOPIS OpenAPI 축제목록](https://kopis.or.kr/por/cs/openapi/openApiList.do?menuId=MNU_00074&tabId=tab1_7)
- 축제 API는 일반 공연 목록 API와 요청 구조가 유사하므로 기존 구현을 적극 재사용할 수 있다.
- 응답의 `festival` 값은 일반적으로 `Y`가 예상되지만, raw 응답을 그대로 보존해 출력하는 편이 안전하다.
