# @coldsurf/tickets

[![npm version](https://img.shields.io/npm/v/@coldsurf/tickets.svg)](https://www.npmjs.com/package/@coldsurf/tickets)
[![npm downloads](https://img.shields.io/npm/dm/@coldsurf/tickets.svg)](https://www.npmjs.com/package/@coldsurf/tickets)
[![license](https://img.shields.io/npm/l/@coldsurf/tickets.svg)](./LICENSE)

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
# 기간별 공연 목록 조회
tickets find --startDate 20250101 --endDate 20251231

# 카테고리 필터
tickets find --startDate 20250101 --category GGGA

# 지역 필터 (서울)
tickets find --startDate 20250101 --area 11

# 구군 단위 필터 (서울 강남구)
tickets find --startDate 20250101 --area 11 --subArea 1168

# 공연상태 필터 (공연중만)
tickets find --startDate 20250101 --performState 02

# 공연장코드 필터
tickets find --startDate 20250101 --facilityCode FC000001-01

# 아동공연만 조회
tickets find --startDate 20250101 --kidState

# 오픈런만 조회
tickets find --startDate 20250101 --openRun

# 특정 날짜 이후 등록/수정된 항목만
tickets find --startDate 20250101 --afterDate 20260401

# 공연명 검색
tickets find --startDate 20250101 --title 사랑

# 공연시설명 검색
tickets find --startDate 20250101 --venue 예술의전당

# JSON 출력
tickets find --startDate 20250101 --format json

# 페이지네이션
tickets find --startDate 20250101 --rows 10 --page 2
```

### 공연 상세 조회

```bash
# 공연 ID로 상세 조회
tickets detail PF123456

# JSON 출력
tickets detail PF123456 --format json
```

### 공연시설 목록 조회

```bash
# 시설명 검색
tickets venue --name 예술의전당

# 지역 필터
tickets venue --area 11

# 시설특성 필터 (문예회관)
tickets venue --venueType 2

# 특정 날짜 이후 등록/수정된 시설만
tickets venue --afterDate 20260101

# JSON 출력
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

## 시설특성코드 (venueType)

| 코드 | 설명 |
|------|------|
| `1` | 중앙정부 |
| `2` | 문예회관 |
| `3` | 기타(공공) |
| `4` | 대학로 |
| `5` | 민간(대학로 외) |
| `6` | 기타(해외등) |
| `7` | 기타(비공연장) |

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

## 구군 코드 (subArea)

행정표준코드 앞 4자리를 사용합니다. 주요 코드는 아래와 같습니다.

<details>
<summary>서울특별시</summary>

| 코드 | 구군 |
|------|------|
| `1111` | 종로구 |
| `1114` | 중구 |
| `1117` | 용산구 |
| `1120` | 성동구 |
| `1121` | 광진구 |
| `1123` | 동대문구 |
| `1126` | 중랑구 |
| `1129` | 성북구 |
| `1130` | 강북구 |
| `1132` | 도봉구 |
| `1135` | 노원구 |
| `1138` | 은평구 |
| `1141` | 서대문구 |
| `1144` | 마포구 |
| `1147` | 양천구 |
| `1150` | 강서구 |
| `1153` | 구로구 |
| `1154` | 금천구 |
| `1156` | 영등포구 |
| `1159` | 동작구 |
| `1162` | 관악구 |
| `1165` | 서초구 |
| `1168` | 강남구 |
| `1171` | 송파구 |
| `1174` | 강동구 |

</details>

<details>
<summary>부산광역시</summary>

| 코드 | 구군 |
|------|------|
| `2611` | 중구 |
| `2614` | 서구 |
| `2617` | 동구 |
| `2620` | 영도구 |
| `2623` | 부산진구 |
| `2626` | 동래구 |
| `2629` | 남구 |
| `2632` | 북구 |
| `2635` | 해운대구 |
| `2638` | 사하구 |
| `2641` | 금정구 |
| `2644` | 강서구 |
| `2647` | 연제구 |
| `2650` | 수영구 |
| `2653` | 사상구 |
| `2671` | 기장군 |

</details>

<details>
<summary>대구광역시</summary>

| 코드 | 구군 |
|------|------|
| `2711` | 중구 |
| `2714` | 동구 |
| `2717` | 서구 |
| `2720` | 남구 |
| `2723` | 북구 |
| `2726` | 수성구 |
| `2729` | 달서구 |
| `2771` | 달성군 |

</details>

<details>
<summary>인천광역시</summary>

| 코드 | 구군 |
|------|------|
| `2811` | 중구 |
| `2814` | 동구 |
| `2817` | 남구 |
| `2818` | 연수구 |
| `2820` | 남동구 |
| `2823` | 부평구 |
| `2824` | 계양구 |
| `2826` | 서구 |
| `2871` | 강화군 |
| `2872` | 옹진군 |

</details>

<details>
<summary>광주광역시</summary>

| 코드 | 구군 |
|------|------|
| `2911` | 동구 |
| `2914` | 서구 |
| `2915` | 남구 |
| `2917` | 북구 |
| `2920` | 광산구 |

</details>

<details>
<summary>대전광역시</summary>

| 코드 | 구군 |
|------|------|
| `3011` | 동구 |
| `3014` | 중구 |
| `3017` | 서구 |
| `3020` | 유성구 |
| `3023` | 대덕구 |

</details>

<details>
<summary>울산광역시</summary>

| 코드 | 구군 |
|------|------|
| `3111` | 중구 |
| `3114` | 남구 |
| `3117` | 동구 |
| `3120` | 북구 |
| `3171` | 울주군 |

</details>

<details>
<summary>경기도</summary>

| 코드 | 시군 |
|------|------|
| `4111` | 수원시 |
| `4113` | 성남시 |
| `4115` | 의정부시 |
| `4117` | 안양시 |
| `4119` | 부천시 |
| `4121` | 광명시 |
| `4122` | 평택시 |
| `4125` | 동두천시 |
| `4127` | 안산시 |
| `4128` | 고양시 |
| `4129` | 과천시 |
| `4131` | 구리시 |
| `4136` | 남양주시 |
| `4137` | 오산시 |
| `4139` | 시흥시 |
| `4141` | 군포시 |
| `4143` | 의왕시 |
| `4145` | 하남시 |
| `4146` | 용인시 |
| `4148` | 파주시 |
| `4150` | 이천시 |
| `4155` | 안성시 |
| `4157` | 김포시 |
| `4159` | 화성시 |
| `4161` | 광주시 |
| `4163` | 양주시 |
| `4165` | 포천시 |
| `4173` | 여주군 |
| `4180` | 연천군 |
| `4182` | 가평군 |
| `4183` | 양평군 |

</details>

<details>
<summary>그 외 지역 (강원, 충북, 충남, 전북, 전남, 경북, 경남, 제주)</summary>

전체 구군 코드는 [KOPIS 공통코드 PDF](https://kopis.or.kr/upload/openApi/%EA%B3%B5%EC%97%B0%EC%98%88%EC%88%A0%ED%86%B5%ED%95%A9%EC%A0%84%EC%82%B0%EB%A7%9DOpenAPI%EA%B3%B5%ED%86%B5%EC%BD%94%EB%93%9C.pdf)를 참고하세요.

</details>

## 데이터 출처

이 도구는 [KOPIS 공연예술통합전산망](https://kopis.or.kr) (예술경영지원센터)에서 제공하는 OpenAPI 데이터를 사용합니다.

자세한 고지 사항은 [NOTICE](./NOTICE) 파일을 참고하세요.

## 라이선스

[MIT](./LICENSE)
