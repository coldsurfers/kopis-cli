# Phase 10: 원·창작자 목록 조회 커맨드

## 목표

KOPIS 원·창작자목록 API를 CLI 커맨드로 지원한다.
기존 `find`(공연 목록), `award`(수상작 목록), `festival`(축제 목록)과 동일한 조회 흐름을 유지하되, 응답에 `author`(원작자), `creator`(창작자) 필드를 추가로 노출한다.

## API 스펙

- **엔드포인트**: `http://kopis.or.kr/openApi/restful/prfper`
- **HTTP 메서드**: GET
- **응답 형식**: XML
- **참고**: https://kopis.or.kr/por/cs/openapi/openApiList.do?menuId=MNU_00074&tabId=tab1_8
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
| `prfstate` | 공연상태 | `공연중` |
| `author` | 원작자 | `김민수, 변성현` |
| `creator` | 창작자 | `정세혁(각색)` |

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

- 커맨드명: `creator`
- 설명: `원·창작자 목록 조회`
- 출력 포맷: `table`, `json`

### 사용 예시

```bash
pnpm --filter kopis-cli dev -- creator \
  --startDate 20250101 \
  --endDate 20251231 \
  --category AAAA \
  --format table
```

```bash
pnpm --filter kopis-cli dev -- creator \
  --startDate 20250101 \
  --title 햄릿 \
  --rows 20 \
  --format json
```

## 목표 구조

```text
packages/kopis-cli/src/
├── kopis/
│   ├── types.ts           # KopisCreatorPerformance 인터페이스 추가
│   └── client.ts          # getCreatorList() 메서드 추가
├── commands/
│   └── creator.ts         # creator 커맨드 (신규)
├── formatters/
│   └── table.ts           # formatCreatorListTable() 추가
└── cli.ts                 # registerCreatorCommand() 등록
```

## 설계 노트

- 원·창작자 목록 응답은 기존 `KopisPerformance` 구조와 거의 동일하나 `author`, `creator` 필드가 추가된다.
- 별도 타입 `KopisCreatorPerformance`를 두고 `author: string`, `creator: string`을 포함한다.
- 요청 파라미터는 기존 `ListParams`를 재사용할 수 있다.
- API 문서에 `openrun`은 명시되어 있지 않으므로 이 커맨드에서는 옵션으로 노출하지 않는다.
- `rows`는 기존 목록형 API와 동일하게 `100` 초과 시 에러 처리한다.
- 테이블 포맷터에서 `author`, `creator` 텍스트 길이가 길 수 있으므로 `wordWrap` 기준으로 별도 컬럼 폭을 확보한다.
- 커맨드명은 기능 의도를 가장 짧게 드러내는 `creator`를 권장한다. 다만 팀 내 네이밍 선호에 따라 `original-creator` 같은 대안도 가능하다. 현재 spec은 기존 `award`, `festival`, `venue` 톤에 맞춰 단일 명사형 커맨드를 채택한다.

## 체크리스트

### Step 1: 타입 정의 (`types.ts`)

- [ ] `KopisCreatorPerformance` 인터페이스 추가 (`KopisPerformance` + `author: string` + `creator: string`)
- [ ] 별도 요청 타입 없이 `ListParams` 재사용 여부 확인

### Step 2: API 클라이언트 (`client.ts`)

- [ ] `KOPIS_CREATOR_BASE` 상수 추가 (`http://www.kopis.or.kr/openApi/restful/prfper`)
- [ ] `RawCreatorItem` raw 인터페이스 추가 (`RawListItem` + `author` + `creator`)
- [ ] `toCreatorPerformance()` 매핑 함수 추가
- [ ] `getCreatorList(params: ListParams)` 메서드 추가
- [ ] `createKopisClient` 반환 객체에 `getCreatorList` 추가
- [ ] `rows > 100` 방어 로직 재사용 또는 추가

### Step 3: 포맷터 (`table.ts`)

- [ ] `formatCreatorListTable(items: KopisCreatorPerformance[])` 함수 추가
- [ ] 컬럼: 공연ID, 공연명, 장르, 공연장, 기간, 상태, 원작자, 창작자

### Step 4: CLI 커맨드 (`creator.ts`)

- [ ] `creator` 커맨드 등록
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
- [ ] `cli.ts`에 `registerCreatorCommand` 등록

### Step 5: README 업데이트

- [ ] 루트 `README.md`에 사용법 예시 + 옵션 테이블 추가
- [ ] 패키지 `README.md`에 간단 사용법 추가
- [ ] 명령 목록에 `creator` 추가

### Step 6: 검증

- [ ] TypeScript 타입 체크 통과
- [ ] 빌드 통과
- [ ] `creator --format table`, `creator --format json` 수동 확인
- [ ] `rows 101` 입력 시 에러 동작 확인

## 변경 범위 요약

| 파일 | 변경 유형 | 설명 |
|------|-----------|------|
| `packages/kopis-cli/src/kopis/types.ts` | 수정 | `KopisCreatorPerformance` 인터페이스 추가 |
| `packages/kopis-cli/src/kopis/client.ts` | 수정 | `KOPIS_CREATOR_BASE` 상수 + `getCreatorList()` 메서드 추가 |
| `packages/kopis-cli/src/formatters/table.ts` | 수정 | `formatCreatorListTable()` 추가 |
| `packages/kopis-cli/src/commands/creator.ts` | 신규 | creator 커맨드 |
| `packages/kopis-cli/src/cli.ts` | 수정 | creator 커맨드 등록 |
| `README.md` | 수정 | 사용법 + 옵션 테이블 추가 |
| `packages/kopis-cli/README.md` | 수정 | 간단 사용법 추가 |
| `.changeset/*.md` | 신규 | 배포용 patch changeset 추가 |

## 참고

- [KOPIS OpenAPI 원·창작자목록](https://kopis.or.kr/por/cs/openapi/openApiList.do?menuId=MNU_00074&tabId=tab1_8)
- 요청 파라미터는 `find`, `award`, `festival`과 동일한 구조이므로 `ListParams`를 재사용할 수 있다.
- 응답은 기본 공연 목록 필드에 `author`, `creator`만 추가되는 구조다.
