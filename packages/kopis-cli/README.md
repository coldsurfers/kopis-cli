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

# JSON 출력 (모든 커맨드 공통)
tickets find --startDate 20250101 --format json
```

전체 옵션, 코드표 등 상세 문서는 [GitHub README](https://github.com/coldsurfers/kopis-cli#readme)를 참고하세요.

## 데이터 출처

이 도구는 [KOPIS 공연예술통합전산망](https://kopis.or.kr) (예술경영지원센터)에서 제공하는 OpenAPI 데이터를 사용합니다.

## 라이선스

[MIT](https://github.com/coldsurfers/kopis-cli/blob/main/LICENSE)
