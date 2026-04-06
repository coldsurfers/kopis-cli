# @coldsurf/tickets

[![npm version](https://img.shields.io/npm/v/@coldsurf/tickets.svg)](https://www.npmjs.com/package/@coldsurf/tickets)
[![npm downloads](https://img.shields.io/npm/dm/@coldsurf/tickets.svg)](https://www.npmjs.com/package/@coldsurf/tickets)
[![license](https://img.shields.io/npm/l/@coldsurf/tickets.svg)](https://github.com/coldsurfers/kopis-cli/blob/main/LICENSE)

KOPIS(공연예술통합전산망) OpenAPI를 활용한 공연 정보 CLI 도구입니다.

터미널에서 공연 목록 조회, 상세 정보 확인을 간편하게 할 수 있습니다.

## 설치

```bash
npm install -g @coldsurf/tickets
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
# 환경변수 설정 (권장)
export KOPIS_KEY="발급받은_API_KEY"

# 또는 옵션으로 직접 전달
tickets find --startDate 20250101 --apiKey "발급받은_API_KEY"
```

## 사용법

### 공연 목록 조회

```bash
tickets find --startDate 20250101 --endDate 20251231
tickets find --startDate 20250101 --category GGGA
tickets find --startDate 20250101 --area 11
tickets find --startDate 20250101 --performState 02
tickets find --startDate 20250101 --title 사랑
tickets find --startDate 20250101 --format json
```

### 공연 상세 조회

```bash
tickets detail PF123456
tickets detail PF123456 --format json
```

### 공연시설 목록 조회

```bash
tickets venue --name 예술의전당
tickets venue --area 11
tickets venue --venueType 2
tickets venue --format json
```

## 옵션

### `find` — 공연 목록 조회

| 옵션 | 설명 | 기본값 |
|------|------|--------|
| `--startDate <date>` | 조회 시작일 (yyyyMMdd) | **필수** |
| `--endDate <date>` | 조회 종료일 (yyyyMMdd) | 오늘 |
| `--category <code>` | 장르 필터 | 전체 |
| `--area <code>` | 지역(시도) 필터 | 전체 |
| `--subArea <code>` | 지역(구군) 필터 | 전체 |
| `--facilityCode <code>` | 공연장코드 | - |
| `--performState <code>` | 공연상태 (`01`:예정, `02`:공연중, `03`:완료) | 전체 |
| `--kidState` | 아동공연만 조회 | - |
| `--openRun` | 오픈런만 조회 | - |
| `--afterDate <date>` | 해당 일자 이후 등록/수정 항목만 (yyyyMMdd) | - |
| `--title <name>` | 공연명 검색 | - |
| `--venue <name>` | 공연시설명 검색 | - |
| `--rows <number>` | 페이지당 결과 수 | 50 |
| `--page <number>` | 페이지 번호 | 1 |
| `--format <type>` | 출력 형식 (`table` \| `json`) | table |
| `--apiKey <key>` | KOPIS API Key | `KOPIS_KEY` env |

### `detail` — 공연 상세 조회

| 옵션 | 설명 | 기본값 |
|------|------|--------|
| `<id>` | 공연 ID (필수, positional) | **필수** |
| `--format <type>` | 출력 형식 (`table` \| `json`) | table |
| `--apiKey <key>` | KOPIS API Key | `KOPIS_KEY` env |

### `venue` — 공연시설 목록 조회

| 옵션 | 설명 | 기본값 |
|------|------|--------|
| `--name <name>` | 시설명 검색 | - |
| `--venueType <code>` | 시설특성코드 (1~7) | - |
| `--area <code>` | 지역(시도) 필터 | - |
| `--subArea <code>` | 지역(구군) 필터 | - |
| `--afterDate <date>` | 해당 일자 이후 등록/수정 항목만 (yyyyMMdd) | - |
| `--rows <number>` | 페이지당 결과 수 | 50 |
| `--page <number>` | 페이지 번호 | 1 |
| `--format <type>` | 출력 형식 (`table` \| `json`) | table |
| `--apiKey <key>` | KOPIS API Key | `KOPIS_KEY` env |

## 카테고리 코드

| 코드 | 장르 |
|------|------|
| `CCCD` | 대중음악 |
| `AAAA` | 연극 |
| `CCCA` | 서양음악(클래식) |
| `CCCC` | 한국음악(국악) |
| `GGGA` | 뮤지컬 |
| `BBBC` | 무용(서양/한국무용) |
| `BBBE` | 대중무용 |

## 지역 코드

| 코드 | 지역 |
|------|------|
| `11` | 서울특별시 |
| `26` | 부산광역시 |
| `27` | 대구광역시 |
| `28` | 인천광역시 |
| `29` | 광주광역시 |
| `30` | 대전광역시 |
| `31` | 울산광역시 |
| `36` | 세종특별자치시 |
| `41` | 경기도 |
| `51` | 강원특별자치도 |
| `43` | 충청북도 |
| `44` | 충청남도 |
| `45` | 전라북도 |
| `46` | 전라남도 |
| `47` | 경상북도 |
| `48` | 경상남도 |
| `50` | 제주특별자치도 |

구군 코드 등 상세 코드는 [GitHub README](https://github.com/coldsurfers/kopis-cli#readme)를 참고하세요.

## 데이터 출처

이 도구는 [KOPIS 공연예술통합전산망](https://kopis.or.kr) (예술경영지원센터)에서 제공하는 OpenAPI 데이터를 사용합니다.

## 라이선스

[MIT](https://github.com/coldsurfers/kopis-cli/blob/main/LICENSE)
