# Phase 8: 수상작 목록 조회 커맨드

## 목표

KOPIS 수상작목록 API를 CLI 커맨드로 지원한다.
기존 `find`(공연 목록)와 유사한 요청 파라미터 구조를 가지며, 응답에 `awards`(수상실적) 필드가 추가된다.

## API 스펙

- **엔드포인트**: `http://kopis.or.kr/openApi/restful/prfawad`
- **HTTP 메서드**: GET
- **응답 형식**: XML
- **참고**: https://kopis.or.kr/por/cs/openapi/openApiList.do?menuId=MNU_00074&tabId=tab1_6

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
| `afterdate` | X | 8 | 해당 일자 이후 등록/수정 항목만 출력 | `20230101` |

### 응답 필드

| 변수명 | 설명 | 샘플데이터 |
|--------|------|-----------|
| `mt20id` | 공연ID | `PF132236` |
| `prfnm` | 공연명 | `우리연애할까` |
| `prfpdfrom` | 공연시작일 | `2016.05.12` |
| `prfpdto` | 공연종료일 | `2016.07.31` |
| `fcltynm` | 공연시설명 | `피가로아트홀` |
| `poster` | 포스터이미지경로 | `http://...` |
| `genrenm` | 공연 장르명 | `연극` |
| `prfstate` | 공연상태 | `공연중` |
| `awards` | 수상실적 | `2017 대한민국 공감브랜드 대상 교육부문 대상` |

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
| `--rows` | `rows` | 페이지당 결과 수 (기본값 50) | `10` |
| `--page` | `cpage` | 페이지 번호 (기본값 1) | `2` |

## 목표 구조

```
packages/kopis-cli/src/
├── kopis/
│   ├── types.ts           # KopisAwardPerformance, AwardListParams 인터페이스 추가
│   └── client.ts          # getAwardList() 메서드 추가
├── commands/
│   └── award.ts           # award 커맨드 (신규)
└── formatters/
    └── table.ts           # formatAwardListTable() 추가
```

## 설계 노트

- `KopisAwardPerformance`는 기존 `KopisPerformance`와 거의 동일하나 `awards` 필드가 추가됨
- `AwardListParams`는 기존 `ListParams`와 동일한 구조 — 별도 타입을 두지 않고 `ListParams`를 재사용할 수 있음
- 테이블 포맷터에서 `awards` 컬럼은 텍스트가 길 수 있으므로 wordWrap 적용

## 체크리스트

### Step 1: 타입 정의 (`types.ts`)

- [ ] `KopisAwardPerformance` 인터페이스 추가 (`KopisPerformance` + `awards: string`)
- [ ] `AwardListParams` — `ListParams` 재사용 가능 여부 확인, 필요시 별도 정의

### Step 2: API 클라이언트 (`client.ts`)

- [ ] `KOPIS_AWARD_BASE` 상수 추가 (`http://www.kopis.or.kr/openApi/restful/prfawad`)
- [ ] `RawAwardItem` raw 인터페이스 추가 (`RawListItem` + `awards`)
- [ ] `toAwardPerformance()` 매핑 함수 추가
- [ ] `getAwardList(params: ListParams)` 메서드 추가
- [ ] `createKopisClient` 반환 객체에 `getAwardList` 추가

### Step 3: 포맷터 (`table.ts`)

- [ ] `formatAwardListTable(items: KopisAwardPerformance[])` 함수 추가
- [ ] 컬럼: 공연ID, 공연명, 장르, 공연장, 기간, 상태, 수상실적

### Step 4: CLI 커맨드 (`award.ts`)

- [ ] `award` 커맨드 등록
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
- [ ] `cli.ts`에 `registerAwardCommand` 등록

### Step 5: README 업데이트

- [ ] 루트 `README.md`에 사용법 예시 + 옵션 테이블 추가
- [ ] 패키지 `README.md`에 간단 사용법 추가

### Step 6: 검증

- [ ] biome check 통과
- [ ] TypeScript 타입 체크 통과
- [ ] 빌드된 CLI 실행 확인

## 변경 범위 요약

| 파일 | 변경 유형 | 설명 |
|------|-----------|------|
| `packages/kopis-cli/src/kopis/types.ts` | 수정 | `KopisAwardPerformance` 인터페이스 추가 |
| `packages/kopis-cli/src/kopis/client.ts` | 수정 | `KOPIS_AWARD_BASE` 상수 + `getAwardList()` 메서드 추가 |
| `packages/kopis-cli/src/formatters/table.ts` | 수정 | `formatAwardListTable()` 추가 |
| `packages/kopis-cli/src/commands/award.ts` | 신규 | award 커맨드 |
| `packages/kopis-cli/src/cli.ts` | 수정 | award 커맨드 등록 |
| `README.md` | 수정 | 사용법 + 옵션 테이블 추가 |
| `packages/kopis-cli/README.md` | 수정 | 간단 사용법 추가 |

## 참고

- [KOPIS OpenAPI 수상작목록](https://kopis.or.kr/por/cs/openapi/openApiList.do?menuId=MNU_00074&tabId=tab1_6)
- 요청 파라미터가 `find` 커맨드(`ListParams`)와 동일 — 타입 재사용 가능
- 응답은 `find` 결과 + `awards` 필드
