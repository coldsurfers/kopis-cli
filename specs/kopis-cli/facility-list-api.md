# 공연시설(Venue) 목록 조회 API

> KOPIS OpenAPI: [공연시설 목록](https://kopis.or.kr/por/cs/openapi/openApiList.do?menuId=MNU_00074&tabId=tab1_3)

## 목표

`tickets venue` 커맨드를 추가하여 공연시설(공연장) 목록을 조회할 수 있게 한다.

## API 스펙

### 엔드포인트

```
GET http://www.kopis.or.kr/openApi/restful/prfplc
```

### 요청 파라미터

| 변수명 | 필수 | 크기 | 설명 | 샘플데이터 |
|--------|------|------|------|-----------|
| `service` | O | 60 | 발급받은 인증키 | 서비스키 |
| `cpage` | O | 3 | 현재페이지 | `1` |
| `rows` | O | 3 | 페이지당 목록 수 (최대 100) | `5` |
| `shprfnmfct` | X | 100 | 공연시설명 (URLEncoding) | `예술의전당` |
| `fcltychartr` | X | 4 | 공연시설특성코드 | `1` |
| `signgucode` | X | 4 | 지역(시도)코드 | `11` |
| `signgucodesub` | X | 4 | 지역(구군)코드 | `1111` |
| `afterdate` | X | 8 | 해당 일자 이후 등록/수정된 항목만 출력 | `20230101` |

### 응답 XML 구조 (예상)

```xml
<dbs>
  <db>
    <fcltynm>예술의전당</fcltynm>
    <mt10id>FC001247</mt10id>
    <mt13cnt>5</mt13cnt>
    <fcltychartr>공연장</fcltychartr>
    <sidonm>서울특별시</sidonm>
    <gugunnm>서초구</gugunnm>
    <opende>1988</opende>
  </db>
</dbs>
```

## 구현 계획

### Step 1: 타입 정의 (`types.ts`)

```typescript
interface KopisVenue {
  id: string;           // mt10id
  name: string;         // fcltynm
  hallCount: number;    // mt13cnt — 공연장 수
  type: string;         // fcltychartr — 시설 특성
  sido: string;         // sidonm — 시도명
  gugun: string;        // gugunnm — 구군명
  openYear: string;     // opende — 개관연도
}

interface VenueListParams {
  rows?: number;
  page?: number;
  name?: string;          // shprfnmfct
  venueType?: string;     // fcltychartr
  area?: string;          // signgucode
  subArea?: string;       // signgucodesub
  afterDate?: string;     // afterdate
}

// 시설특성코드
const KOPIS_VENUE_TYPES = {
  중앙정부: '1',
  문예회관: '2',
  '기타(공공)': '3',
  대학로: '4',
  '민간(대학로 외)': '5',
  '기타(해외등)': '6',
  '기타(비공연장)': '7',
} as const;
```

### Step 2: 클라이언트 확장 (`client.ts`)

- `createKopisClient`에 `getVenueList(params)` 메서드 추가
- 엔드포인트: `http://www.kopis.or.kr/openApi/restful/prfplc`
- 기존 `safeFetch` + `XMLParser` 재사용

### Step 3: CLI 커맨드 (`commands/venue.ts`)

```bash
tickets venue --name 예술의전당
tickets venue --area 11
tickets venue --area 11 --subArea 1165
tickets venue --venueType 2
tickets venue --afterDate 20260101
tickets venue --format json
```

CLI 옵션:

| 옵션 | 설명 | 기본값 |
|------|------|--------|
| `--name <name>` | 시설명 검색 | - |
| `--venueType <code>` | 시설특성코드 (1~7) | - |
| `--area <code>` | 지역(시도) 필터 | - |
| `--subArea <code>` | 지역(구군) 필터 | - |
| `--afterDate <date>` | 등록/수정일 필터 (yyyyMMdd) | - |
| `--rows <number>` | 페이지당 결과 수 | 50 |
| `--page <number>` | 페이지 번호 | 1 |
| `--format <type>` | 출력 형식 (`table` \| `json`) | table |
| `--apiKey <key>` | KOPIS API Key | `KOPIS_KEY` env |

### Step 4: 테이블 포맷터 (`formatters/table.ts`)

- `formatVenueListTable` 함수 추가
- 컬럼: 시설명 / 시설특성 / 지역 / 구군 / 공연장수 / 개관연도

### Step 5: cli.ts 등록

- `registerVenueCommand(program)` 추가

## 체크리스트

- [x] `KopisVenue` 인터페이스 및 `VenueListParams` 정의
- [x] `client.ts`에 `getVenueList` 구현
- [x] `commands/venue.ts` 생성
- [x] `formatVenueListTable` 포맷터 추가
- [x] `cli.ts`에 venue 커맨드 등록
- [x] `KOPIS_VENUE_TYPES` 상수 및 `KopisVenueTypeCode` 타입 추가
- [x] README 업데이트
- [x] biome check + tsc + build 통과

## 변경 범위 요약

| 파일 | 변경 유형 | 설명 |
|------|-----------|------|
| `src/kopis/types.ts` | 수정 | `KopisVenue`, `VenueListParams` 추가 |
| `src/kopis/client.ts` | 수정 | `getVenueList` 메서드 추가 |
| `src/commands/venue.ts` | 신규 | venue 커맨드 구현 |
| `src/formatters/table.ts` | 수정 | `formatVenueListTable` 추가 |
| `src/cli.ts` | 수정 | venue 커맨드 등록 |
| `README.md` | 수정 | venue 커맨드 문서 추가 |

## 참고

- [KOPIS 공연시설 목록 API](https://kopis.or.kr/por/cs/openapi/openApiList.do?menuId=MNU_00074&tabId=tab1_3)
- 응답 XML 필드는 실제 API 호출로 검증 필요
