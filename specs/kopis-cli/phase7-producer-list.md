# Phase 7: 기획/제작사 목록 조회 커맨드

## 목표

KOPIS 기획/제작사목록 API(`/openApi/restful/mnfct`)를 CLI 커맨드로 지원한다.
기존 `venue`(공연시설 목록)와 동일한 패턴으로 `promoter` 커맨드를 추가한다.

## API 스펙

- **엔드포인트**: `http://kopis.or.kr/openApi/restful/mnfct`
- **HTTP 메서드**: GET
- **응답 형식**: XML

### 요청 파라미터

| 변수명 | 필수 | 크기 | 설명 | 샘플데이터 |
|--------|------|------|------|-----------|
| `service` | O | 60 | 발급받은 인증키 | |
| `cpage` | O | 3 | 현재페이지 | `1` |
| `rows` | O | 3 | 페이지당 목록 수 | `5` (최대 100건) |
| `entrpsnm` | X | 100 | 기획/제작사 명 | `국악단` (URLEncoding) |
| `shcate` | X | 4 | 장르코드 | `AAAA` |
| `afterdate` | X | 8 | 해당 일자 이후 등록/수정 항목만 출력 | `20230101` |

### CLI 옵션 매핑

| CLI 옵션 | KOPIS 쿼리 키 | 설명 | 값 예시 |
|----------|---------------|------|---------|
| `--name` | `entrpsnm` | 기획/제작사명 검색 | `국악단` |
| `--category` | `shcate` | 장르코드 필터 | `AAAA` |
| `--afterDate` | `afterdate` | 해당 일자 이후 등록/수정 항목만 출력 | `20230101` |
| `--rows` | `rows` | 페이지당 결과 수 (기본값 50) | `10` |
| `--page` | `cpage` | 페이지 번호 (기본값 1) | `2` |

## 목표 구조

```
packages/kopis-cli/src/
├── kopis/
│   ├── types.ts           # KopisPromoter, PromoterListParams 인터페이스 추가
│   └── client.ts          # getPromoterList() 메서드 추가
├── commands/
│   └── promoter.ts        # promoter 커맨드 (신규)
└── formatters/
    └── table.ts           # formatPromoterListTable() 추가
```

## 체크리스트

### Step 1: 타입 정의 (`types.ts`)

- [x] `KopisPromoter` 인터페이스 추가 (`id`, `name`)
- [x] `PromoterListParams` 인터페이스 추가 (`name?`, `category?`, `afterDate?`, `rows?`, `page?`)

### Step 2: API 클라이언트 (`client.ts`)

- [x] `KOPIS_PROMOTER_BASE` 상수 추가 (`http://www.kopis.or.kr/openApi/restful/mnfct`)
- [x] `RawPromoterItem` raw 인터페이스 추가
- [x] `toPromoter()` 매핑 함수 추가
- [x] `getPromoterList(params: PromoterListParams)` 메서드 추가
- [x] `createKopisClient` 반환 객체에 `getPromoterList` 추가

### Step 3: 포맷터 (`table.ts`)

- [x] `formatPromoterListTable(items: KopisPromoter[])` 함수 추가

### Step 4: CLI 커맨드 (`promoter.ts`)

- [ ] `promoter` 커맨드 등록
- [ ] `--name` 기획/제작사명 검색 옵션
- [ ] `--category` 장르코드 필터 옵션
- [ ] `--afterDate` 등록/수정일 필터 옵션
- [ ] `--rows`, `--page` 페이지네이션 옵션
- [ ] `--format` (table|json) 옵션
- [ ] `--apiKey` 옵션 / `KOPIS_KEY` env fallback
- [ ] `cli.ts`에 `registerPromoterCommand` 등록

### Step 5: README 업데이트

- [ ] 루트 `README.md`에 사용법 예시 + 옵션 테이블 추가

### Step 6: 검증

- [ ] biome check 통과
- [ ] pnpm turbo build 성공
- [ ] 빌드된 CLI 실행 확인

## 변경 범위 요약

| 파일 | 변경 유형 | 설명 |
|------|-----------|------|
| `packages/kopis-cli/src/kopis/types.ts` | 수정 | `KopisPromoter`, `PromoterListParams` 인터페이스 추가 |
| `packages/kopis-cli/src/kopis/client.ts` | 수정 | `KOPIS_PROMOTER_BASE` 상수 + `getPromoterList()` 메서드 추가 |
| `packages/kopis-cli/src/formatters/table.ts` | 수정 | `formatPromoterListTable()` 추가 |
| `packages/kopis-cli/src/commands/promoter.ts` | 신규 | promoter 커맨드 |
| `packages/kopis-cli/src/cli.ts` | 수정 | promoter 커맨드 등록 |
| `README.md` | 수정 | 사용법 + 옵션 테이블 추가 |

## 참고

- [KOPIS OpenAPI 기획/제작사목록](https://kopis.or.kr/por/cs/openapi/openApiList.do?menuId=MNU_00074&tabId=tab1_5)
- 기존 `venue` 커맨드(공연시설 목록)와 동일 패턴
- 응답 XML 구조는 구현 시 실제 API 응답을 확인하여 `RawPromoterItem` / `KopisPromoter` 필드를 확정할 것
